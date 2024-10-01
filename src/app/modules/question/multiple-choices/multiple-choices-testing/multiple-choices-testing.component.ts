import { Component } from '@angular/core';
import { AbstractQuestionComponent } from '../../../../shared/abstract/abstract-question.component';
import { MatIcon } from '@angular/material/icon';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { FormsModule } from '@angular/forms';
import { filter, isEmpty, isNull } from 'lodash-es';

@Component({
  selector: 'app-multiple-choices-testing',
  standalone: true,
  imports: [MatIcon, AngularEditorModule, FormsModule],
  templateUrl: './multiple-choices-testing.component.html',
  styleUrl: './multiple-choices-testing.component.scss',
})
export class MultipleChoicesTestingComponent extends AbstractQuestionComponent {
  selectedOption: string | null = '';
  mapSelectedChoice: Record<number, boolean> = {};

  override ngOnInit() {
    super.ngOnInit();
    if (
      !isEmpty(this.question.answer) &&
      Number(this.question.numberOfChoices) < 2
    ) {
      this.selectedOption = this.question.answer[0];
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

  onSelectMultipleAnswer(event: MouseEvent, choiceId: string) {
    if (
      !this.question.answer.includes(choiceId) &&
      this.isReachedMaxAnswers(this.question.answer.length)
    ) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    if (this.question.answer.includes(choiceId)) {
      this.question.answer = filter(
        this.question.answer,
        (ans) => ans !== choiceId,
      );
    } else {
      (this.question.answer as string[]).push(choiceId);
    }
  }

  private isReachedMaxAnswers(numberOfSelectdChoice: number) {
    return Number(this.question.numberOfChoices) === numberOfSelectdChoice;
  }
}
