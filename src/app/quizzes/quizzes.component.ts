import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Listening } from '../../common/models/listening.model';
import { Quiz } from '../../common/models/quiz.model';
import { CommonUtils } from '../../utils/common-utils';
import { FileService } from '../file.service';
import { ListeningComponent } from '../listening/listening.component';
import { QuizService } from './quizzes.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';

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
    ListeningComponent,
    MatIconModule,
  ],
  providers: [QuizService, FileService],
  templateUrl: './quizzes.component.html',
  styleUrl: './quizzes.component.css',
})
export class QuizzesComponent implements OnDestroy {
  currentQuiz: Quiz = {
    id: '',
    name: '',
    timeout: null,
    listeningParts: [],
  };

  subscription: Subscription[] = [];

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const quizId = paramMap.get('quizId');
      if (quizId) {
        const sub = this.quizService.getById(quizId).subscribe((quiz: any) => {
          this.currentQuiz = quiz;
        });
        this.subscription.push(sub);
      }
    });
  }

  onAddListeningPart() {
    const newListeningPart: Listening = {
      id: CommonUtils.generateRandomId(),
      name: '',
      questions: [],
      audioName: '',
    };
    this.currentQuiz.listeningParts.push(newListeningPart);
  }

  removePart(index: number) {
    this.currentQuiz.listeningParts.splice(index, 1);
  }

  onSaveClick() {
    if (this.currentQuiz.name == '' || this.currentQuiz.timeout === null) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        hasBackdrop: true,
      });

      dialogRef.componentInstance.title = 'Warning';
      dialogRef.componentInstance.message = 'You are missing some fields?';
      dialogRef.componentInstance.isWarning = true;
    } else {
      this.saveOrEditQuiz(this.currentQuiz);
    }
  }

  saveOrEditQuiz(quiz: any) {
    let observer;
    if (quiz.id) {
      observer = this.quizService.editQuiz(quiz);
    } else {
      quiz.id = CommonUtils.generateRandomId();
      observer = this.quizService.createQuiz(quiz);
    }
    const sub = observer.subscribe(() => {
      this.router.navigate(['/']);
    });
    this.subscription.push(sub);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
