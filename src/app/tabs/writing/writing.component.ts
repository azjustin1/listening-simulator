import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@wfpena/angular-wysiwyg';
import { AbstractQuizSectionComponent } from '../../shared/abstract/abstract-quiz-section.component';
import { Writing } from '../../shared/models/writing.model';
import { SectionType } from '../../shared/enums/section-type.enum';

@Component({
  selector: 'app-writing',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    AngularEditorModule,
  ],
  templateUrl: './writing.component.html',
  styleUrl: './writing.component.scss',
})
export class WritingComponent
  extends AbstractQuizSectionComponent<Writing>
  implements OnInit
{
  override getSectionType(): SectionType {
    return SectionType.Writing;
  }

  testEditorConfig: AngularEditorConfig = {};

  override ngOnInit(): void {
    super.ngOnInit();
    this.testEditorConfig = {
      ...this.config,
      editable: !this.isReadOnly,
      showToolbar: false,
      minHeight: '28rem',
    };
  }
}
