import { Component } from '@angular/core';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { FormsModule } from '@angular/forms';
import { EditorTestingRendererComponent } from '../../../../shared/components/editor/editor-renderer/editor-testing-renderer.component';
import { AbstractTestingQuestionComponent } from '../../../../shared/abstract/abstract-testing-question.component';

@Component({
  selector: 'app-short-answer-testing',
  standalone: true,
  imports: [AngularEditorModule, FormsModule, EditorTestingRendererComponent],
  templateUrl: './short-answer-testing.component.html',
  styleUrl: './short-answer-testing.component.scss',
})
export class ShortAnswerTestingComponent extends AbstractTestingQuestionComponent {}
