import { Component, Input, model, OnInit } from '@angular/core';
import { Question } from '../models/question.model';
import { Choice } from '../models/choice.model';

@Component({
  template: ``,
})
export abstract class AbstractReadonlyQuestionComponent implements OnInit {
  @Input() question!: Question;
  @Input() isEditing = false;
  @Input() isReadOnly = false;
  selectedId = model();
  selectedQuestionIndex = model();
  headerColSpan = 1;
  mapChoiceById: Record<string, Choice> = {};

  ngOnInit() {}
}
