import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [MatIconModule, MultipleChoicesComponent, ShortAnswerComponent],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css',
})
export class QuestionComponent extends AbstractQuestionComponent {}
