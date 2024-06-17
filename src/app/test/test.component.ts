import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { asBlob } from 'html-docx-js-typescript';
import {
  each,
  intersection,
  isEqual,
  isString,
  isUndefined,
  mapValues,
} from 'lodash-es';
import { Subscription, interval } from 'rxjs';
import { questionType } from '../../common/enums/question-type.enum';
import { Choice } from '../../common/models/choice.model';
import { Question } from '../../common/models/question.model';
import { Quiz } from '../../common/models/quiz.model';
import { Result } from '../../common/models/result.model';
import { CommonUtils } from '../../utils/common-utils';
import { CHOICE_INDEX } from '../../utils/constant';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { AnswerChoicePipe } from '../dropdown-choices/answer-choice.pipe';
import { FileService } from '../file.service';
import { ListeningComponent } from '../listening/listening.component';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { AddOrEditQuizComponent } from '../quizzes/add-or-edit-quiz/add-or-edit-quiz.component';
import { QuizService } from '../quizzes/quizzes.service';
import { ReadingComponent } from '../reading/reading.component';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { WritingComponent } from '../writing/writing.component';
import { TestService } from './test.service';
const ID_LENGTH = 20;
const SAVE_INTERVAL = 120000;

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    MultipleChoicesComponent,
    ShortAnswerComponent,
    CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    ListeningComponent,
    ReadingComponent,
    WritingComponent,
  ],
  providers: [QuizService, TestService],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent extends AddOrEditQuizComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  @HostListener('document:keydown.control.s', ['$event'])
  override onKeydownHandler(event: KeyboardEvent) {
    this.onCtrlSave();
  }

  result: Result = {
    id: '',
    name: '',
    studentName: '',
    correctReadingPoint: 0,
    totalReadingPoint: 0,
    correctListeningPoint: 0,
    totalListeningPoint: 0,
    testDate: '',
    quizId: '',
    listeningParts: [],
    readingParts: [],
    writingParts: [],
    isSubmit: false,
  };
  quiz: Quiz = {
    id: '',
    name: '',
    listeningParts: [],
    readingParts: [],
    writingParts: [],
  };

  minutes: number = 0;
  seconds: number = 0;
  totalSeconds: number = 0;
  timeoutInterval!: Subscription;

  isReady: boolean = false;
  isStart: boolean = false;

  currentTab = 0;

  mapDisablePart: Record<number, boolean> = {
    0: false,
    1: true,
    2: true,
  };

  constructor(
    protected override quizService: QuizService,
    protected override route: ActivatedRoute,
    protected override router: Router,
    protected override dialog: MatDialog,
    protected override fileService: FileService,
    protected testService: TestService,
  ) {
    super(quizService, fileService, route, router, dialog);
    const quizId = this.router.getCurrentNavigation()?.extras.state?.['quizId'];
    if (quizId) {
      this.quizService.getById(quizId).subscribe((quiz) => {
        quiz.audioTime = 0;
        this.quiz = quiz;
        this.result = { ...quiz };
        this.totalSeconds = this.result.listeningTimeout! * 60;
        this.audioPlayer.nativeElement.load();
        this.getTimeout();
      });

      this.startAutoSave();
    }

    const testId = this.router.getCurrentNavigation()?.extras.state?.['testId'];
    if (testId) {
      this.testService.getResultById(testId).subscribe((result) => {
        this.result = result;
        this.totalSeconds = this.result.listeningTimeout! * 60;
        this.audioPlayer.nativeElement.currentTime = this.result.audioTime!;
        this.audioPlayer.nativeElement.load();
        if (this.result.currentTab) {
          this.currentTab = this.result.currentTab;
          this.disableOthersTab();
          this.mapDisablePart[this.currentTab] = false;
        }
        this.getTimeout();
      });
      this.isReady = true;
      this.startAutoSave();
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.timeoutInterval) {
      this.timeoutInterval.unsubscribe();
    }
  }

  startAutoSave() {
    const saveInterval = interval(SAVE_INTERVAL).subscribe(() => {
      this.onCtrlSave();
    });
    this.subscriptions.push(saveInterval);
  }

  onChangeTab(tab: number) {
    this.currentTab = tab;
    this.isStart = false;
    this.getTimeout();
  }

  getTimeout() {
    if (this.currentTab === 0) {
      this.totalSeconds = this.result.listeningTimeout! * 60;
    }
    if (this.currentTab === 1) {
      this.totalSeconds = this.result.readingTimeout! * 60;
    }
    if (this.currentTab === 2) {
      this.totalSeconds = this.result.writingTimeout! * 60;
    }
    this.minutes = Math.floor(this.totalSeconds / 60);
    this.seconds = this.totalSeconds % 60;
  }

  onSubmitClick() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.title = 'Information';
    dialogRef.componentInstance.message = 'Submit this test?';
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.submit();
      }
    });
  }

  onStartTest() {
    this.isReady = true;
    this.result.id = CommonUtils.generateRandomId();
    this.testService.submitTest(this.result).subscribe();
  }

  onCtrlSave() {
    this.saveTimeout();
    this.result.testDate = CommonUtils.getCurrentDate();
    this.result.currentTab = this.currentTab;
    this.subscriptions.push(
      this.testService.saveCurrentTest(this.result).subscribe(),
    );
  }

  saveTimeout() {
    const timeout = this.minutes + this.seconds / 60;
    if (this.currentTab === 0) {
      this.result.listeningTimeout = timeout;
    }

    if (this.currentTab === 1) {
      this.result.readingTimeout = timeout;
    }

    if (this.currentTab === 2) {
      this.result.writingTimeout = timeout;
    }
  }

  submit() {
    if (!this.audioPlayer.nativeElement.paused) {
      this.audioPlayer.nativeElement.pause();
    }
    this.exportWriting();
    this.calculateListeningPoint();
    this.calculateReadingPoint();
    this.result.isSubmit = true;
    this.onCtrlSave();
    this.router.navigate(['mock-test']);
  }

  exportListening() {
    let htmlString = `<h1>${this.result.name} - Listening</h1><br><h2>Name: ${this.result.studentName}</h2><br><h2>Point: </h2><br>`;
    each(this.result.listeningParts, (part, index) => {
      htmlString += `<h3>Part ${index + 1}</h3><br>`;
      each(part.questions, (question) => {
        htmlString += `<p>${question.content ? question.content : ''}</p><br>`;
        if (question.type === 3) {
          htmlString += `${AnswerChoicePipe.prototype.transform(question)}<br>`;
        } else {
          each(question.choices, (choice, index) => {
            if (question.type === 0) {
              if (question.answer.includes(choice.id!)) {
                htmlString += `<u>${CHOICE_INDEX[index]}. ${choice.content ? choice.content : ''}</u><br>`;
              } else {
                htmlString += `${CHOICE_INDEX[index]}. ${choice.content ? choice.content : ''}<br>`;
              }
            } else {
              htmlString += `<b>${choice.index ? choice.index : ''}</b> ${choice.answer ? choice.answer : ''}<br>`;
            }
          });
        }
      });
      htmlString += '<hr>';
    });
    asBlob(htmlString).then((data: any) => {
      saveAs(
        data,
        `${this.result.studentName}_Listening_${this.result.name}_${CommonUtils.getCurrentDate()}`,
      );
    });
  }

  exportReading() {
    let htmlString = `<h1>${this.result.name} - Reading</h1><br><h2>Name: ${this.result.studentName}</h2><br><h2>Point: </h2><br>`;
    each(this.result.readingParts, (part, index) => {
      htmlString += `<h3>Part ${index + 1}</h3><br>`;
      htmlString += `<p>${part.content}</p><br>`;
      each(part.questions, (question) => {
        htmlString += `<b>${question.name ? question.name : ''}<b><br>`;
        each(question.subQuestions, (subQuestion) => {
          htmlString += `<p>${subQuestion.content ? subQuestion.content : ''}</p><br>`;
          if (subQuestion.type === 3) {
            htmlString += `${AnswerChoicePipe.prototype.transform(subQuestion)}<br>`;
          } else {
            each(subQuestion.choices, (choice, index) => {
              if (subQuestion.type === 0) {
                if (subQuestion.answer.includes(choice.id!)) {
                  htmlString += `<u>${CHOICE_INDEX[index]}. ${choice.content ? choice.content : ''}</u><br>`;
                } else {
                  htmlString += `${CHOICE_INDEX[index]}. ${choice.content ? choice.content : ''}<br>`;
                }
              } else {
                htmlString += `<b>${choice.index ? choice.index : ''}</b> ${choice.answer ? choice.answer : ''}<br>`;
              }
            });
          }
        });
        htmlString += '<hr>';
      });
    });
    asBlob(htmlString).then((data: any) => {
      saveAs(
        data,
        `${this.result.studentName}_Reading_${this.result.name}_${CommonUtils.getCurrentDate()}`,
      );
    });
  }

  exportWriting() {
    let htmlString = `<h1>${this.result.name} - Writing</h1><br><h2>Name: ${this.result.studentName}</h2><br><h2>Point: </h2><br>`;
    each(this.result.writingParts, (part) => {
      htmlString =
        htmlString + part.content + '<br>' + part.answer + '<hr><br>';
    });

    asBlob(htmlString).then((data: any) => {
      saveAs(
        data,
        `${this.result.studentName}_Writing_${this.result.name}_${CommonUtils.getCurrentDate()}`,
      );
    });
  }

  onListeningStart() {
    this.onStartPart();
  }

  onStartPart() {
    if (this.currentTab === 0 && this.audioPlayer) {
      this.audioPlayer.nativeElement.play();
    }
    this.isStart = true;
    this.timeoutInterval = interval(1000).subscribe(() => {
      if (this.currentTab === 0) {
        this.result.audioTime! += 1;
      }
      if (this.seconds < 1) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
      if (this.minutes === 0 && this.seconds === 0) {
        if (this.currentTab === 0) {
          this.audioPlayer.nativeElement.pause();
        }
        this.timeoutInterval.unsubscribe();
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          hasBackdrop: true,
          disableClose: true,
        });
        dialogRef.componentInstance.title = 'Information';
        dialogRef.componentInstance.message = "Time's up";
        dialogRef.componentInstance.isWarning = true;
        dialogRef.afterClosed().subscribe((isConfirm) => {
          if (isConfirm) {
            this.onSubmitPartClick(this.currentTab);
            if (this.currentTab > 2) {
              this.submit();
            }
          }
        });
      }
    });
  }

  onSubmitPartClick(tab: number) {
    if (tab === 0) {
      this.audioPlayer.nativeElement.pause();
      this.exportListening();
    }
    if (tab === 1) {
      this.exportReading();
    }
    this.disableOthersTab();
    this.mapDisablePart[tab + 1] = false;
    this.currentTab = tab + 1;
    if (this.timeoutInterval) {
      this.timeoutInterval.unsubscribe();
    }
    this.result = { ...this.result, currentTab: this.currentTab };
    this.subscriptions.push(
      this.testService.saveCurrentTest(this.result).subscribe(),
    );
  }

  private disableOthersTab() {
    this.mapDisablePart = mapValues(this.mapDisablePart, () => true);
  }

  private calculateListeningPoint() {
    let correctPoint = 0;
    let totalPoint = 0;
    each(this.result.listeningParts, (part) => {
      each(part.questions, (question) => {
        switch (question.type) {
          case 0:
            // Multiple choices
            totalPoint = totalPoint + question.correctAnswer.length;
            if (
              intersection(question.correctAnswer, question.answer).length !== 0
            ) {
              correctPoint =
                correctPoint +
                intersection(question.correctAnswer, question.answer).length;
            }
            break;
          case 1:
            // Short answer
            each(question.choices, (choice) => {
              totalPoint++;
              if (this.isCorrectAnswer(choice)) {
                correctPoint++;
              }
            });
            break;
          case 3:
            totalPoint++;
            if (question.answer === question.correctAnswer) {
              correctPoint++;
            }
            break;
          default:
            break;
        }
      });
    });
    this.result.correctListeningPoint = correctPoint;
    this.result.totalListeningPoint = totalPoint;
  }

  private calculateReadingPoint() {
    let correctPoint = 0;
    let totalPoint = 0;
    each(this.result.readingParts, (part) => {
      each(part.questions, (question) => {
        each(question.subQuestions, (subQuestion) => {
          switch (subQuestion.type) {
            case 0:
              // Multiple choices
              totalPoint = totalPoint + question.answer.length;
              if (this.isCorrectChoices(subQuestion)) {
                correctPoint++;
              }
              break;
            case 1:
              // Short answer
              each(subQuestion.choices, (choice) => {
                totalPoint++;
                if (this.isCorrectAnswer(choice)) {
                  correctPoint++;
                }
              });
              break;
            case 3:
              totalPoint++;
              if (subQuestion.answer === subQuestion.correctAnswer) {
                correctPoint++;
              }
              break;
            default:
              break;
          }
        });
      });
    });
    this.result.correctReadingPoint = correctPoint;
    this.result.totalReadingPoint = totalPoint;
  }

  private isCorrectAnswer(choice: Choice) {
    return (
      choice.answer !== '' &&
      !isUndefined(choice.answer) &&
      !isUndefined(choice.correctAnswer) &&
      (choice.answer?.trim() === choice.correctAnswer?.trim() ||
        choice.correctAnswer?.split('/').includes(choice.answer?.trim()))
    );
  }

  private isCorrectChoices(question: Question) {
    if (
      question.type === questionType.DROPDOWN_ANSWER ||
      isString(question.answer)
    ) {
      return question.answer === question.correctAnswer;
    }

    return (
      question.answer.length > 0 &&
      isEqual(question.answer.sort(), question.correctAnswer.sort())
    );
  }
}
