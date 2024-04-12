import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { FileService } from '../file.service';
import { chunk, each, isEqual, sortBy } from 'lodash-es';
import { ChoicePipe } from './choice.pipe';
@Component({
  selector: 'app-multiple-choices',
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
    ChoicePipe,
  ],
  providers: [FileService],
  templateUrl: './multiple-choices.component.html',
  styleUrl: './multiple-choices.component.css',
})
export class MultipleChoicesComponent extends AbstractQuestionComponent {
  selectedAnswer: string = '';
  mapSelectedChoice: Record<number, boolean> = {};

  CHOICE_INDEX = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  onSelectChoice(index: number) {
    if (this.isReadOnly) {
      return;
    }

    this.mapSelectedChoice[index] = !this.mapSelectedChoice[index];

    if (this.isEditting) {
      if (
        !this.question.correctAnswer?.includes(this.question.choices[index].id!)
      ) {
        this.question.correctAnswer += `${this.question.choices[index].id}`;
      } else {
        this.question.correctAnswer = this.question.correctAnswer.replace(
          `${this.question.choices[index].id}`,
          '',
        );
      }
    }

    if (this.isTesting) {
      if (!this.question.answer.includes(this.question.choices[index].id!)) {
        this.question.answer += `${this.question.choices[index].id}`;
      } else {
        this.question.answer = this.question.answer?.replace(
          `${this.question.choices[index].id}`,
          '',
        );
      }
    }
  }
}
