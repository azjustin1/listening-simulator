import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@wfpena/angular-wysiwyg';
import { AbstractQuizPartComponent } from '../../common/abstract-quiz-part.component';
import { Writing } from '../../common/models/writing.model';
import { MultipleChoicesComponent } from '../question/multiple-choices/multiple-choices.component';
import { ShortAnswerComponent } from '../question/short-answer/short-answer.component';

@Component({
  selector: 'app-writing',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MultipleChoicesComponent,
    ShortAnswerComponent,
    MatIconModule,
    AngularEditorModule,
  ],
  templateUrl: './writing.component.html',
  styleUrl: './writing.component.scss',
})
export class WritingComponent
  extends AbstractQuizPartComponent<Writing>
  implements OnInit
{
  testEditorConfig: AngularEditorConfig = {};
  ngOnInit(): void {
    this.testEditorConfig = {
      ...this.config,
      editable: !this.isReadOnly,
      showToolbar: false,
      minHeight: '28rem',
    };
  }
}
