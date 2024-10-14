import { Component } from '@angular/core';
import { AbstractQuestionComponent } from '../../../../shared/abstract/abstract-question.component';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { IsInputPipe } from '../is-input.pipe';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FillInTheGapEditingComponent } from '../fill-in-the-gap-editing/fill-in-the-gap-editing.component';
import { toArray } from 'lodash-es';
import { Choice } from '../../../../shared/models/choice.model';

@Component({
  selector: 'app-fill-in-the-gap-testing',
  standalone: true,
  imports: [
    AngularEditorModule,
    IsInputPipe,
    MatButton,
    MatIcon,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './fill-in-the-gap-testing.component.html',
  styleUrl: './fill-in-the-gap-testing.component.scss',
})
export class FillInTheGapTestingComponent extends FillInTheGapEditingComponent {
  onInputAnswer(answer: string, choiceId: string) {
    this.mapChoiceById[choiceId].answer = answer;
    this.onAnswer.emit({
      ...this.question,
      choices: toArray(this.mapChoiceById),
    });
  }
}
