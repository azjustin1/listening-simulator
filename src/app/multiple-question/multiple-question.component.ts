import { Component } from '@angular/core';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';

@Component({
  selector: 'app-multiple-question',
  standalone: true,
  imports: [],
  templateUrl: './multiple-question.component.html',
  styleUrl: './multiple-question.component.css',
})
export class MultipleQuestionComponent extends AbstractQuestionComponent {}
