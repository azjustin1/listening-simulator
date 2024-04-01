import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { each } from 'lodash-es';
import { Subscription, interval } from 'rxjs';
import { Question } from '../../common/models/question.model';
import { Quiz } from '../../common/models/quiz.model';
import { Result } from '../../common/models/result.model';
import { CommonUtils } from '../../utils/common-utils';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { FileService } from '../file.service';
import { ListeningComponent } from '../listening/listening.component';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { AddOrEditQuizComponent } from '../quizzes/add-or-edit-quiz/add-or-edit-quiz.component';
import { QuizService } from '../quizzes/quizzes.service';
import { ReadingComponent } from '../reading/reading.component';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { WritingComponent } from '../writing/writing.component';
import { TestService } from './test.service';

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
  styleUrl: './test.component.css',
})
export class TestComponent extends AddOrEditQuizComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  result: Result = {
    id: '',
    name: '',
    studentName: '',
    correctPoint: 0,
    totalPoint: 0,
    testDate: '',
    quizId: '',
    listeningParts: [],
    readingParts: [],
    writingParts: [],
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

  subscriptions: Subscription[] = [];

  isReady: boolean = false;
  isStart: boolean = false;

  currentTab = 0;

  mapDisablePart: Record<number, boolean> = {
    0: false,
    1: true,
    2: true,
  };

  correctPoints: number = 0;
  totalPoints: number = 0;

  constructor(
    protected override quizService: QuizService,
    protected override route: ActivatedRoute,
    protected override router: Router,
    protected override dialog: MatDialog,
    protected override fileService: FileService,
    protected testService: TestService,
  ) {
    super(quizService, fileService, route, router, dialog);
    this.route.paramMap.subscribe((paramMap: any) => {
      const quizId = paramMap.get('quizId');
      if (quizId) {
        this.quizService.getById(quizId).subscribe((quiz: any) => {
          this.quiz = quiz;
          this.totalSeconds = this.quiz.listeningTimeout! * 60;
          this.audioPlayer.nativeElement.load();
          this.getTimeout();
        });
      }
    });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.timeoutInterval) {
      this.timeoutInterval.unsubscribe();
    }
  }

  onChangeTab(tab: number) {
    this.currentTab = tab;
    this.isStart = false;
    this.getTimeout();
  }

  getTimeout() {
    if (this.currentTab === 0) {
      this.totalSeconds = this.quiz.listeningTimeout! * 60;
    }
    if (this.currentTab === 1) {
      this.totalSeconds = this.quiz.readingTimeout! * 60;
    }
    if (this.currentTab === 2) {
      this.totalSeconds = this.quiz.writingTimeout! * 60;
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

  submit() {
    this.audioPlayer.nativeElement.pause();
    this.result.id = CommonUtils.generateRandomId();
    this.result.testDate = this.getCurrentDate();
    this.result.name = this.quiz.name;
    this.result.quizId = this.quiz.id!;
    this.result.listeningParts = this.quiz.listeningParts;
    this.result.readingParts = this.quiz.readingParts;
    this.result.writingParts = this.quiz.writingParts;
    this.calculatePoint();
    this.testService.submitTest(this.result).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  onStartTest() {
    this.isReady = true;
  }

  onListeningStart() {
    this.audioPlayer.nativeElement.play();
    this.onStartPart();
  }

  onStartPart() {
    if (this.currentTab === 0) {
      this.audioPlayer.nativeElement.play();
    }
    this.isStart = true;
    this.timeoutInterval = interval(1000).subscribe(() => {
      if (this.seconds === 0) {
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
    }
    this.mapDisablePart[tab] = true;
    this.mapDisablePart[tab + 1] = false;
    this.currentTab = tab + 1;
    if (this.timeoutInterval) {
      this.timeoutInterval.unsubscribe();
    }
  }

  private getCurrentDate() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  private calculatePoint() {
    each(this.result.listeningParts, (part) => {
      this.calculateQuestionPoints(part.questions);
    });

    each(this.result.readingParts, (part) => {
      this.calculateQuestionPoints(part.questions);
    });
    this.result.totalPoint = this.totalPoints;
    this.result.correctPoint = this.correctPoints;
  }

  calculateQuestionPoints(questions: Question[]) {
    each(questions, (question) => {
      switch (question.type) {
        case 0:
          // Multiple choices
          this.totalPoints++;
          if (question.answer === question.correctAnswer) {
            this.correctPoints++;
          }
          break;
        case 1:
          // Short answer
          each(question.choices, (choice) => {
            this.totalPoints++;
            if (choice.answer === choice.correctAnswer) {
              this.correctPoints++;
            }
          });
          break;
        case 2:
          this.calculateQuestionPoints(question.subQuestions!);
          break;
        default:
          break;
      }
    });
  }
}
