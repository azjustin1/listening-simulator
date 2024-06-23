import { each } from 'lodash-es';
import { CHOICE_INDEX, INPUT_PATTERN } from './constant';
import { Question } from '../common/models/question.model';
import { AnswerChoicePipe } from '../app/dropdown-choices/answer-choice.pipe';
import { IsInputPipe } from '../app/fill-in-the-gap/is-input.pipe';

export class ExportUtils {
  static exportMultipleChoices(question: Question) {
    let htmlString = '';
    each(question.choices, (choice, index) => {
      if (question.answer.includes(choice.id!)) {
        htmlString += `<u>${CHOICE_INDEX[index]}. ${choice.content ? choice.content : ''}</u><br>`;
      } else {
        htmlString += `${CHOICE_INDEX[index]}. ${choice.content ? choice.content : ''}<br>`;
      }
    });
    return htmlString;
  }

  static exportShortAnswer(question: Question) {
    let htmlString = '';
    each(question.choices, (choice, index) => {
      htmlString += `<b>${choice.index ? choice.index : ''}</b> ${choice.answer ? choice.answer : ''}<br>`;
    });
    return htmlString;
  }

  static exportDropDownChoice(question: Question) {
    return `${AnswerChoicePipe.prototype.transform(question)}<br>`;
  }

  static exportFIllInTheGap(question: Question) {
    let htmlString = '';
    each(question.arrayContent, (line) => {
      each(line, (content) => {
        if (IsInputPipe.prototype.transform(content)) {
          htmlString += ` <b>${question.choices.find((choice) => choice.id === content.match(INPUT_PATTERN)![1])?.answer}</b> `;
        } else {
          htmlString += `${content}`;
        }
      });
      htmlString += '<br>';
    });
    return htmlString;
  }
}
