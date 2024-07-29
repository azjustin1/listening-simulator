import { Pipe } from '@angular/core';
import { isEmpty, isString } from 'lodash-es';
import { Question } from '../models/question.model';
import { AbstractAnswerPipe } from './abstract-answer.pipe';

@Pipe({
  name: 'isCorrectDropdown',
  standalone: true,
})
export class CorrectDropdownPipe extends AbstractAnswerPipe {
  override transform(question: Question, ...args: any[]): any {
    if (isString(question.answer)) {
      return question.correctAnswer.includes(question.answer);
    }

    return (
      !isEmpty(question.answer) && question.answer === question.correctAnswer
    );
  }
}
