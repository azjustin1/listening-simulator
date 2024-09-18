import {
  Component,
  Input,
  OnInit,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
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
import { each } from 'lodash-es';
import { AbstractQuizPartComponent } from '../../../../common/abstract-quiz-part.component';
import { Choice } from '../../../../common/models/choice.model';
import { Question } from '../../../../common/models/question.model';
import { Reading } from '../../../../common/models/reading.model';
import { MatchingHeaderComponent } from '../../question/matching-header/matching-header.component';
import { MultipleQuestionComponent } from '../../question/multiple-question/multiple-question.component';
import { QuestionComponent } from '../../question/question.component';
import { ReadingService } from './reading.service';

@Component({
  selector: 'app-reading',
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
  providers: [ReadingService],
  templateUrl: './reading.component.html',
  styleUrl: './reading.component.scss',
})
export class ReadingComponent
  extends AbstractQuizPartComponent<Reading>
  implements OnInit
{
  @Input() isMatchingHeader = false;
  mapSavedQuestion: Record<string, boolean> = {};
  answers: WritableSignal<Choice[]> = signal([]);

  ngOnInit(): void {
    if (this.data) {
      each(this.data.questions, (question) => {
        this.mapSavedQuestion[question._id!] = true;
      });
    }
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes['data'] && this.data) {
      this.answers.set(this.data.answers!);
    }
  }

  override onSaveQuestion(question: Question): void {
    super.onSaveQuestion(question);
    this.mapSavedQuestion[question._id!] = true;
  }

  override onEditQuestion(id: string): void {
    super.onEditQuestion(id);
    this.mapSavedQuestion[id] = false;
  }
}
