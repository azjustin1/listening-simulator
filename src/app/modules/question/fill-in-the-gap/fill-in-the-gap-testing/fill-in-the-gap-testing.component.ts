import { Component } from '@angular/core';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { IsInputPipe } from '../is-input.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { toArray } from 'lodash-es';
import { NgClass } from '@angular/common';
import { ExtractIdPipe } from '../../../../pipes/extract-id.pipe';
import { TextSelectionDirective } from '../../../../tabs/reading/text-selection.directive';
import { AbstractTestingQuestionComponent } from '../../../../shared/abstract/abstract-testing-question.component';
import { INPUT_PATTERN } from "../../../../utils/constant";

@Component({
  selector: 'app-fill-in-the-gap-testing',
  standalone: true,
  imports: [
    AngularEditorModule,
    IsInputPipe,
    ReactiveFormsModule,
    FormsModule,
    NgClass,
    ExtractIdPipe,
    TextSelectionDirective,
  ],
  templateUrl: './fill-in-the-gap-testing.component.html',
  styleUrl: './fill-in-the-gap-testing.component.scss',
})
export class FillInTheGapTestingComponent extends AbstractTestingQuestionComponent {
  onInputAnswer(answer: string, choiceId: string) {
    this.mapChoiceById[choiceId].answer = answer;
    this.onAnswer.emit({
      ...this.question,
      choices: toArray(this.mapChoiceById),
    });
  }
}
