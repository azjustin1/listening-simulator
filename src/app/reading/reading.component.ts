import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { each } from 'lodash-es';
import { Subscription } from 'rxjs';
import { AbstractQuizPartComponent } from '../../common/abstract-quiz-part.component';
import { Choice } from '../../common/models/choice.model';
import { Reading } from '../../common/models/reading.model';
import { MultipleQuestionComponent } from '../multiple-question/multiple-question.component';
import { QuestionComponent } from '../question/question.component';
import { ReadingService } from './reading.service';

@Component({
  selector: 'app-reading',
  standalone: true,
  imports: [
    FormsModule,
    MatListModule,
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
  ],
  providers: [ReadingService],
  templateUrl: './reading.component.html',
  styleUrl: './reading.component.scss',
})
export class ReadingComponent
  extends AbstractQuizPartComponent<Reading>
  implements OnInit
{
  mapSavedQuestion: Record<string, boolean> = {};

  subscription: Subscription[] = [];

  ngOnInit(): void {
    if (this.data) {
      each(this.data.questions, (question) => {
        this.mapSavedQuestion[question.id!] = true;
      });
    }
  }

  getChoiceById(id: string, choices: Choice[]) {
    return choices.find((choice) => choice.id === id);
  }

  override onSaveQuestion(id: string): void {
    super.onSaveQuestion(id);
    this.mapSavedQuestion[id] = true;
  }

  override onEditQuestion(id: string): void {
    super.onEditQuestion(id);
    this.mapSavedQuestion[id] = false;
  }

  removeSubQuesiton(questionIndex: number, subQuestionIndex: number) {
    this.data.questions[questionIndex].subQuestions!.splice(
      subQuestionIndex,
      1,
    );
  }
}
