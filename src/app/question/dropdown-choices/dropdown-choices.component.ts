import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { AbstractQuestionComponent } from '../../../common/abstract-question.component';
import { CorrectAnswerChoicePipe } from '../../../common/pipes/correct-answer-choice.pipe';
import { CorrectDropdownPipe } from '../../../common/pipes/correct-dropdown.pipe';
import { AnswerChoicePipe } from '../../../common/pipes/answer-choice.pipe';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-dropdown-choices',
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
    MatSelectModule,
    MatRadioModule,
    AnswerChoicePipe,
    CorrectAnswerChoicePipe,
    CorrectDropdownPipe,
    MatExpansionModule,
  ],
  templateUrl: './dropdown-choices.component.html',
  styleUrl: './dropdown-choices.component.scss',
})
export class DropdownChoicesComponent extends AbstractQuestionComponent {
  selectedChoice: string = '';
  onSelectCorrectAnswer(choiceId: string) {
    if (this.question.correctAnswer.includes(choiceId)) {
      this.question.correctAnswer = [];
    } else {
      this.question.correctAnswer = [choiceId];
    }
  }

  onSelectAnswer(choiceId: string) {
    if (this.question.correctAnswer.includes(choiceId)) {
      this.question.answer = [];
    } else {
      this.question.answer = [choiceId];
    }
  }
}
