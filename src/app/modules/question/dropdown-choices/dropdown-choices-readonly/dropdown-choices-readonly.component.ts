import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { AbstractReadonlyQuestionComponent } from '../../../../shared/abstract/abstract-readonly-question.component';
import { EditorReadonlyRendererComponent } from '../../../../shared/components/editor/editor-renderer/editor-readonly-renderer.component';
import { EditorResultRendererComponent } from '../../../../shared/components/editor/editor-renderer/editor-result-renderer.component';
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'app-dropdown-choices-readonly',
  standalone: true,
  imports: [
    MatExpansionModule,
    EditorReadonlyRendererComponent,
    EditorResultRendererComponent,
    JsonPipe,
  ],
  templateUrl: './dropdown-choices-readonly.component.html',
  styleUrl: './dropdown-choices-readonly.component.scss',
})
export class DropdownChoicesReadonlyComponent extends AbstractReadonlyQuestionComponent {}
