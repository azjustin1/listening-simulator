import { Component, inject, Input, model, OnInit } from '@angular/core';
import { Question } from '../models/question.model';
import { Choice } from '../models/choice.model';
import { OutputBlockData } from '@editorjs/editorjs';
import { isEmpty } from 'lodash-es';
import { TestService } from '../../pages/full-test/test.service';
import { QuestionType } from '../enums/question-type.enum';

@Component({
  template: ``,
})
export abstract class AbstractReadonlyQuestionComponent implements OnInit {
  @Input() question!: Question;
  @Input() isEditing = false;
  @Input() isSaved = false;
  @Input() isReadOnly = false;
  testService = inject(TestService);
  blocks: OutputBlockData[] = [];
  selectedId = model();
  selectedQuestionIndex = model();
  headerColSpan = 1;
  mapChoiceById: Record<string, Choice> = {};

  ngOnInit() {
    if (!isEmpty(this.question.description)) {
      this.blocks = JSON.parse(this.question.description!);
      if (this.question.type === QuestionType.DROPDOWN_ANSWER) {
        console.log(this.blocks);
      }
    }
  }
}
