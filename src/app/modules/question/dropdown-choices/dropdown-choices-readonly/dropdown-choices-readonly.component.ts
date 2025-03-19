import { Component } from '@angular/core';
import { DropdownChoicesEditingComponent } from '../dropdown-choices-editing/dropdown-choices-editing.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { CorrectDropdownPipe } from '../../../../pipes/correct-dropdown.pipe';
import { AnswerChoicePipe } from '../../../../pipes/answer-choice.pipe';
import { drop } from 'lodash-es';
import { CorrectDropDownAnswerPipe } from '../../../../pipes/correct-answer-dropdown-choice.pipe';
import { AbstractReadonlyQuestionComponent } from '../../../../shared/abstract/abstract-readonly-question.component';

@Component({
  selector: 'app-dropdown-choices-readonly',
  standalone: true,
  imports: [
    MatExpansionModule,
    CorrectDropdownPipe,
    AnswerChoicePipe,
    CorrectDropDownAnswerPipe,
  ],
  templateUrl: './dropdown-choices-readonly.component.html',
  styleUrl: './dropdown-choices-readonly.component.scss',
})
export class DropdownChoicesReadonlyComponent extends AbstractReadonlyQuestionComponent {}
