import { Component } from '@angular/core';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { FormsModule } from '@angular/forms';
import {
  AbstractEditQuestionComponent,
  EditorJsTools,
} from '../../../../shared/abstract/abstract-edit-question.component';
import Table from '@editorjs/table';
import { QuestionType } from '../../../../shared/enums/question-type.enum';
import { EditorComponent } from "../../../../shared/components/editor/editor.component";

@Component({
  selector: 'app-short-answer-editing',
  standalone: true,
  imports: [AngularEditorModule, FormsModule, EditorComponent],
  templateUrl: './short-answer-editing.component.html',
  styleUrl: './short-answer-editing.component.scss',
})
export class ShortAnswerEditingComponent extends AbstractEditQuestionComponent {
  override getHolder(): string {
    return QuestionType.SHORT_ANSWER;
  }

  override getTools(): EditorJsTools {
    return {
      table: {
        class: Table,
        inlineToolbar: true,
        shortcut: 'CMD+ALT+T',
      },
    };
  }
}
