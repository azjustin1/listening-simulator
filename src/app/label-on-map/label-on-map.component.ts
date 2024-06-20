import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { CommonUtils } from '../../utils/common-utils';
import { ChoicePipe } from '../multiple-choices/choice.pipe';
import { each } from 'lodash-es';
import { CHOICE_INDEX } from '../../utils/constant';

@Component({
  selector: 'app-label-on-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AngularEditorModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    ChoicePipe,
  ],
  templateUrl: './label-on-map.component.html',
  styleUrl: './label-on-map.component.scss',
})
export class LabelOnMapComponent extends AbstractQuestionComponent {
  choiceIndexs = CHOICE_INDEX;
  selectedIndex = 0;

  addQuestion(questionType: number): void {
    this.question.subQuestions?.push({
      id: CommonUtils.generateRandomId(),
      content: '',
      type: questionType,
      choices: [],
      answer: [],
      correctAnswer: [],
    });
    console.log(this.question.subQuestions);
  }

  onRowClick(questionIndex: number, choiceIndex: number) {
    const choiceId =
      this.question.subQuestions![questionIndex].choices[choiceIndex].id;
    if (this.isEditting) {
      this.question.subQuestions![questionIndex].correctAnswer = [choiceId!];
    }
    if (this.isTesting) {
      this.question.subQuestions![questionIndex].answer = [choiceId!];
    }
  }

  onAddColumn() {
    const newChoice = {
      id: CommonUtils.generateRandomId(),
      content: '',
    };
    each(this.question.subQuestions, (question) => {
      question.choices.push(newChoice);
    });

    console.log(this.question);
  }

  onRemoveColumn() {
    each(this.question.subQuestions, (question) => {
      question.choices.splice(question.choices.length - 1, 1);
    });
  }

  onRemoveRow(index: number) {
    this.question.subQuestions?.splice(index, 1);
  }
}
