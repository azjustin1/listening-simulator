import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { each } from 'lodash-es';
import { Result } from '../../../../common/models/result.model';
import { ScoreUtils } from '../../../../utils/score-utils';
import { ListeningComponent } from '../../part/listening/listening.component';
import { MultipleChoicesComponent } from '../../question/multiple-choices/multiple-choices.component';
import { PartNavigationComponent } from '../../../shared/components/part-navigation/part-navigation.component';
import { ReadingComponent } from '../../part/reading/reading.component';
import { ShortAnswerComponent } from '../../question/short-answer/short-answer.component';
import { WritingComponent } from '../../part/writing/writing.component';
import { BandScorePipe } from '../band-score.pipe';
import { ResultService } from '../result.service';
import { FeedbackComponent } from '../../test/feedback/feedback.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-result-detail',
  standalone: true,
  imports: [
    MultipleChoicesComponent,
    ShortAnswerComponent,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    ReadingComponent,
    ListeningComponent,
    WritingComponent,
    BandScorePipe,
    PartNavigationComponent,
    FeedbackComponent,
    MatDialogModule,
  ],
  providers: [{ provide: MatDialogRef, useValue: {} }],
  templateUrl: './result-detail.component.html',
  styleUrl: './result-detail.component.scss',
})
export class ResultDetailComponent {
  result: Result = {
    id: '',
    name: '',
    studentName: '',
    listeningParts: [],
    readingParts: [],
    writingParts: [],
    correctReadingPoint: 0,
    totalReadingPoint: 0,
    correctListeningPoint: 0,
    totalListeningPoint: 0,
    testDate: '',
    quizId: '',
    isSubmit: false,
  };

  correctListeningPoint = 0;
  totalListeningPoint = 0;

  selectedListeningPart = 0;
  selectedReadingPart = 0;
  selectedWritingPart = 0;

  constructor(
    private route: ActivatedRoute,
    private resultService: ResultService,
    private router: Router,
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const resultId = paramMap.get('resultId');
      if (resultId) {
        this.resultService.getById(resultId).subscribe((result) => {
          this.result = result;
          this.calculateListeningPoint();
        });
      }
    });
  }

  printPage() {
    window.print();
  }

  back() {
    this.router.navigate(['mock-test']);
  }

  private calculateListeningPoint() {
    let correctPoint = 0;
    let totalPoint = 0;
    each(this.result.listeningParts, (part) => {
      each(part.questions, (question) => {
        const scoreResult = ScoreUtils.calculateQuestionPoint(question);
        correctPoint += scoreResult.correct;
        totalPoint += scoreResult.total;
      });
    });
    this.result.correctListeningPoint = correctPoint;
    this.result.totalListeningPoint = totalPoint;
  }
}
