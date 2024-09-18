import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { clone, cloneDeep, each, filter, mapValues, omit } from 'lodash-es';
import { AbstractQuestionComponent } from '../../../../common/abstract-question.component';
import { Question } from '../../../../common/models/question.model';
import { CommonUtils } from '../../../../utils/common-utils';
import { QuestionComponent } from '../question.component';
import { QuestionType } from '../../../../common/enums/question-type.enum';
import { Choice } from '../../../../common/models/choice.model';

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
  @Input() quizId?: string;
  override ngOnInit(): void {
    super.ngOnInit();
    each(this.question.subQuestions, (question) => {
      this.updateEditingQuestion(false);
    });
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes['isSaved']?.currentValue) {
      mapValues(this.mapEdittingQuestion, () => false);
    }
  }

  override updateEditingQuestion(status: boolean) {
    each(this.question.subQuestions, (question) => {
      this.mapEdittingQuestion[question._id!] = status;
    });
  }

  addSubQuestion(questionType: number) {
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
          content: '',
          type: questionType,
          choices: this.defaultChoices(4),
          answer: [],
          correctAnswer: [],
        };
        break;
      case QuestionType.SHORT_ANSWER:
        newQuestion = {
          content: '',
          type: questionType,
          choices: [],
          answer: [],
          correctAnswer: [],
        };
        break;
      case QuestionType.DROPDOWN_ANSWER:
        newQuestion = {
          content: '',
          type: questionType,
          choices: this.defaultChoices(3),
          answer: [],
          correctAnswer: [],
        };
        break;
      case QuestionType.FILL_IN_THE_GAP:
        newQuestion = {
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
    this.subscriptions.add(
      this.questionService
        .addSubQuestion(this.question._id!, newQuestion)
        .subscribe((resp) => {
          this.question.subQuestions!.push({ ...resp });
          this.onEditSubQuestion(resp._id!);
        }),
    );
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

  onSaveSubQuestion(subQuestion: Question) {
    this.questionService.updateSubQuestion(subQuestion).subscribe((resp) => {
      if (resp) {
        subQuestion = { ...resp };
        this.mapEdittingQuestion[subQuestion._id!] = false;
      }
    });
  }

  onEditSubQuestion(id: string) {
    this.saveOthersEditting();
    this.mapEdittingQuestion[id] = true;
  }

  duplicateQuestion(question: Question) {
    let cloneQuestion = cloneDeep(question);
    cloneQuestion = {
      ...cloneQuestion,
      _id: undefined,
      content: `Copy of ${cloneQuestion.content}`,
      choices: question.choices.map((choice) =>
        omit(choice, ['_id', '__v']),
      ) as Choice[],
    };

    this.subscriptions.add(
      this.questionService
        .addSubQuestion(this.question._id!, cloneQuestion)
        .subscribe((resp) => {
          console.log(resp)
          this.question.subQuestions!.push(resp);
        }),
    );
  }

  onRemoveSubQuestion(questionId: string, index: number) {
    this.subscriptions.add(
      this.questionService.deleteSubQuestion(questionId).subscribe((res) => {
        this.question.subQuestions = filter(
          this.question.subQuestions,
          (subQuestion) => subQuestion._id != res.questionId,
        );
      }),
    );
  }

  saveOthersEditting() {
    for (const key in this.mapEdittingQuestion) {
      this.mapEdittingQuestion[key] = false;
    }
  }

  onSaveClick() {
    this.onSave.emit();
  }
}
