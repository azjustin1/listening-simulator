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
import { CommonModule } from '@angular/common';
import {
  Time,
  TimerComponent,
} from '../../../shared/components/timer/timer.component';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EmailService } from '../../../shared/services/email.service';

const SECOND_INTERVAL = 1000;

@Component({
  selector: 'app-self-reading-test',
  standalone: true,
  imports: [
    CommonModule,
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
    TimerComponent,
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
  testTime: Time = {
    minutes: 0,
    seconds: 0,
  };
  testTimeoutInterval: number = 0;

  dialog = inject(MatDialog);
  formBuilder = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  selfReadingService = inject(SelfReadingService);
  mailService = inject(EmailService);

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
        this.getTimeout(this.data.timeout ? this.data.timeout * 60 : 0);
      });
    }
  }

  getTimeout(totalSeconds: number) {
    this.testTime = {
      minutes: Math.floor(totalSeconds / 60),
      seconds: totalSeconds % 60,
    };
  }

  onStart() {
    this.isStart = true;
    this.testTimeoutInterval = SECOND_INTERVAL;
  }

  onTestTimeout() {
    this.testTimeoutInterval = 0;
    this.showTimeOutDialog();
  }

  showTimeOutDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      disableClose: true,
    });
    dialogRef.componentInstance.title = 'Information';
    dialogRef.componentInstance.message = "Time's up";
    dialogRef.componentInstance.isWarning = true;
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.submit();
      }
    });
  }

  submit() {
    const studentName = this.testForm.get('studentName')?.value;
    const studentEmail = this.testForm.get('studentEmail')?.value;
    const htmlString = ExportUtils.exportSelfReading(this.data);
    this.mailService
      .send(htmlString, studentName, studentEmail)
      .subscribe((res) => {
        if (res) {
          if (window && window.top) {
            window.top.location.href = 'https://www.beablevn.com/tự-học';
          }
        }
      });
  }
}
