import { saveAs } from 'file-saver';
import { asBlob } from 'html-docx-js-typescript';
import { each, findIndex, isEmpty } from 'lodash-es';
import { IsInputPipe } from '../app/fill-in-the-gap/is-input.pipe';
import { QuestionType } from '../common/enums/question-type.enum';
import { Question } from '../common/models/question.model';
import { Result } from '../common/models/result.model';
import { CHOICE_INDEX, INPUT_PATTERN } from './constant';
import { CommonUtils } from './common-utils';
import { AnswerChoicePipe } from '../common/pipes/answer-choice.pipe';

export class ExportUtils {
  static exportQuestion(question: Question): string {
    let htmlString = '';
    htmlString += `<p>${question.content ? question.content : ''}</p><br>`;
    switch (question.type) {
      case QuestionType.MULTIPLE_CHOICE:
        htmlString += this.exportMultipleChoices(question);
        break;
      case QuestionType.SHORT_ANSWER:
        htmlString += this.exportShortAnswer(question);
        break;
      case QuestionType.DROPDOWN_ANSWER:
        htmlString += this.exportDropDownChoice(question);
        break;
      case QuestionType.LABEL_ON_MAP:
        htmlString += this.exportLabelOnMap(question);
        break;
      case QuestionType.FILL_IN_THE_GAP:
        htmlString += this.exportFillInTheGap(question);
        break;
      default:
        break;
    }
    return htmlString;
  }

  static exportListening(result: Result) {
    let htmlString = `<h1>${result.name} - Listening</h1><br><h2>Name: ${result.studentName}</h2><br><h2>Point: </h2><br>`;
    each(result.listeningParts, (part, index) => {
      htmlString += `<h3>Part ${index + 1}</h3><br>`;
      each(part.questions, (question) => {
        htmlString += this.exportQuestion(question);
      });
      htmlString += '<hr>';
    });
    this.exportFile(result, htmlString, 'Listening');
  }

  static exportReading(result: Result) {
    let htmlString = `<h1>${result.name} - Reading</h1><br><h2>Name: ${result.studentName}</h2><br><h2>Point: </h2><br>`;
    each(result.readingParts, (part, index) => {
      htmlString += `<h3>Part ${index + 1}</h3><br>`;
      htmlString += `<p>${part.content}</p><br>`;
      each(part.questions, (question) => {
        htmlString += `<b>${question.name ? question.name : ''}<b><br>`;
        each(question.subQuestions, (subQuestion) => {
          htmlString += this.exportQuestion(subQuestion);
        });
        htmlString += '<hr>';
      });
    });
    this.exportFile(result, htmlString, 'Reading');
  }

  static exportWriting(result: Result) {
    let htmlString = `<h1>${result.name} - Writing</h1><br><h2>Name: ${result.studentName}</h2><br><h2>Point: </h2><br>`;
    each(result.writingParts, (part) => {
      htmlString =
        htmlString + part.content + '<br>' + part.answer + '<hr><br>';
    });

    this.exportFile(result, htmlString, 'Writing');
  }

  static exportLabelOnMap(question: Question) {
    let htmlString = '';
    each(question.subQuestions, (question) => {
      findIndex(question.choices, (choie) => {
        return question.answer.includes(choie.id);
      });
      htmlString += `${question.content} ${
        CHOICE_INDEX[
          findIndex(question.choices, (choie) =>
            question.answer.includes(choie.id),
          )
        ]
      } ${AnswerChoicePipe.prototype.transform(question)}<br>`;
    });
    return htmlString;
  }

  static exportMultipleChoices(question: Question) {
    let htmlString = '';
    each(question.choices, (choice, index) => {
      if (question.answer.includes(choice.id)) {
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

  static exportFillInTheGap(question: Question) {
    let htmlString = '';
    const inputPattern = new RegExp(INPUT_PATTERN);
    each(question.arrayContent, (line) => {
      each(line, (content) => {
        if (IsInputPipe.prototype.transform(content)) {
          htmlString += ` <b>${question.choices.find((choice) => choice.id === inputPattern.exec(content)![1])?.answer}</b> `;
        } else {
          htmlString += `${content}`;
        }
      });
      htmlString += '<br>';
    });
    return htmlString;
  }

  static exportFile(result: Result, htmlString: string, part: string) {
    if (!isEmpty(htmlString)) {
      asBlob(htmlString).then((data: any) => {
        saveAs(
          data,
          `${result.studentName}_${part}_${result.name}_${CommonUtils.getCurrentDate()}`,
        );
      });
    }
  }
}
