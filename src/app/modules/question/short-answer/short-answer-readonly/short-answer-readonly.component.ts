import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EditorReadonlyRendererComponent } from '../../../../shared/components/editor/editor-renderer/editor-readonly-renderer.component';
import { AbstractReadonlyQuestionComponent } from '../../../../shared/abstract/abstract-readonly-question.component';
import { EditorResultRendererComponent } from '../../../../shared/components/editor/editor-renderer/editor-result-renderer.component';

@Component({
  selector: 'app-short-answer-readonly',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditorReadonlyRendererComponent,
    EditorResultRendererComponent,
  ],
  templateUrl: './short-answer-readonly.component.html',
  styleUrl: '../short-answer.component.scss',
})
export class ShortAnswerReadonlyComponent extends AbstractReadonlyQuestionComponent {}
