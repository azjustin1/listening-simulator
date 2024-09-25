import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { FileService } from '../file.service';
import { filter, isArray, isEmpty, isNull } from 'lodash-es';
import { CHOICE_INDEX } from '../../utils/constant';
import { CorrectChoicesPipe } from '../../common/pipes/correct-choices.pipe';
import { MatRadioGroup } from '@angular/material/radio';

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
    CorrectChoicesPipe,
    MatRadioGroup,
  ],
  providers: [FileService],
  templateUrl: './multiple-choices.component.html',
  styleUrl: './multiple-choices.component.scss',
})
export class MultipleChoicesComponent extends AbstractQuestionComponent {
  selectedOption: string | null = '';
  mapSelectedChoice: Record<number, boolean> = {};

  CHOICE_INDEX: string[] = CHOICE_INDEX;

  override ngOnInit() {
    super.ngOnInit();
    if (!this.isTesting && !isEmpty(this.question.correctAnswer)) {
      this.selectedOption = this.question.correctAnswer[0];
    }
  }

  onSelectSingleCorrectAnswer(option: string) {
    this.selectedOption = this.selectedOption === option ? null : option;
    if (isNull(this.selectedOption)) {
      this.question.correctAnswer = [];
    } else {
      this.question.correctAnswer = [option];
    }
  }

  onSelectSingleAnswer(option: string) {
    this.selectedOption = this.selectedOption === option ? null : option;
    if (isNull(this.selectedOption)) {
      this.question.answer = [];
    } else {
      this.question.answer = [option];
    }
  }

  onSelectMultipleCorrectAnswer(option: string) {
    if ((this.question.correctAnswer.length + 1) > Number(this.question.numberOfChoices)) {
      return;
    }

    if (this.question.correctAnswer.includes(option)) {
      this.question.correctAnswer = filter(
        this.question.correctAnswer,
        (ans) => ans !== option,
      );
    } else {
      this.question.correctAnswer.push(option);
    }
  }

  onSelectMultipleAnswer(option: string) {
    if (Number(this.question.numberOfChoices) === this.question.answer.length) {
      return;
    }

    if (isArray(this.question.answer)) {
      if (this.question.answer.includes(option)) {
        this.question.answer = filter(
          this.question.answer,
          (ans) => ans !== option,
        );
      } else {
        this.question.answer.push(option);
      }
    }
  }

  onSelectChoice(index: number) {
    if (this.isReadOnly) {
      return;
    }

    this.mapSelectedChoice[index] = !this.mapSelectedChoice[index];

    if (this.isEditing) {
      const id = this.question.choices[index].id;
      if (!this.question.correctAnswer?.includes(id)) {
        this.question.correctAnswer.push(id);
      } else {
        this.question.correctAnswer = this.question.correctAnswer.filter(
          (correctAnswerId) => correctAnswerId !== id,
        );
      }
    }

    if (this.isTesting) {
      if (isArray(this.question.answer)) {
        const id = this.question.choices[index].id;

        if (!this.question.answer?.includes(id)) {
          this.question.answer.push(id);
        } else {
          this.question.answer = this.question.answer.filter(
            (answerId) => answerId !== id,
          );
        }
      }
    }
  }
}
