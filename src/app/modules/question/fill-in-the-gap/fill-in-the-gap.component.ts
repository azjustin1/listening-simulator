import { NgClass } from '@angular/common';
import { Component, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import {
  clone,
  each,
  filter,
  isEmpty,
  mapValues,
  omit,
  toArray,
} from 'lodash-es';
import { AbstractQuestionComponent } from '../../../shared/abstract/abstract-question.component';
import { Choice } from '../../../shared/models/choice.model';
import { CorrectAnswerPipe } from '../../../pipes/correct-answer.pipe';
import { CommonUtils } from '../../../utils/common-utils';
import { INPUT_PATTERN } from '../../../utils/constant';
import { ArrayContentChoice } from './array-content.pipe';
import { FitContentDirective } from './fit-content.directive';
import { IsInputPipe } from './is-input.pipe';
import { FillInTheGapEditingComponent } from './fill-in-the-gap-editing/fill-in-the-gap-editing.component';
import { FillInTheGapTestingComponent } from './fill-in-the-gap-testing/fill-in-the-gap-testing.component';
import { FillInTheGapReadonlyComponent } from './fill-in-the-gap-readonly/fill-in-the-gap-readonly.component';

@Component({
  selector: 'app-fill-in-the-gap',
  standalone: true,
  imports: [
    MatIconModule,
    FillInTheGapEditingComponent,
    FillInTheGapTestingComponent,
    FillInTheGapReadonlyComponent,
  ],
  templateUrl: './fill-in-the-gap.component.html',
  styleUrl: './fill-in-the-gap.component.scss',
})
export class FillInTheGapComponent extends AbstractQuestionComponent {
  protected readonly console = console;
}
