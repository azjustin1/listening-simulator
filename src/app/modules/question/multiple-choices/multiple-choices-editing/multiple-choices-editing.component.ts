import { Component, SimpleChanges } from '@angular/core';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { isEmpty } from 'lodash-es';
import { MatButton } from '@angular/material/button';
import { SanitizeHtmlPipe } from '../../../../pipes/sanitize-html.pipe';
import { AbstractEditQuestionComponent } from '../../../../shared/abstract/abstract-edit-question.component';

@Component({
  selector: 'app-multiple-choices-editing',
  standalone: true,
  imports: [
    AngularEditorModule,
    FormsModule,
    MatIcon,
    MatButton,
    SanitizeHtmlPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './multiple-choices-editing.component.html',
  styleUrl: './multiple-choices-editing.component.scss',
})
export class MultipleChoicesEditingComponent extends AbstractEditQuestionComponent {
  selectedOption: string | null = '';
  isMultipleAnswers = false;

  override ngOnInit() {
    super.ngOnInit();
    if (!isEmpty(this.question.correctAnswer)) {
      this.selectedOption = this.question.correctAnswer[0];
    }
  }

  override ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['isEditing'] && changes['isEditing'].currentValue) {
      this.isMultipleAnswers =
        this.question.choices.filter((choice) => choice.isCorrect).length > 1;
    }
  }

  markCorrectAnswer(choice: AbstractControl) {
    const updateChoice = {
      ...choice.value,
      isCorrect: !choice.value.isCorrect,
    };
    this.subscriptions.add(
      this.choiceService.updateChoice(updateChoice).subscribe(),
    );
  }

  checkIsMultipleAnswer() {
    console.log(this.questionForm.controls['choices']);
  }
}
