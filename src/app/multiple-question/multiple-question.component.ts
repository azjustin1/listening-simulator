import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { clone, cloneDeep, each, mapValues } from 'lodash-es';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { Question } from '../../common/models/question.model';
import { CommonUtils } from '../../utils/common-utils';
import { QuestionComponent } from '../question/question.component';
import { QuestionType } from '../../common/enums/question-type.enum';

@Component({
  selector: 'app-multiple-question',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    QuestionComponent,
  ],
  templateUrl: './multiple-question.component.html',
  styleUrl: './multiple-question.component.scss',
})
export class MultipleQuestionComponent
  extends AbstractQuestionComponent
  implements OnInit, OnChanges
{
  override ngOnInit(): void {
    super.ngOnInit();
    each(this.question.subQuestions, (question) => {
      this.updateEdittingQuestion(false);
    });
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes['isSaved']?.currentValue) {
      mapValues(this.mapEdittingQuestion, () => false);
    }
  }

  override updateEdittingQuestion(status: boolean) {
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
      answer: [],
      correctAnswer: [],
    };
    switch (questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        newQuestion = {
          id: id,
          content: '',
          type: questionType,
          choices: this.defaultChoices(4),
          answer: [],
          correctAnswer: [],
        };
        break;
      case QuestionType.SHORT_ANSWER:
        newQuestion = {
          id: id,
          content: '',
          type: questionType,
          choices: [],
          answer: [],
          correctAnswer: [],
        };
        break;
      case QuestionType.DROPDOWN_ANSWER:
        newQuestion = {
          id: id,
          content: '',
          type: questionType,
          choices: this.defaultChoices(3),
          answer: [],
          correctAnswer: [],
        };
        break;
      case QuestionType.FILL_IN_THE_GAP:
        newQuestion = {
          id: id,
          content: '',
          arrayContent: [],
          type: questionType,
          choices: [],
          answer: [],
          correctAnswer: [],
          subQuestions: [],
        };
        break;
      default:
        break;
    }
    this.question.subQuestions!.push({ ...newQuestion });
    this.question = { ...this.question };
    this.mapEdittingQuestion[id] = true;
  }

  moveQuestionUp(index: number) {
    const tempQuestion = clone(this.question.subQuestions![index - 1]);
    this.question.subQuestions![index - 1] = this.question.subQuestions![index];
    this.question.subQuestions![index] = tempQuestion;
  }

  moveQuestionDown(index: number) {
    const tempQuestion = clone(this.question.subQuestions![index + 1]);
    this.question.subQuestions![index + 1] = this.question.subQuestions![index];
    this.question.subQuestions![index] = tempQuestion;
  }

  onSaveSubQuestion(id: string) {
    this.mapEdittingQuestion[id] = false;
  }

  onEditSubQuestion(id: string) {
    this.saveOthersEditting();
    this.mapEdittingQuestion[id] = true;
  }

  duplicateQuestion(question: Question) {
    let cloneQuestion = cloneDeep(question);
    cloneQuestion = {
      ...cloneQuestion,
      id: CommonUtils.generateRandomId(),
      content: `Copy of ${cloneQuestion.content}`,
    };
    this.question.subQuestions!.push(cloneQuestion);
  }

  onRemoveSubQuestion(index: number) {
    this.question.subQuestions?.splice(index, 1);
  }

  saveOthersEditting() {
    for (const key in this.mapEdittingQuestion) {
      this.mapEdittingQuestion[key] = false;
    }
  }
}
