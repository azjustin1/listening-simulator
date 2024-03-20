import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@wfpena/angular-wysiwyg';
import { Subscription } from 'rxjs';
import { Choice } from '../../common/models/choice.model';
import { Reading } from '../../common/models/reading.model';
import { CommonUtils } from '../../utils/common-utils';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { ReadingService } from './reading.service';
import { Question } from '../../common/models/question.model';
import { each, isUndefined } from 'lodash-es';

@Component({
  selector: 'app-reading',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MultipleChoicesComponent,
    ShortAnswerComponent,
    MatIconModule,
    MatExpansionModule,
    AngularEditorModule,
    MatSelectModule,
  ],
  providers: [ReadingService],
  templateUrl: './reading.component.html',
  styleUrl: './reading.component.css',
})
export class ReadingComponent implements OnInit {
  count = 0;
  @Input() data: Reading = {
    id: '',
    content: '',
    questions: [],
  };
  @Input() isTesting: boolean = false;
  @Input() isEditting: boolean = false;
  @Input() isReadOnly: boolean = false;

  subscription: Subscription[] = [];

  mapQuestionCollapse: Record<string, boolean> = {};

  config: AngularEditorConfig = {
    editable: true,
  };

  constructor() {}

  ngOnInit(): void {
    each(this.data.questions, (question) => {
      this.mapQuestionCollapse[question.id!] = false;
    });
  }

  addQuestion(questionType: number) {
    let newQuestion: Question = {
      content: '',
      type: null,
      choices: [],
      answer: '',
      correctAnswer: '',
    };
    switch (questionType) {
      case 1:
        newQuestion = {
          id: CommonUtils.generateRandomId(),
          content: '',
          type: questionType,
          choices: [],
          answer: '',
          correctAnswer: '',
        };
        break;
      case 2:
        newQuestion = {
          id: CommonUtils.generateRandomId(),
          content: '',
          type: questionType,
          choices: this.defaultMultipleChoices(),
          answer: '',
          correctAnswer: '',
        };
        break;
      default:
        break;
    }
    this.data.questions.push({
      ...newQuestion,
    });
  }

  removeQuestion(questionIdex: number) {
    this.data.questions.splice(questionIdex, 1);
  }

  defaultMultipleChoices() {
    const choices = [];
    for (let i = 0; i < 4; i++) {
      const choice = {
        id: CommonUtils.generateRandomId(),
        content: '',
      };
      choices.push(choice);
    }
    return choices;
  }

  defaultShortAnswerChoices() {
    const choices = [];
    for (let i = 0; i < 4; i++) {
      const choice = {
        id: CommonUtils.generateRandomId(),
        content: '',
        index: '',
      };
      choices.push(choice);
    }
    return choices;
  }

  getChoiceById(id: string, choices: Choice[]) {
    return choices.find((choice) => choice.id === id);
  }

  afterExpand(id: string) {
    if (!isUndefined(this.mapQuestionCollapse[id])) {
      this.mapQuestionCollapse[id] = true;
    }
  }

  afterCollapse(id: string) {
    if (!isUndefined(this.mapQuestionCollapse[id])) {
      this.mapQuestionCollapse[id] = false;
    }
  }
}
