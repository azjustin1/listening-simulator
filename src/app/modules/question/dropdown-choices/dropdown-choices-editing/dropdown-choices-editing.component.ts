import { Component } from '@angular/core';
import { AbstractQuestionComponent } from '../../../../shared/abstract/abstract-question.component';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { AnswerChoicePipe } from '../../../../pipes/answer-choice.pipe';
import { CorrectAnswerChoicePipe } from '../../../../pipes/correct-answer-choice.pipe';
import { CorrectDropdownPipe } from '../../../../pipes/correct-dropdown.pipe';
import { MatButton } from '@angular/material/button';
import {
  MatExpansionModule,
  MatExpansionPanel,
} from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { isEmpty } from 'lodash-es';

@Component({
  selector: 'app-dropdown-choices-editing',
  standalone: true,
  imports: [
    AngularEditorModule,
    AnswerChoicePipe,
    CorrectAnswerChoicePipe,
    CorrectDropdownPipe,
    MatButton,
    MatExpansionModule,
    FormsModule,
    MatIcon,
  ],
  templateUrl: './dropdown-choices-editing.component.html',
  styleUrl: './dropdown-choices-editing.component.scss',
})
export class DropdownChoicesEditingComponent extends AbstractQuestionComponent {
  selectedChoice: string | null = null;

  onSelectCorrectAnswer(choiceId: string) {
    if (this.question.correctAnswer.includes(choiceId)) {
      this.question.correctAnswer = [];
      this.selectedChoice = null;
    } else {
      this.question.correctAnswer = [choiceId];
      this.selectedChoice = choiceId;
    }
  }
}
