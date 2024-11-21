import { Component } from '@angular/core';
import { AbstractQuestionComponent } from '../../../../shared/abstract/abstract-question.component';
import { MatIcon } from '@angular/material/icon';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { isEmpty } from 'lodash-es';
import { LabelOnMapEditingComponent } from '../label-on-map-editing/label-on-map-editing.component';

@Component({
  selector: 'app-label-on-map-testing',
  standalone: true,
  imports: [
    MatIcon,
    AngularEditorModule,
    MatButton,
    MatInput,
    ReactiveFormsModule,
  ],
  templateUrl: './label-on-map-testing.component.html',
  styleUrl: '../label-on-map.component.scss',
})
export class LabelOnMapTestingComponent extends LabelOnMapEditingComponent {
  onSelectAnswer(questionIndex: number, choiceIndex: number) {
    const choiceId =
      this.question.subQuestions![questionIndex].choices[choiceIndex].id;
    const correctAnswer =
      this.question.subQuestions![questionIndex].correctAnswer;
    const answer = this.question.subQuestions![questionIndex].answer;
    if (!isEmpty(correctAnswer) && answer.includes(choiceId)) {
      this.question.subQuestions![questionIndex].answer = [];
    } else {
      this.question.subQuestions![questionIndex].answer = [choiceId];
    }
    this.onAnswer.emit({
      ...this.question.subQuestions![questionIndex],
    });
  }
}
