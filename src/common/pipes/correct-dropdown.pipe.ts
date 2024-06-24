import { Pipe } from '@angular/core';
import { isString } from 'lodash-es';
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
    return question.answer === question.correctAnswer;
  }
}
