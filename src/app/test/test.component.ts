import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { toArray } from 'lodash-es';
import { FileService } from '../file.service';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { QuizService } from '../quizzes/quizzes.service';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
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
  ],
  providers: [QuizService, TestService],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  audioUrl: string = '';
  result: any = {
    name: '',
    timeout: null,
    questions: [],
    studentName: null,
  };
  quiz: any;
  mapQuestionById: Record<string, any> = {};

  minutes: number = 0;
  seconds: number = 0;
  totalSeconds: number = 0;
  interval: any;
  isReady: boolean = false;

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private testService: TestService,
    private fileService: FileService,
    private router: Router
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const quizId = paramMap.get('quizId');
      if (quizId) {
        this.quizService.getById(quizId).subscribe((quiz: any) => {
          this.quiz = quiz;
          this.totalSeconds = quiz.timeout * 60;
          this.minutes = Math.floor(this.totalSeconds / 60);
          this.seconds = this.totalSeconds % 60;
          this.generateMapQuestion(quiz.questions);
          this.getAudioFile(quiz.fileName);
        });
      }
    });
  }

  generateMapQuestion(questions: any[]) {
    questions.forEach((question) => {
      this.mapQuestionById[question.id] = question;
    });
  }

  getAudioFile(fileName: string) {
    this.fileService.getFile(fileName).subscribe((audioFile: Blob) => {
      const fileURL = URL.createObjectURL(audioFile);
      const audioElement: HTMLAudioElement = this.audioPlayer.nativeElement;
      this.audioUrl = fileURL;
      audioElement.load();
    });
  }

  submit() {
    this.result.questions = toArray(this.mapQuestionById);
    this.result.quizId = this.quiz.id;
    this.testService.submitTest(this.result).subscribe(() => {
      this.router.navigate(['']);
    });
  }

  onStartTest() {
    this.isReady = true;
    this.audioPlayer.nativeElement.play();
    this.startTimer();
    setTimeout(() => {
      this.submit();
    }, this.totalSeconds * 1000);
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.seconds === 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  onMultipleChoiceSelect(choiceId: string, questionId: string) {
    this.mapQuestionById[questionId] = {
      ...this.mapQuestionById[questionId],
      answer: choiceId,
    };
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
