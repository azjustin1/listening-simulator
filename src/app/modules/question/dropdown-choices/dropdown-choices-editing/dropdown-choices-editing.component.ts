import { Component } from '@angular/core';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { isEmpty } from 'lodash-es';
import {
  AbstractEditQuestionComponent,
  EditorJsTools,
} from '../../../../shared/abstract/abstract-edit-question.component';
import { QuestionType } from '../../../../shared/enums/question-type.enum';
import { EditorComponent } from '../../../../shared/components/editor/editor.component';
import { SanitizeHtmlPipe } from '../../../../pipes/sanitize-html.pipe';

@Component({
  selector: 'app-dropdown-choices-editing',
  standalone: true,
  imports: [
    AngularEditorModule,
    MatExpansionModule,
    FormsModule,
    EditorComponent,
    SanitizeHtmlPipe,
  ],
  templateUrl: './dropdown-choices-editing.component.html',
  styleUrl: './dropdown-choices-editing.component.scss',
})
export class DropdownChoicesEditingComponent extends AbstractEditQuestionComponent {
  selectedChoice: string | null = null;

  override getHolder(): string {
    return QuestionType.DROPDOWN_ANSWER;
  }

  override getTools(): EditorJsTools {
    return {};
  }

  override ngOnInit() {
    super.ngOnInit();
    if (!isEmpty(this.question.correctAnswer)) {
      this.selectedChoice = this.question.correctAnswer[0];
    }
  }

  onSelectCorrectAnswer(choiceId: string) {
    if (this.question.correctAnswer.includes(choiceId)) {
      this.question.correctAnswer = [];
      this.selectedChoice = null;
    } else {
      this.question.correctAnswer = [choiceId];
      this.selectedChoice = choiceId;
    }
  }
}
