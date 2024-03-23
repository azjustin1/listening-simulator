import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { QuestionComponent } from '../question/question.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonUtils } from '../../utils/common-utils';
import { Question } from '../../common/models/question.model';
import { each, mapValues } from 'lodash-es';

@Component({
  selector: 'app-multiple-question',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    QuestionComponent,
  ],
  templateUrl: './multiple-question.component.html',
  styleUrl: './multiple-question.component.css',
})
export class MultipleQuestionComponent
  extends AbstractQuestionComponent
  implements OnChanges
{
  mapEdittingQuestion: Record<string, boolean> = {};

  override ngOnInit(): void {
    super.ngOnInit();
    each(this.question.subQuestions, (question) => {
      this.updateEdittingQuestion(false);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSaved']?.currentValue) {
      mapValues(this.mapEdittingQuestion, () => false);
    }
  }

  updateEdittingQuestion(status: boolean) {
    each(this.question.subQuestions, (question) => {
      this.mapEdittingQuestion[question.id!] = status;
    });
  }

  addQuestion(questionType: number) {
    const id = CommonUtils.generateRandomId();
    let newQuestion: Question = {
      content: '',
      type: null,
      choices: [],
      answer: '',
      correctAnswer: '',
    };
    switch (questionType) {
      case 0:
        newQuestion = {
          id: id,
          content: '',
          type: questionType,
          choices: this.defaultMultipleChoices(),
          answer: '',
          correctAnswer: '',
        };
        break;
      case 1:
        newQuestion = {
          id: id,
          content: '',
          type: questionType,
          choices: [],
          answer: '',
          correctAnswer: '',
        };
        break;
      default:
        break;
    }
    this.question.subQuestions!.push({ ...newQuestion });
    this.question = { ...this.question };
    this.mapEdittingQuestion[id] = true;
  }

  onSaveSubQuestion(id: string) {
    this.mapEdittingQuestion[id] = false;
  }

  onEditSubQuestion(id: string) {
    this.saveOthersEditting();
    this.mapEdittingQuestion[id] = true;
  }

  onRemoveSubQuestion(index: number) {
    this.question.subQuestions?.splice(index, 1);
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

  saveOthersEditting() {
    for (const key in this.mapEdittingQuestion) {
      this.mapEdittingQuestion[key] = false;
    }
  }
}
