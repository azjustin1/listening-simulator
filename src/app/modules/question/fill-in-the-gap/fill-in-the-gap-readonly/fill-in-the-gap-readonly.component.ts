import { Component } from '@angular/core';
import { CorrectAnswerPipe } from '../../../../pipes/correct-answer.pipe';
import { IsInputPipe } from '../is-input.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ExtractIdPipe } from '../../../../pipes/extract-id.pipe';
import { AbstractReadonlyQuestionComponent } from '../../../../shared/abstract/abstract-readonly-question.component';
import { Choice } from "../../../../shared/models/choice.model";

@Component({
  selector: 'app-fill-in-the-gap-readonly',
  standalone: true,
  imports: [
    CorrectAnswerPipe,
    IsInputPipe,
    ReactiveFormsModule,
    NgClass,
    FormsModule,
    ExtractIdPipe,
  ],
  templateUrl: './fill-in-the-gap-readonly.component.html',
  styleUrl: './fill-in-the-gap-readonly.component.scss',
})
export class FillInTheGapReadonlyComponent extends AbstractReadonlyQuestionComponent {
}
