import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep, debounce, filter } from 'lodash-es';
import { Subscription } from 'rxjs';
import { Quiz } from '../../common/models/quiz.model';
import { CommonUtils } from '../../utils/common-utils';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { FileService } from '../file.service';
import { ListeningComponent } from '../listening/listening.component';
import { QuizService } from './quizzes.service';

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ListeningComponent,
    MatIconModule,
    MatMenuModule,
  ],
  providers: [QuizService, FileService],
  templateUrl: './quizzes.component.html',
  styleUrl: './quizzes.component.scss',
})
export class QuizzesComponent implements OnInit, OnDestroy {
  quizzes: Quiz[] = [];
  searchString: string = '';

  onSearch = debounce(() => this.search(), 500);

  subscription: Subscription[] = [];

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.quizService.getAll().subscribe((quizzes) => {
      this.quizzes = quizzes;
    });
  }

  ngOnInit(): void {
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe((state) => {
    });
  }

  search() {
    this.quizService.searchByName(this.searchString).subscribe((quizzes) => {
      this.quizzes = quizzes;
    });
  }

  test(id: string) {
    const newResult = {
      id: CommonUtils.generateRandomId(),
      quizId: id,
    };
    this.router.navigate(['/test', newResult.id], { state: newResult });
  }

  addNewQuiz() {
    this.router.navigate(['add-quiz']);
  }

  edit(id: string) {
    this.router.navigate(['edit-quiz', id]);
  }

  duplicate(quiz: Quiz) {
    let cloneQuiz = cloneDeep(quiz);
    cloneQuiz = {
      ...cloneQuiz,
      id: CommonUtils.generateRandomId(),
      name: `Copy of ${cloneQuiz.name}`,
    };
    this.quizService.create(cloneQuiz).subscribe(() => {
      this.quizzes.push(cloneQuiz);
    });
  }

  onDeleteClick(quiz: Quiz) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
    });

    dialogRef.componentInstance.title = 'Warning';
    dialogRef.componentInstance.message = 'Confirm to delete this?';
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.deleteQuiz(quiz);
      }
    });
  }

  deleteQuiz(deleteQuiz: Quiz) {
    this.quizService.delete(deleteQuiz._id!).subscribe(() => {
      this.quizzes = filter(this.quizzes, (quiz) => deleteQuiz._id !== quiz._id);
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
