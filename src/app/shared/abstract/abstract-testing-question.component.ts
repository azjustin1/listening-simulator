import {
  Component,
  EventEmitter,
  inject,
  Input,
  model,
  OnInit,
  Output,
} from '@angular/core';
import { Question } from '../models/question.model';
import { CHOICE_INDEX, INPUT_PATTERN } from '../../utils/constant';
import { Choice } from '../models/choice.model';
import { OutputBlockData } from '@editorjs/editorjs';
import { isEmpty } from 'lodash-es';
import { TestService } from '../../pages/full-test/test.service';

@Component({
  template: ``,
})
export abstract class AbstractTestingQuestionComponent implements OnInit {
  @Input() question!: Question;
  @Input() blocks: OutputBlockData[] = [];
  @Input() isTesting = false;
  @Output() onAnswer = new EventEmitter();
  @Output() onAnswerChoice = new EventEmitter<Choice>();
  testService = inject(TestService);
  inputPattern = INPUT_PATTERN;
  selectedId = model();
  selectedQuestionIndex = model();
  choiceIndex = CHOICE_INDEX;
  mapChoiceById: Record<string, Choice> = {};

  ngOnInit() {
    if (!isEmpty(this.question.description)) {
      this.blocks = JSON.parse(this.question.description!);
    }
  }

  onSelectAnswer(answer: string) {
    let answers = this.testService.getQuestionAnswer(this.question._id!);
    if (answers) {
      if (answers.includes(answer)) {
        answers = answers.filter(answer => answer !== answer);
        this.testService.answerQuestion(this.question._id!, answers);
      }
    }
  }
}
