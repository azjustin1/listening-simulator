import { Component } from '@angular/core';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-dropdown-choices',
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
    MatSelectModule,
    MatRadioModule,
  ],
  templateUrl: './dropdown-choices.component.html',
  styleUrl: './dropdown-choices.component.css',
})
export class DropdownChoicesComponent extends AbstractQuestionComponent {}
