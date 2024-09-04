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
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { MatchingHeaderComponent } from '../../matching-header/matching-header.component';
import { MultipleQuestionComponent } from '../../multiple-question/multiple-question.component';
import { QuestionComponent } from '../../question/question.component';
import { SelfReadingService } from '../self-reading/self-reading.service';
import { ReadingComponent } from '../../reading/reading.component';
import { Reading } from '../../../common/models/reading.model';
import { ActivatedRoute } from '@angular/router';
import { isEmpty } from 'lodash-es';

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
  providers: [SelfReadingService],
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

  override ngOnInit(): void {
    const readingId = this.route.snapshot.params['readingId'];
    if (!isEmpty(readingId)) {
      this.selfReadingService.getSelfReadingById(readingId).subscribe((res) => {
        this.data = res;
      });
    }
  }

  saveReading() {
    this.selfReadingService.createSelfReading(this.data).subscribe((res) => {
      this.data = { ...res };
    });
  }
}
