import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FileService } from '../file.service';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { CommonUtils } from '../../utils/common-utils';
import { MatIconModule } from '@angular/material/icon';
import { ListeningService } from './listening.service';

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MultipleChoicesComponent,
    ShortAnswerComponent,
    MatIconModule,
  ],
  providers: [ListeningService, FileService],
  templateUrl: './listening.component.html',
  styleUrl: './listening.component.css',
})
export class ListeningComponent implements OnDestroy {
  selectedFile: any;
  currentQuiz: any = {
    name: '',
    timeout: null,
    questions: [],
  };
  currentQuestion: any = {
    content: '',
    description: '',
    type: null,
    choices: [],
  };

  subscription: Subscription[] = [];

  constructor(
    private listeningService: ListeningService,
    private fileServie: FileService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const quizId = paramMap.get('quizId');
      if (quizId) {
        this.listeningService.getById(quizId).subscribe((quiz: any) => {
          this.currentQuiz = quiz;
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  addQuestion(questionType: number) {
    switch (questionType) {
      case 0:
        this.currentQuestion = {
          id: CommonUtils.generateRandomId(),
          content: '',
          type: questionType,
          choices: this.defaultMultipleChoices(),
        };
        break;
      case 1:
        this.currentQuestion = {
          id: CommonUtils.generateRandomId(),
          content: '',
          type: questionType,
          choices: [],
        };
        break;
      default:
        break;
    }
    this.currentQuiz.questions.push({ ...this.currentQuestion });
    this.currentQuiz = { ...this.currentQuiz };
  }

  defaultMultipleChoices() {
    const choices = [];
    for (let i = 0; i < 4; i++) {
      const choice = {
        id: CommonUtils.generateRandomId(),
        content: '',
      };
      choices.push(choice);
    }
    return choices;
  }

  defaultShortAnswerChoices() {
    const choices = [];
    for (let i = 0; i < 4; i++) {
      const choice = {
        id: CommonUtils.generateRandomId(),
        content: '',
        index: '',
      };
      choices.push(choice);
    }
    return choices;
  }

  saveQuestion() {
    this.currentQuestion = {
      name: '',
      time: null,
      choices: [],
    };
  }

  removeQuestion(index: number) {
    this.currentQuiz.questions.splice(index, 1);
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
  }

  onSaveClick() {
    if (this.selectedFile) {
      if (this.selectedFile.name !== this.currentQuiz.audioName) {
        const deleteSub = this.fileServie
          .deleteFile(this.currentQuiz.audioName)
          .subscribe();
        this.subscription.push(deleteSub);
      }
      this.uploadFile();
    } else {
      this.saveOrEditQuiz(this.currentQuiz);
    }
  }

  uploadFile() {
    const uploadSub = this.fileServie
      .uploadAudioFile(this.selectedFile)
      .subscribe((res) => {
        this.subscription.push(uploadSub);
        if (res) {
          this.currentQuiz.audioName = res.fileName;
          this.saveOrEditQuiz(this.currentQuiz);
        }
      });
    this.subscription.push(uploadSub);
  }

  saveOrEditQuiz(quiz: any) {
    let observer;
    if (quiz.id) {
      observer = this.listeningService.editQuiz(quiz);
    } else {
      quiz.id = CommonUtils.generateRandomId();
      observer = this.listeningService.createQuiz(quiz);
    }
    const sub = observer.subscribe(() => {
      this.router.navigate(['/']);
    });
    this.subscription.push(sub);
  }
}
