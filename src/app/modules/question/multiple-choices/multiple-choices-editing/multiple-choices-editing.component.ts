import { Component, SimpleChanges } from '@angular/core';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { isEmpty } from 'lodash-es';
import { SanitizeHtmlPipe } from '../../../../pipes/sanitize-html.pipe';
import {
  AbstractEditQuestionComponent,
  EditorJsTools,
} from '../../../../shared/abstract/abstract-edit-question.component';
import Checklist from '@editorjs/checklist';
import { QuestionType } from '../../../../shared/enums/question-type.enum';
import { EditorComponent } from '../../../../shared/components/editor/editor.component';

@Component({
  imports: [
    AngularEditorModule,
    FormsModule,
    SanitizeHtmlPipe,
    ReactiveFormsModule,
    EditorComponent,
  ],
  standalone: true,
  selector: 'app-multiple-choices-editing',
  styleUrl: './multiple-choices-editing.component.scss',
  templateUrl: './multiple-choices-editing.component.html',
})
export class MultipleChoicesEditingComponent extends AbstractEditQuestionComponent {
  selectedOption: string | null = '';
  isMultipleAnswers = false;

  override getHolder(): string {
    return QuestionType.MULTIPLE_CHOICE;
  }

  override getTools(): EditorJsTools {
    return {
      ...this.tools,
      checklist: Checklist,
    };
  }

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
  }

  checkIsMultipleAnswer() {
    console.log(this.questionForm.controls['choices']);
  }
}
