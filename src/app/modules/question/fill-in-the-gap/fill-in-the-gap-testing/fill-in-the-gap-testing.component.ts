import { Component } from '@angular/core';
import { AbstractQuestionComponent } from '../../../../shared/abstract/abstract-question.component';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { IsInputPipe } from '../is-input.pipe';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FillInTheGapEditingComponent } from '../fill-in-the-gap-editing/fill-in-the-gap-editing.component';

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
  protected readonly console = console;
}
