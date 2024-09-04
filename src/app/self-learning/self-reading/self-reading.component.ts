import { Component, inject } from '@angular/core';
import { ReadingComponent } from '../../reading/reading.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { MatchingHeaderComponent } from '../../matching-header/matching-header.component';
import { MultipleQuestionComponent } from '../../multiple-question/multiple-question.component';
import { QuestionComponent } from '../../question/question.component';
import { ReadingService } from '../../reading/reading.service';
import { Reading } from '../../../common/models/reading.model';
import { SelfReadingService } from './self-reading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-self-reading',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MultipleQuestionComponent,
    QuestionComponent,
    MatIconModule,
    MatExpansionModule,
    AngularEditorModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatchingHeaderComponent,
  ],
  providers: [SelfReadingService],
  templateUrl: './self-reading.component.html',
  styleUrl: './self-reading.component.scss',
})
export class SelfReadingComponent {
  readingTests: Reading[] = [];

  selfReadingService = inject(SelfReadingService);
  router = inject(Router);

  constructor() {
    this.selfReadingService.getAllSelfReading().subscribe((res) => {
      this.readingTests = res;
    });
  }

  editTest(testId: string) {
    this.router.navigate(['/self-learning/teacher', testId]);
  }
}
