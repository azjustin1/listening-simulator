import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { FileService } from '../file.service';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
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
  ],
  providers: [FileService],
  templateUrl: './multiple-choices.component.html',
  styleUrl: './multiple-choices.component.css',
})
export class MultipleChoicesComponent extends AbstractQuestionComponent {
  @Output() onValuChange = new EventEmitter();
  selectedAnswer: string = '';

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

    this.selectedAnswer = this.question.choices[index].id!;

    if (this.isEditting) {
      this.question.correctAnswer = this.selectedAnswer;
    }

    if (this.isTesting) {
      this.question.answer = this.selectedAnswer;
    }
    this.onValuChange.emit(this.question.choices[index].id);
  }
}
