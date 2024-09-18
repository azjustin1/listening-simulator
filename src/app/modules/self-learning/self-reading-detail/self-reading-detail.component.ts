import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { each, isEmpty } from 'lodash-es';
import { Observable } from 'rxjs';
import { Reading } from '../../../../common/models/reading.model';
import { MatchingHeaderComponent } from '../../question/matching-header/matching-header.component';
import { MultipleQuestionComponent } from '../../question/multiple-question/multiple-question.component';
import { ChoiceService } from '../../question/choice.service';
import { QuestionComponent } from '../../question/question.component';
import { QuestionService } from '../../question/question.service';
import { ReadingComponent } from '../../part/reading/reading.component';
import { SelfReadingService } from '../self-reading/self-reading.service';

@Component({
  selector: 'app-self-reading-detail',
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
  providers: [SelfReadingService, QuestionService, ChoiceService],
  templateUrl: './self-reading-detail.component.html',
  styleUrl: './self-reading-detail.component.scss',
})
export class SelfReadingDetailComponent extends ReadingComponent {
  override data: Reading = {
    id: '',
    name: '',
    content: '',
    questions: [],
    testDate: '',
    timeout: 0,
    wordCount: 0,
  };
  override isEditting: boolean = true;
  selfReadingService = inject(SelfReadingService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  isReady = false;

  override ngOnInit(): void {
    const readingId = this.route.snapshot.params['readingId'];
    this.isTesting = this.router.url.includes('test');

    if (!isEmpty(readingId)) {
      this.selfReadingService.getSelfReadingById(readingId).subscribe((res) => {
        this.data = res;

        each(this.data.questions, (question) => {
          this.mapSavedQuestion[question._id!] = true;
        });
      });
    }
  }

  saveReading() {
    let observer: Observable<Reading>;
    if (this.data._id) {
      observer = this.selfReadingService.updateSelfReading(this.data);
    } else {
      observer = this.selfReadingService.createSelfReading(this.data);
    }

    this.subscriptions.add(
      observer.subscribe((res) => {
        this.data = { ...this.data, questions: res.questions };
        this.router.navigate(['self-learning/teacher']);
      }),
    );
  }

  override removeQuestion(questionId: string, questionIdex: number): void {
    this.subscriptions.add(this.questionService.deleteQuestion(questionId).subscribe(() => {
      this.data.questions.splice(questionIdex, 1);
    }));
  }

  onStartTest() {
    this.isReady = true;
  }
}
