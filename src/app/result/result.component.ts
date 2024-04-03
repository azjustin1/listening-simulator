import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { debounce, filter } from 'lodash-es';
import { Result } from '../../common/models/result.model';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { ListeningComponent } from '../listening/listening.component';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { QuizService } from '../quizzes/quizzes.service';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { ResultService } from './result.service';
import { BandScorePipe } from './band-score.pipe';

@Component({
  selector: 'app-result',
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
    ListeningComponent,
    MatMenuModule,
    MatIcon,
    BandScorePipe,
  ],
  providers: [QuizService, ResultService],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent {
  results: Result[] = [];
  searchString: string = '';
  onSearchChange = debounce(() => this.search(), 500);
  listeningBand = 0;
  readingBand = 0;

  constructor(
    private route: ActivatedRoute,
    private resultService: ResultService,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.resultService.getAll().subscribe((results) => {
      this.results = results;
    });
  }

  search() {
    this.resultService
      .getByStudentName(this.searchString)
      .subscribe((results) => {
        this.results = results;
      });
  }

  view(id: string) {
    this.router.navigate([`result-detail`, id]);
  }

  onDeleteResultClick(resultId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
    });

    dialogRef.componentInstance.title = 'Warning';
    dialogRef.componentInstance.message = 'Confirm to delete this?';
    dialogRef.afterClosed().subscribe((isConfirm: boolean) => {
      if (isConfirm) {
        this.deleteResult(resultId);
      }
    });
  }

  deleteResult(resultId: string) {
    this.resultService.deleteById(resultId).subscribe(() => {
      this.results = filter(this.results, (result) => result.id !== resultId);
    });
  }

  back() {
    this.router.navigate(['']);
  }
}
