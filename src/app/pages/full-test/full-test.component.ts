import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  clone,
  each,
  flatMap,
  isEmpty,
  isUndefined,
  mapValues,
  toArray,
} from 'lodash-es';
import { interval, Subscription } from 'rxjs';
import { Quiz } from '../../shared/models/quiz.model';
import { Test } from '../../shared/models/test.model';
import { ExportUtils } from '../../utils/export.utils';
import { ScoreUtils } from '../../utils/score-utils';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { FileService } from '../../file.service';
import { ListeningComponent } from '../../tabs/listening/listening.component';
import { PartNavigationComponent } from '../../shared/components/part-navigation/part-navigation.component';
import { QuizService } from '../../modules/quizzes/quizzes.service';
import { ReadingComponent } from '../../tabs/reading/reading.component';
import { WritingComponent } from '../../tabs/writing/writing.component';
import { TestService } from './test.service';
import { FeedbackDialog } from '../../shared/dialogs/feedback-dialog/feedback-dialog.component';
import {
  Time,
  TimerComponent,
} from '../../shared/components/timer/timer.component';
import { Tab } from '../../shared/enums/tab.enum';
import { QuestionNavigationComponent } from '../../modules/question/question-navigation/question-navigation.component';
import { AbstractSection } from '../../shared/models/abstract-section.model';
import { Question } from '../../shared/models/question.model';
import { QuestionType } from '../../shared/enums/question-type.enum';
import { Choice } from '../../shared/models/choice.model';
import { Part } from '../../shared/models/part.model';
import { QuestionService } from '../../modules/question/question.service';

const SAVE_INTERVAL = 120000;
const SECOND_INTERVAL = 1000;
const DEFAULT_START_TIMEOUT = {
  minutes: 5,
  seconds: 0,
};

export interface QuestionIndex {
  index: number;
  id?: string;
  isAnswer: boolean;
  answer: string[];
  isReviewed: boolean;
}

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    ListeningComponent,
    ReadingComponent,
    WritingComponent,
    PartNavigationComponent,
    TimerComponent,
    QuestionNavigationComponent,
  ],
  providers: [QuizService, TestService, QuestionService],
  templateUrl: './full-test.component.html',
  styleUrl: './full-test.component.scss',
})
export class FullTestComponent implements OnInit, OnDestroy {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  @HostListener('document:keydown.control.s', ['$event'])
  onCtrlSaveHandler() {
    this.onCtrlSave();
  }

  tabs = Tab;
  mapQuestionPart: Record<string, number> = {};
  selectedListeningPart = 0;
  selectedReadingPart = 0;
  selectedWritingPart = 0;
  mapSavedPart: Record<string, Record<number, boolean>> = {
    listening: {},
    reading: {},
    writing: {},
  };
  test!: Test;
  testTime: Time = {
    minutes: 0,
    seconds: 0,
  };
  startTime: Time = clone(DEFAULT_START_TIMEOUT);
  totalSeconds: number = 0;
  testTimeoutIntervalSub!: Subscription;
  testTimeoutInterval: number = 0;
  startTimeoutInterval: number = SECOND_INTERVAL;
  isReady: boolean = false;
  isStart: boolean = false;
  currentTab = 0;
  mapDisablePart: Record<number, boolean> = {
    0: false,
    1: true,
    2: true,
  };
  mapAnsweredQuestionId: Record<string, QuestionIndex[]> = {};
  selectedId = signal<string>('');
  selectedQuestionIndex = signal<QuestionIndex | null>(null);
  mapAnswerByChoiceId: { [key: string]: string } = {};
  selectedChoiceId = '';
  subscriptions: Subscription = new Subscription();
  saveQuestionSub: Subscription = new Subscription();

  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fileService: FileService,
    protected testService: TestService,
  ) {}

  ngOnInit() {
    const testId = this.route.snapshot.params['testId'];
    if (testId) {
      this.subscriptions.add(
        this.testService.getById(testId).subscribe((test) => {
          this.test = test;
          this.generateAnswerMap(this.test);
          this.isReady = !isEmpty(this.test.studentName);
          this.totalSeconds = this.test.listening.timeout! * 60;
          if (this.audioPlayer) {
            this.audioPlayer.nativeElement.currentTime =
              this.test.listening.audioTime ?? 0;
            this.audioPlayer.nativeElement.load();
          }
          if (this.test.currentTab) {
            this.currentTab = this.test.currentTab;
            this.disableOthersTab();
            this.mapDisablePart[this.currentTab] = false;
          }
          this.getTestTimeout();
          this.generateMapAnswered();
        }),
      );
      this.startAutoSave();
    }
  }

  ngOnDestroy(): void {
    if (this.testTimeoutIntervalSub) {
      this.testTimeoutIntervalSub.unsubscribe();
    }
  }

  generateAnswerMap(test: Test): void {
    test.listening.parts.forEach((part) => {
      part.questions.forEach((question) => {
        this.testService.answerQuestion(
          question._id!,
          this.test.answers![question._id!] ?? '',
        );
      });
    });
    test.reading.parts.forEach((part) => {
      part.questions.forEach((question) => {
        this.testService.answerQuestion(question._id!, ['']);
      });
    });
  }

  startAutoSave() {
    const saveInterval = interval(SAVE_INTERVAL).subscribe(() => {
      this.onCtrlSave();
    });
    this.subscriptions.add(saveInterval);
  }

  onChangeTab(tab: number) {
    this.currentTab = tab;
    this.isStart = false;
    this.getTestTimeout();
  }

  getTestTimeout() {
    if (this.currentTab === this.tabs.LISTENING) {
      this.totalSeconds = this.test.listening.timeout! * 60;
    }
    if (this.currentTab === this.tabs.READING) {
      this.totalSeconds = this.test.reading.timeout! * 60;
    }
    if (this.currentTab === this.tabs.WRITING) {
      this.totalSeconds = this.test.writing.timeout! * 60;
    }
    this.testTime = {
      minutes: Math.floor(this.totalSeconds / 60),
      seconds: this.totalSeconds % 60,
    };
  }

  onStartTest() {
    this.isReady = true;
    this.testService.saveCurrentTest(this.test).subscribe((savedTest) => {
      this.test = savedTest;
    });
  }

  onCtrlSave() {
    if (this.saveQuestionSub != null) {
      this.saveQuestionSub.unsubscribe();
    }
    this.saveTimeout();
    this.test.currentTab = this.currentTab;
    console.log(this.testService.getAnswers());
    this.test.answers = this.testService.getAnswers();
    this.saveQuestionSub = this.testService
      .saveCurrentTest(this.test)
      .subscribe();
  }

  saveTimeout() {
    const timeout = this.testTime.minutes + this.testTime.seconds / 60;
    if (this.currentTab === this.tabs.LISTENING) {
      this.test.listening.timeout = timeout;
    }
    if (this.currentTab === this.tabs.READING) {
      this.test.reading.timeout = timeout;
    }
    if (this.currentTab === this.tabs.WRITING) {
      this.test.reading.timeout = timeout;
    }
  }

  onStartPart() {
    if (this.currentTab === 0 && this.audioPlayer) {
      this.audioPlayer.nativeElement.play().then(() => {});
    }
    this.isStart = true;
    this.startTimeoutInterval = 0;
    this.testTimeoutInterval = SECOND_INTERVAL;
    this.testTimeoutIntervalSub = interval(SECOND_INTERVAL).subscribe(() => {
      if (this.currentTab === 0) {
        if (isEmpty(this.test.listening.audioTime)) {
          this.test.listening = {
            ...this.test.listening,
            audioTime: 0,
          };
        }
        this.test.listening.audioTime! += 1;
      }
    });
  }

  showTimeOutDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
    });
    dialogRef.componentInstance.title = 'Information';
    dialogRef.componentInstance.message = "Time's up";
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.updateTab();
        this.afterSubmit();
      }
    });
  }

  updateTab() {
    this.startTimeoutInterval = SECOND_INTERVAL;
    this.startTime = clone(DEFAULT_START_TIMEOUT);
    this.testTimeoutInterval = 0;
    this.disableOthersTab();
    this.mapDisablePart[this.currentTab + 1] = false;
    this.mapAnsweredQuestionId = {};
    this.currentTab = this.currentTab + 1;
    this.generateMapAnswered();
  }

  onTestTimeout() {
    this.testTimeoutInterval = 0;
    if (this.currentTab === 0) {
      this.audioPlayer.nativeElement.pause();
    }
    this.testTimeoutIntervalSub.unsubscribe();
    this.showTimeOutDialog();
  }

  onStartTimeOut() {
    this.startTimeoutInterval = 0;
    this.isStart = true;
    this.testTimeoutInterval = SECOND_INTERVAL;
  }

  afterSubmit() {
    let htmlString = '';
    if (this.currentTab === this.tabs.LISTENING + 1) {
      this.audioPlayer.nativeElement.pause();
      htmlString += ExportUtils.exportListening(this.test);
      this.subscriptions.add(
        this.fileService
          .generatePdfFile(
            'Listening',
            htmlString,
            this.test.studentName,
            this.test.quizName,
          )
          .subscribe(),
      );
      this.generateMapAnswered();
    }
    if (this.currentTab === this.tabs.READING + 1) {
      htmlString += ExportUtils.exportReading(this.test);
      this.subscriptions.add(
        this.fileService
          .generatePdfFile(
            'Reading',
            htmlString,
            this.test.studentName,
            this.test.quizName,
          )
          .subscribe(),
      );
      this.generateMapAnswered();
    }
    if (this.currentTab === this.tabs.WRITING + 1) {
      htmlString += ExportUtils.exportWriting(this.test);
      this.subscriptions.add(
        this.fileService
          .generatePdfFile(
            'Writing',
            htmlString,
            this.test.studentName,
            this.test.quizName,
          )
          .subscribe(),
      );
      this.showFeedbackDialog();
    }
    if (this.testTimeoutIntervalSub) {
      this.testTimeoutIntervalSub.unsubscribe();
    }
    this.test = { ...this.test, currentTab: this.currentTab };
    this.saveQuestionSub = this.testService
      .saveCurrentTest(this.test)
      .subscribe();
  }

  onSubmitPartClick() {
    this.showSubmitDialog();
  }

  showSubmitDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.title = 'Information';
    dialogRef.componentInstance.message = 'Submit this test?';
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.updateTab();
        this.afterSubmit();
      }
    });
  }

  showFeedbackDialog() {
    const dialogRef = this.dialog.open(FeedbackDialog, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((feedback) => {
      this.test.feedback = feedback;
      let htmlString = ExportUtils.exportFeedback(this.test);
      this.subscriptions.add(
        this.fileService
          .generatePdfFile(
            'Feedback',
            htmlString,
            this.test.studentName,
            this.test.quizName,
          )
          .subscribe(),
      );
      this.submit();
    });
  }

  submit() {
    if (!this.audioPlayer.nativeElement.paused) {
      this.audioPlayer.nativeElement.pause();
    }
    this.calculateListeningPoint();
    this.calculateReadingPoint();
    this.test.isFinished = true;
    this.onCtrlSave();
    this.router.navigate(['mock-test']);
  }

  private disableOthersTab() {
    this.mapDisablePart = mapValues(this.mapDisablePart, () => true);
  }

  private calculateListeningPoint() {
    let correctPoint = 0;
    let totalPoint = 0;
    each(this.test.listening!.parts, (part) => {
      each(part.questions, (question) => {
        const scoreResult = ScoreUtils.calculateQuestionPoint(question);
        correctPoint += scoreResult.correct;
        totalPoint += scoreResult.total;
      });
    });
    this.test.correctListeningPoint = correctPoint;
    this.test.totalListeningPoint = totalPoint;
  }

  private calculateReadingPoint() {
    let correctPoint = 0;
    let totalPoint = 0;
    // each(this.result.reading, (part) => {
    //   if (part.isMatchHeader) {
    //     each(part.questions, (question) => {
    //       totalPoint++;
    //       const score = ScoreUtils.forDropdown(question);
    //       correctPoint += score.correct;
    //     });
    //   } else {
    //     each(part.questions, (question) => {
    //       each(question.subQuestions, (subQuestion) => {
    //         const scoreResult = ScoreUtils.calculateQuestionPoint(subQuestion);
    //         correctPoint += scoreResult.correct;
    //         totalPoint += scoreResult.total;
    //       });
    //     });
    //   }
    // });
    this.test.correctReadingPoint = correctPoint;
    this.test.totalReadingPoint = totalPoint;
  }

  generateQuestionMap() {
    let parts: Part[] | undefined = [];
    switch (this.currentTab) {
      case Tab.LISTENING:
        parts = this.test.listening!.parts;
        break;
      case Tab.READING:
        parts = this.test.reading!.parts;
        break;
      case Tab.WRITING:
        parts = this.test.writing!.parts;
        break;
      default:
        break;
    }
    // each(parts, (part, index: number) => {
    //   if (part.isMatchHeader) {
    //     this.mapQuestionPart[part._id!] = index;
    //   } else {
    //     each(part.questions, (question) => {
    //       this.mapQuestionPart[question._id] = index;
    //     });
    //   }
    // });
  }

  navigateToQuestion(id: string) {
    const part = this.mapQuestionPart[id];
    switch (this.currentTab) {
      case Tab.LISTENING:
        this.selectedListeningPart = part;
        break;
      case Tab.READING:
        this.selectedReadingPart = part;
        break;
      case Tab.WRITING:
        this.selectedWritingPart = part;
        break;
      default:
        break;
    }
  }

  generateMapAnswered() {
    this.mapAnsweredQuestionId = {};
    this.mapQuestionPart = {};
    this.generateQuestionMap();
    this.selectedQuestionIndex.set(null);
    if (this.currentTab === Tab.LISTENING) {
      this.generatePartQuestionIndex(this.test.listening!.parts);
    }
    if (this.currentTab === Tab.READING) {
      this.generatePartQuestionIndex(this.test.reading!.parts);
    }
  }

  private generatePartQuestionIndex(parts: Part[]) {
    let index = 0;
    each(parts, (part) => {
      if (part.isMatchHeader) {
        if (isUndefined(this.mapAnsweredQuestionId[part._id!])) {
          this.mapAnsweredQuestionId[part._id!] = [];
        }
        each(part.questions, (question) => {
          this.mapAnsweredQuestionId[part._id!].push({
            index: index,
            id: question._id!,
            answer: [question.answer as string],
            isAnswer:
              !isEmpty(question.answer) && !isUndefined(question.answer),
            isReviewed: false,
          });
          index++;
        });
      } else {
        each(part.questions, (question) => {
          if (isUndefined(this.mapAnsweredQuestionId[question._id!])) {
            this.mapAnsweredQuestionId[question._id!] = [];
          }
          switch (question.type) {
            case QuestionType.SHORT_ANSWER:
            case QuestionType.DRAG_AND_DROP_ANSWER:
            case QuestionType.FILL_IN_THE_GAP:
            case QuestionType.FILL_IN_TABLE:
            case QuestionType.DRAG_IN_TABLE:
              each(question.choices, (choice) => {
                this.mapAnsweredQuestionId[question._id!].push({
                  index: index,
                  id: choice._id,
                  answer: [choice.answer as string],
                  isAnswer:
                    !isEmpty(choice.answer) && !isUndefined(choice.answer),
                  isReviewed: false,
                });
                this.mapAnswerByChoiceId[choice._id!] = '';
                this.selectedChoiceId = choice._id!;
                index++;
              });
              break;
            case QuestionType.LABEL_ON_MAP:
              each(question.subQuestions, (subQuestion) => {
                this.mapAnsweredQuestionId[question._id!].push({
                  index: index,
                  id: subQuestion._id!,
                  answer: [],
                  isAnswer: !isEmpty(subQuestion.answer),
                  isReviewed: false,
                });
                index++;
              });
              break;
            case QuestionType.MULTIPLE_CHOICE:
              for (let i = 0; i < question.numberOfChoices!; i++) {
                this.generateMultipleChoiceIndex(question, index);
                index++;
              }
              break;
            case QuestionType.DROPDOWN_ANSWER:
              this.generateDropdownChoiceIndex(question, index);
              index++;
              break;
          }
        });
      }
    });
  }

  generateMultipleChoiceIndex(question: Question, index: number) {
    this.mapAnsweredQuestionId[question._id!].push({
      id: question._id,
      index: index,
      answer: question.answer as string[],
      isAnswer: false,
      isReviewed: false,
    });
    if (!isEmpty(question.answer)) {
      for (let i = 0; i < question.answer.length; i++) {
        if (this.mapAnsweredQuestionId[question._id!][i]) {
          this.mapAnsweredQuestionId[question._id!][i].isAnswer = true;
        }
      }
    }
  }

  private generateDropdownChoiceIndex(question: Question, index: number) {
    this.mapAnsweredQuestionId[question._id!].push({
      id: question._id!,
      index: index,
      answer: question.answer as string[],
      isAnswer: !isEmpty(question.answer),
      isReviewed: false,
    });
  }

  onMapAnsweredQuestion(question: Question) {
    if (this.mapAnsweredQuestionId[question._id!]) {
      switch (question.type) {
        case QuestionType.FILL_IN_THE_GAP:
        case QuestionType.FILL_IN_TABLE:
        case QuestionType.DRAG_AND_DROP_ANSWER:
        case QuestionType.DRAG_IN_TABLE:
          each(question.choices, (choice) => {
            this.mapAnswerByChoiceId[choice._id!] = clone(choice.answer!);
          });
          each(this.mapAnsweredQuestionId[question._id!], (questionIndex) => {
            questionIndex.answer = [
              this.mapAnswerByChoiceId[questionIndex.id as string],
            ];
            questionIndex.isAnswer =
              !isEmpty(this.mapAnswerByChoiceId[questionIndex.id!]) &&
              !isUndefined(this.mapAnswerByChoiceId[questionIndex.id!]);
          });
          break;
        case QuestionType.MULTIPLE_CHOICE:
          this.updateSelectedForMultipleChoice(question);
          this.updateQuestionForMultipleChoice(question);
          break;
        case QuestionType.DROPDOWN_ANSWER:
          this.updateSelectedForDropDownChoice(question);
          break;
        case QuestionType.MATCHING_HEADER:
          this.updateSelectedForMultipleChoice(question);
          break;
        case QuestionType.LABEL_ON_MAP:
          const mapAnsweredBySubQuestionId: Record<string, boolean> = {};
          each(question.subQuestions, (subQuestion) => {
            mapAnsweredBySubQuestionId[subQuestion._id!] = !isEmpty(
              subQuestion.answer,
            );
          });
          each(this.mapAnsweredQuestionId[question._id!], (questionIndex) => {
            questionIndex.isAnswer =
              mapAnsweredBySubQuestionId[questionIndex.id!];
          });
          break;
      }
    }
  }

  onMapHeaderAnswered(question: Question, part: AbstractSection) {
    this.selectedId.set(question._id!);
    each(this.mapAnsweredQuestionId[part._id!], (questionIndex) => {
      if (questionIndex.id === question._id!) {
        questionIndex.answer = [question.answer as string];
        questionIndex.isAnswer = !isEmpty(question.answer);
        this.selectedQuestionIndex.set(questionIndex);
      }
    });
    this.mapAnsweredQuestionId = { ...this.mapAnsweredQuestionId };
  }

  onMapAnswerChoice(choice: Choice) {
    if (choice) {
      this.selectedId.set(choice._id!);
      this.selectedQuestionIndex.set(
        flatMap(toArray(this.mapAnsweredQuestionId)).find(
          (questionIndex) =>
            questionIndex.id && questionIndex.id === choice._id,
        )!,
      );
    }
  }

  onMapReviewQuestion(reviewedQuestionIndex: QuestionIndex) {
    each(this.mapAnsweredQuestionId, (questionIndexes) => {
      each(questionIndexes, (questionIndex) => {
        if (questionIndex.id === reviewedQuestionIndex.id) {
          questionIndex.isReviewed = reviewedQuestionIndex.isReviewed;
        }
      });
    });
  }

  updateSelectedForDropDownChoice(question: Question) {
    const questionIndex = this.mapAnsweredQuestionId[question._id!][0];
    if (questionIndex) {
      questionIndex.isAnswer = !isEmpty(question.answer);
    }
    this.selectedQuestionIndex.set(questionIndex);
  }

  updateSelectedForMultipleChoice(question: Question) {
    each(this.mapAnsweredQuestionId[question._id!], (questionIndex) => {
      questionIndex.answer = question.answer as string[];
    });
    const questionIndexes = this.mapAnsweredQuestionId[question._id!].map(
      (questionIndex: QuestionIndex) => {
        questionIndex = {
          ...questionIndex,
          id: question._id,
          answer: question.answer as string[],
          isAnswer: false,
        };
        return questionIndex;
      },
    );
    for (let i = 0; i < question.answer.length; i++) {
      questionIndexes[i].isAnswer = true;
    }
    this.mapAnsweredQuestionId[question._id!] = questionIndexes;
    this.selectedQuestionIndex.set(
      questionIndexes[questionIndexes[0].answer.length - 1],
    );
  }

  updateQuestionForMultipleChoice(question: Question) {
    this.test.listening!.parts.forEach((part) => {
      part.questions.forEach((q) => {
        if (q._id === question._id) {
          q.answer = question.answer as string[];
        }
      });
    });
    this.test.reading!.parts.forEach((part) => {
      part.questions.forEach((q) => {
        if (q._id === question._id) {
          q.answer = question.answer as string[];
        }
      });
    });
  }

  onTabChange(key: string, index: number) {
    this.mapSavedPart[key][index] = true;
  }
}
