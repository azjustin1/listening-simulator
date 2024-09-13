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
import { isEmpty } from 'lodash';
import { MatchingHeaderComponent } from '../../matching-header/matching-header.component';
import { MultipleQuestionComponent } from '../../multiple-question/multiple-question.component';
import { QuestionComponent } from '../../question/question.component';
import { ReadingComponent } from '../../reading/reading.component';
import { SelfReadingService } from '../self-reading/self-reading.service';
import { ChoiceService } from '../../question/choice.service';
import { QuestionService } from '../../question/question.service';
import { Reading } from '../../../common/models/reading.model';

@Component({
  selector: 'app-self-reading-test',
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

  templateUrl: './self-reading-test.component.html',
  styleUrl: './self-reading-test.component.scss',
})
export class SelfReadingTestComponent extends ReadingComponent {
  override data: Reading = {
    id: '',
    name: '',
    content: '',
    questions: [],
    testDate: '',
    timeout: 0,
    wordCount: 0,
  };
  route = inject(ActivatedRoute);
  router = inject(Router);
  selfReadingService = inject(SelfReadingService);

  constructor() {
    super();
    this.isTesting = true;
    const readingId = this.route.snapshot.params['readingId'];
    this.isTesting = this.router.url.includes('test');

    if (!isEmpty(readingId)) {
      this.selfReadingService.getSelfReadingById(readingId).subscribe((res) => {
        this.data = res;
      });
    }
  }
  submit() {
    console.log(this.data)
  }
}
