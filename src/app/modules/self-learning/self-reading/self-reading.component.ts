import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { Reading } from '../../../../common/models/reading.model';
import { MatchingHeaderComponent } from '../../question/matching-header/matching-header.component';
import { MultipleQuestionComponent } from '../../question/multiple-question/multiple-question.component';
import { QuestionComponent } from '../../question/question.component';
import { SelfReadingService } from './self-reading.service';
import { QuestionService } from '../../question/question.service';
import { ChoiceService } from '../../question/choice.service';

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
    MatMenuModule,
  ],
  providers: [SelfReadingService, QuestionService, ChoiceService],
  templateUrl: './self-reading.component.html',
  styleUrl: './self-reading.component.scss',
})
export class SelfReadingComponent {
  isTeacher = signal(false);
  readingTests: Reading[] = [];

  selfReadingService = inject(SelfReadingService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  constructor() {
    this.isTeacher.set(this.router.url.includes('teacher'));
    this.selfReadingService.getAllSelfReading().subscribe((res) => {
      this.readingTests = res;
    });
  }

  onAddNewTest() {
    const reading = {} as Reading;
    this.selfReadingService.createSelfReading(reading).subscribe((resp) => {
      this.router.navigate(['/self-learning/teacher', resp._id]);
    });
  }

  editTest(testId: string) {
    this.router.navigate(['/self-learning/teacher', testId]);
  }

  takeTest(testId: string) {
    this.router.navigate(['/self-learning/test', testId]);

  }

  onDeleteTest(test: Reading) {}
}
