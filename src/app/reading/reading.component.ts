import { CommonModule } from '@angular/common';
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
import { each, isUndefined } from 'lodash-es';
import { Subscription } from 'rxjs';
import { AbstractQuizPartComponent } from '../../common/abstract-quiz-part.component';
import { Choice } from '../../common/models/choice.model';
import { Question } from '../../common/models/question.model';
import { Reading } from '../../common/models/reading.model';
import { CommonUtils } from '../../utils/common-utils';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { ReadingService } from './reading.service';
import { DropdownChoiceComponent } from '../dropdown-choice/dropdown-choice.component';
import { MultipleQuestionComponent } from '../multiple-question/multiple-question.component';

@Component({
  selector: 'app-reading',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MultipleChoicesComponent,
    ShortAnswerComponent,
    MultipleQuestionComponent,
    MatIconModule,
    MatExpansionModule,
    AngularEditorModule,
    MatSelectModule,
  ],
  providers: [ReadingService],
  templateUrl: './reading.component.html',
  styleUrl: './reading.component.css',
})
export class ReadingComponent
  extends AbstractQuizPartComponent<Reading>
  implements OnInit
{
  count = 0;

  subscription: Subscription[] = [];

  addQuestion(index: number, isAddSubQuestion: boolean) {
    const id = CommonUtils.generateRandomId();
    let newQuestion: Question = {
      content: '',
      type: 0,
      choices: this.defaultMultipleChoices(),
      answer: '',
      correctAnswer: '',
    };
    if (isAddSubQuestion) {
      this.data.questions[index].subQuestions?.push(newQuestion);
    } else {
      this.data.questions.push({
        ...newQuestion,
      });
    }
    console.log(this.data.questions)
    this.mapQuestionEditting[id] = true;
  }

  removeQuestion(questionIdex: number) {
    this.data.questions.splice(questionIdex, 1);
  }

  getChoiceById(id: string, choices: Choice[]) {
    return choices.find((choice) => choice.id === id);
  }
}
