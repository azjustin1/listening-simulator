import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Test } from '../../../shared/models/test.model';
import { ListeningComponent } from '../../../tabs/listening/listening.component';
import { PartNavigationComponent } from '../../../shared/components/part-navigation/part-navigation.component';
import { ReadingComponent } from '../../../tabs/reading/reading.component';
import { WritingComponent } from '../../../tabs/writing/writing.component';
import { BandScorePipe } from '../band-score.pipe';
import { ResultService } from '../result.service';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ExportUtils } from '../../../utils/export.utils';
import { forkJoin } from 'rxjs';
import { FeedbackDialog } from '../../../shared/dialogs/feedback-dialog/feedback-dialog.component';
import { FileService } from '../../../file.service';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { TestService } from '../../../pages/full-test/test.service';
import { QuestionService } from '../../question/question.service';

@Component({
  selector: 'app-result-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    ReadingComponent,
    ListeningComponent,
    WritingComponent,
    BandScorePipe,
    PartNavigationComponent,
    FeedbackDialog,
    MatDialogModule,
  ],
  providers: [{ provide: MatDialogRef, useValue: {} }, QuestionService],
  templateUrl: './result-detail.component.html',
})
export class ResultDetailComponent {
  result!: Test;
  correctListeningPoint = 0;
  totalListeningPoint = 0;
  selectedListeningPart = 0;
  selectedReadingPart = 0;
  selectedWritingPart = 0;
  fileService: FileService = inject(FileService);
  testService = inject(TestService);
  dialog: MatDialog = inject(MatDialog);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const resultId = paramMap.get('resultId');
      if (resultId) {
        this.testService.getById(resultId).subscribe((result) => {
          this.result = result;
          console.log(result);
          this.generateAnswerMap(result);
        });
      }
    });
  }

  generateAnswerMap(test: Test): void {
    test.listening.parts.forEach((part) => {
      part.questions.forEach((question) => {
        this.testService.answerQuestion(
          question._id!,
          test.answers![question._id!] ?? '',
        );
      });
    });
    test.reading.parts.forEach((part) => {
      part.questions.forEach((question) => {
        this.testService.answerQuestion(question._id!, ['']);
      });
    });
  }

  export() {
    forkJoin([
      this.fileService.generatePdfFile(
        'Listening',
        ExportUtils.exportListening(this.result),
        this.result.studentName,
        this.result.quizName,
      ),
      this.fileService.generatePdfFile(
        'Reading',
        ExportUtils.exportReading(this.result),
        this.result.studentName,
        this.result.quizName,
      ),
      this.fileService.generatePdfFile(
        'Writing',
        ExportUtils.exportWriting(this.result),
        this.result.studentName,
        this.result.quizName,
      ),
      this.fileService.generatePdfFile(
        'Feedback',
        ExportUtils.exportFeedback(this.result),
        this.result.studentName,
        this.result.quizName,
      ),
    ]).subscribe(() => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent);
      dialogRef.componentInstance.title = 'Information';
      dialogRef.componentInstance.message = 'Download successfully';
    });
  }

  back() {
    this.router.navigate(['mock-test']).then(() => {});
  }
}
