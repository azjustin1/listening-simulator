import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { debounce, filter } from 'lodash-es';
import { Test } from '../../shared/models/test.model';
import { ConfirmDialogComponent } from '../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { QuizService } from '../quizzes/quizzes.service';
import { BandScorePipe } from './band-score.pipe';
import { ResultService } from './result.service';
import { InputPasswordDialogComponent } from '../../shared/dialogs/input-password-dialog/input-password-dialog.component';
import { TestService } from '../../pages/full-test/test.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatMenuModule,
    MatIcon,
    BandScorePipe,
  ],
  providers: [QuizService, ResultService],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
})
export class ResultComponent {
  results: Test[] = [];
  searchString: string = '';
  onSearchChange = debounce(() => this.search(), 500);
  testService = inject(TestService);

  constructor(
    private resultService: ResultService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.testService.getAllTests().subscribe((tests) => {
      this.results = tests;
    });
  }

  search() {
    this.resultService
      .getByStudentName(this.searchString)
      .subscribe((results) => {
        this.results = results;
      });
  }

  view(id?: string) {
    const dialogRef = this.dialog.open(InputPasswordDialogComponent);
    dialogRef.afterClosed().subscribe((isMatch) => {
      if (isMatch && id) {
        this.router.navigate([`result-detail`, id]);
      }
    });
  }

  continue(testId?: string) {
    const test = {
      testId: testId,
    };
    if (testId) {
      this.router.navigate(['tests', testId]);
    }
  }

  onDeleteResultClick(resultId?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
    });
    dialogRef.componentInstance.title = 'Warning';
    dialogRef.componentInstance.isWarning = true;
    dialogRef.componentInstance.message = 'Confirm to delete this?';
    dialogRef.afterClosed().subscribe((isConfirm: boolean) => {
      if (isConfirm && resultId) {
        this.deleteResult(resultId);
      }
    });
  }

  deleteResult(testId: string) {
    this.testService.delete(testId).subscribe((isDeleted) => {
      if (isDeleted) {
        this.results = filter(
          this.results,
          (result) => result.quizId !== testId,
        );
      }
    });
  }

  back() {
    this.router.navigate(['']);
  }
}
