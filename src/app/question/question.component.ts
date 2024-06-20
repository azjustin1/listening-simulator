import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { DropdownChoicesComponent } from '../dropdown-choices/dropdown-choices.component';
import { LabelOnMapComponent } from '../label-on-map/label-on-map.component';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    MatIconModule,
    MultipleChoicesComponent,
    ShortAnswerComponent,
    DropdownChoicesComponent,
    LabelOnMapComponent,
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
})
export class QuestionComponent extends AbstractQuestionComponent {}
