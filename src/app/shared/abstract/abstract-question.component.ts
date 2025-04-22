import {
  Component,
  EventEmitter,
  Input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { each } from 'lodash-es';
import { Subscription } from 'rxjs';
import { Question } from '../models/question.model';
import { Choice } from '../models/choice.model';

@Component({
  template: '',
})
export abstract class AbstractQuestionComponent
  implements OnInit, OnChanges, OnDestroy
{
  selectedId = model();
  selectedQuestionIndex = model();
  @Input() question!: Question;
  @Input() isSaved: boolean = false;
  @Input() isEditing: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() isTesting: boolean = false;
  @Input() isExpandable: boolean = true;
  @Output() onSave = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onAnswer = new EventEmitter();
  @Output() onAnswerChoice = new EventEmitter();
  @Output() isInvalid = new EventEmitter<boolean>();
  mapEditingQuestion: Record<string, boolean> = {};
  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.mapEditingQuestion[this.question._id!] = false;
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  defaultChoices(numberOfChoices: number) {
    const choices: Choice[] = [];
    for (let i = 0; i < numberOfChoices; i++) {
      const choice: Choice = {
        content: '',
      };
      choices.push(choice);
    }
    return choices;
  }

  updateEditingQuestion(status: boolean) {
    each(this.question.subQuestions, (question) => {
      this.mapEditingQuestion[question._id!] = status;
    });
  }

  onSaveQuestion() {
    this.onSave.emit();
  }
}
