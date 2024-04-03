import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Result } from '../../../common/models/result.model';
import { ListeningComponent } from '../../listening/listening.component';
import { MultipleChoicesComponent } from '../../multiple-choices/multiple-choices.component';
import { ReadingComponent } from '../../reading/reading.component';
import { ShortAnswerComponent } from '../../short-answer/short-answer.component';
import { WritingComponent } from '../../writing/writing.component';
import { ResultService } from '../result.service';
import { each } from 'lodash-es';
import { Question } from '../../../common/models/question.model';
import { BandScorePipe } from '../band-score.pipe';

@Component({
  selector: 'app-result-detail',
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
    ReadingComponent,
    ListeningComponent,
    WritingComponent,
    BandScorePipe,
  ],

  templateUrl: './result-detail.component.html',
  styleUrl: './result-detail.component.css',
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
  };

  correctListeningPoint = 0;
  totalListeningPoint = 0;

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
        });
      }
    });
  }

  printPage() {
    window.print();
  }

  back() {
    this.router.navigate(['']);
  }
}
