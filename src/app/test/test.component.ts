import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { each } from 'lodash-es';
import { Subscription, interval } from 'rxjs';
import { Quiz } from '../../common/models/quiz.model';
import { Result } from '../../common/models/result.model';
import { CommonUtils } from '../../utils/common-utils';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { ListeningComponent } from '../listening/listening.component';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { QuizService } from '../quizzes/quizzes.service';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { TestService } from './test.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ReadingComponent } from '../reading/reading.component';
import { WritingComponent } from '../writing/writing.component';

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
export class TestComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  @ViewChildren('audioElement') audioElements!: QueryList<
    ElementRef<HTMLAudioElement>
  >;
  audioUrl: string = '';
  result: Result = {
    id: '',
    name: '',
    timeout: null,
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
    timeout: null,
    listeningParts: [],
    readingParts: [],
    writingParts: [],
  };
  subscriptions: Subscription[] = [];

  minutes: number = 0;
  seconds: number = 0;
  totalSeconds: number = 0;
  interval = {};
  isReady: boolean = false;

  currentTab = 0;

  mapDisablePart: Record<number, boolean> = {
    0: false,
    1: true,
    2: true,
  };

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private testService: TestService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const quizId = paramMap.get('quizId');
      if (quizId) {
        this.quizService.getById(quizId).subscribe((quiz: any) => {
          this.quiz = quiz;
          this.totalSeconds = quiz.timeout * 60;
          this.minutes = Math.floor(this.totalSeconds / 60);
          this.seconds = this.totalSeconds % 60;
        });
      }
    });
  }

  onChangeTab(tab: number) {
    this.currentTab = tab;
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
    this.startTimer();
    setTimeout(() => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        hasBackdrop: true,
        disableClose: true,
      });
      dialogRef.componentInstance.title = 'Information';
      dialogRef.componentInstance.message = "Time's up";
      dialogRef.componentInstance.isWarning = true;
      dialogRef.afterClosed().subscribe((isConfirm) => {
        if (isConfirm) {
          this.submit();
        }
      });
    }, this.totalSeconds * 1000);
  }

  startTimer() {
    const sub = interval(1000).subscribe(() => {
      if (this.seconds === 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
    });
    this.subscriptions.push(sub);
  }

  private getCurrentDate() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }

  onSubmitPartClick(tab: number) {
    this.mapDisablePart[tab] = true;
    if (tab + 1 < 3) {
      this.mapDisablePart[tab + 1] = false;
      this.currentTab = tab + 1;
    }
  }

  private calculatePoint() {
    let totalPoint = 0;
    let correctPoint = 0;
    each(this.result.listeningParts, (part) => {
      each(part.questions, (question) => {
        if (question.type === 0) {
          // Multiple choices
          totalPoint++;
          if (question.answer === question.correctAnswer) {
            correctPoint++;
          }
        }

        if (question.type === 1) {
          // Short answer
          each(question.choices, (choice) => {
            totalPoint++;
            if (choice.answer === choice.content) {
              correctPoint++;
            }
          });
        }
      });
    });

    each(this.result.readingParts, (paragraph) => {
      each(paragraph.questions, (question) => {
        if (question.type === 2) {
          // Dropdown choices
          totalPoint++;
          if (question.answer === question.correctAnswer) {
            correctPoint++;
          }
        }

        if (question.type === 1) {
          // Short answer
          each(question.choices, (choice) => {
            totalPoint++;
            if (choice.answer === choice.content) {
              correctPoint++;
            }
          });
        }
      });
    });
    this.result.totalPoint = totalPoint;
    this.result.correctPoint = correctPoint;
  }

  ngOnDestroy() {
    each(this.subscriptions, (sub) => {
      sub.unsubscribe();
    });
  }
}
