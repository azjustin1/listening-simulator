import { Component } from '@angular/core';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { FormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from '../../../../pipes/sanitize-html.pipe';
import { AbstractReadonlyQuestionComponent } from '../../../../shared/abstract/abstract-readonly-question.component';

@Component({
  selector: 'app-multiple-choices-readonly',
  standalone: true,
  imports: [AngularEditorModule, FormsModule, SanitizeHtmlPipe],
  templateUrl: './multiple-choices-readonly.component.html',
  styleUrl: './multiple-choices-readonly.component.scss',
})
export class MultipleChoicesReadonlyComponent extends AbstractReadonlyQuestionComponent {
  selectedOption = '';
  isMultipleAnswers = false;

  override ngOnInit() {
    super.ngOnInit();
    this.isMultipleAnswers =
      this.question.choices.filter((choice) => choice.isCorrect).length > 1;
    if (this.selectedOption) {
      if (this.isReadOnly) {
        this.selectedOption = this.question.answer[0];
      } else {
        this.selectedOption = this.question.correctAnswer[0];
      }
    }
  }
}
