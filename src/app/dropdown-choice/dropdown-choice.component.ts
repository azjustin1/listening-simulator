import { Component } from '@angular/core';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';

@Component({
  selector: 'app-dropdown-choice',
  standalone: true,
  imports: [],
  templateUrl: './dropdown-choice.component.html',
  styleUrl: './dropdown-choice.component.css',
})
export class DropdownChoiceComponent extends AbstractQuestionComponent {}
