import { differenceWith, isEqual, isString, isUndefined } from 'lodash-es';
import { Choice } from '../common/models/choice.model';
import { Question } from '../common/models/question.model';

export class AnswerUtils {
  static isCorrcectAnswer(choice: Choice): boolean {
    return (
      choice.answer !== '' &&
      !isUndefined(choice.answer) &&
      !isUndefined(choice.correctAnswer) &&
      (choice.answer?.toLocaleLowerCase().trim() === choice.correctAnswer?.toLocaleLowerCase().trim() ||
        choice.correctAnswer?.split('/').includes(choice.answer?.toLocaleLowerCase().trim()))
    );
  }

  static isCorrectDropdownChoice(question: Question): boolean {
    if (isString(question.answer)) {
      return question.correctAnswer.includes(question.answer);
    }
    return question.answer === question.correctAnswer;
  }

  static isCorrectChoices(question: Question): boolean {
    return (
      question.answer.length > 0 &&
      differenceWith(question.answer, question.correctAnswer, isEqual)
        .length === 0
    );
  }
}
