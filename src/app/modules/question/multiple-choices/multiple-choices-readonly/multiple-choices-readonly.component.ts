import { Component } from '@angular/core';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { FormsModule } from '@angular/forms';
import { AbstractReadonlyQuestionComponent } from '../../../../shared/abstract/abstract-readonly-question.component';
import EditorJS from '@editorjs/editorjs';
import { EditorReadonlyRendererComponent } from '../../../../shared/components/editor/editor-renderer/editor-readonly-renderer.component';
import {
  EditorResultRendererComponent
} from "../../../../shared/components/editor/editor-renderer/editor-result-renderer.component";

@Component({
  selector: 'app-multiple-choices-readonly',
  standalone: true,
  imports: [
    AngularEditorModule,
    FormsModule,
    EditorReadonlyRendererComponent,
    EditorResultRendererComponent,
  ],
  templateUrl: './multiple-choices-readonly.component.html',
  styleUrl: './multiple-choices-readonly.component.scss',
})
export class MultipleChoicesReadonlyComponent extends AbstractReadonlyQuestionComponent {
  editor!: EditorJS;
}
