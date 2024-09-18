import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { isEmpty } from 'lodash';
import { MatchingHeaderComponent } from '../../question/matching-header/matching-header.component';
import { MultipleQuestionComponent } from '../../question/multiple-question/multiple-question.component';
import { QuestionComponent } from '../../question/question.component';
import { ReadingComponent } from '../../part/reading/reading.component';
import { SelfReadingService } from '../self-reading/self-reading.service';
import { ChoiceService } from '../../question/choice.service';
import { QuestionService } from '../../question/question.service';
import { Reading } from '../../../../common/models/reading.model';
import { ExportUtils } from '../../../../utils/export.utils';
import { FileService } from '../../../file.service';

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
    MatError,
    MatchingHeaderComponent,
    ReactiveFormsModule,
  ],
  providers: [SelfReadingService, QuestionService, ChoiceService],

  templateUrl: './self-reading-test.component.html',
  styleUrl: './self-reading-test.component.scss',
})
export class SelfReadingTestComponent extends ReadingComponent {
  testForm: FormGroup;
  override data: Reading = {
    id: '',
    name: '',
    content: '',
    questions: [],
    testDate: '',
    timeout: 0,
    wordCount: 0,
  };
  formBuilder = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  selfReadingService = inject(SelfReadingService);
  constructor() {
    super();
    this.testForm = this.formBuilder.group({
      studentName: ['', Validators.required],
      studentEmail: ['', [Validators.required, Validators.email]],
    });
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
    if (this.testForm.valid) {
      const htmlString = ExportUtils.exportSelfReading(this.data);
      this.fileService.generatePdf(htmlString).subscribe((res) => {
        console.log(res);
      });
    } else {
      window.scrollTo(0, 0)
    }
  }
}
