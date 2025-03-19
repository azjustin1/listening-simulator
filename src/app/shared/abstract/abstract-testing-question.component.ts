import {
  Component,
  EventEmitter,
  Input,
  model,
  OnInit,
  Output,
} from '@angular/core';
import { Question } from '../models/question.model';
import { CHOICE_INDEX, INPUT_PATTERN } from "../../utils/constant";
import { Choice } from '../models/choice.model';

@Component({
  template: ``,
})
export abstract class AbstractTestingQuestionComponent implements OnInit {
  @Input() question!: Question;
  @Input() isTesting = false;
  @Output() onAnswer = new EventEmitter();
  @Output() onAnswerChoice = new EventEmitter<Choice>();
  inputPattern = INPUT_PATTERN;
  selectedId = model();
  selectedQuestionIndex = model();
  choiceIndex = CHOICE_INDEX;
  mapChoiceById: Record<string, Choice> = {};

  ngOnInit() {}
}
