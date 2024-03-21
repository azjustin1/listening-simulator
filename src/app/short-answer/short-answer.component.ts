import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { FileService } from '../file.service';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';

@Component({
  selector: 'app-short-answer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    AngularEditorModule,
    MatIconModule,
    MatCardModule,
  ],
  providers: [FileService],
  templateUrl: './short-answer.component.html',
  styleUrl: './short-answer.component.css',
})
export class ShortAnswerComponent extends AbstractQuestionComponent {
  @Input() hasIndex: boolean = true;
}
