import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { asBlob } from 'html-docx-js-typescript';
import { each, findIndex, isEmpty } from 'lodash-es';
import { IsInputPipe } from '../app/fill-in-the-gap/is-input.pipe';
import { ChoiceContentPipe } from '../app/matching-header/choice-content.pipe';
import { QuestionType } from '../common/enums/question-type.enum';
import { Question } from '../common/models/question.model';
import { Result } from '../common/models/result.model';
import { AnswerChoicePipe } from '../common/pipes/answer-choice.pipe';
import { CommonUtils } from './common-utils';
import { CHOICE_INDEX, INPUT_PATTERN } from './constant';
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
      if (part.isMatchHeader) {
        each(part.questions, (question) => {
          if (isEmpty(question.answer)) {
            htmlString += `<h2>❌</h2><br> ${question.content}<br><br>`;
          } else {
            htmlString += `<h2>${
              ChoiceContentPipe.prototype.transform(
                question.answer,
                part.answers!,
              )?.content
            }</h2><br> ${question.content}<br><br>`;
          }
        });
      } else {
        htmlString += `<p>${part.content}</p><br>`;
        each(part.questions, (question) => {
          htmlString += `<b>${question.name ? question.name : ''}</b><br>`;
          each(question.subQuestions, (subQuestion) => {
            htmlString += this.exportQuestion(subQuestion);
          });
          htmlString += '<hr>';
        });
      }
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
        return question.answer.includes(choie._id!);
      });
      htmlString += `${question.content} ${
        CHOICE_INDEX[
          findIndex(question.choices, (choie) =>
            question.answer.includes(choie._id!),
          )
        ]
      } ${AnswerChoicePipe.prototype.transform(question)}<br>`;
    });
    return htmlString;
  }

  static exportMultipleChoices(question: Question) {
    let htmlString = '';
    each(question.choices, (choice, index) => {
      if (question.answer && question.answer.includes(choice._id!)) {
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
          htmlString += ` <b>${question.choices.find((choice) => choice._id! === inputPattern.exec(content)![1])?.answer}</b> `;
        } else {
          htmlString += `${content}`;
        }
      });
      htmlString += '<br>';
    });
    return htmlString;
  }

  static exportFeedback(result: Result) {
    let htmlString = '';
    const font = 'Calibri';
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: 'Bảng đánh giá',
              heading: 'Heading1',
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Tên học viên: `,
                  font: font,
                }),
                new TextRun({
                  text: result.studentName,
                  font: font,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Đánh giá: `,
                  font: font,
                }),
                new TextRun({
                  text: `${result.feedback?.rating.toString()}/5`,
                  font: font,
                }),
              ],
            }),
            result.feedback?.rating! < 4
              ? new Paragraph({
                  children: [
                    new TextRun({
                      text: 'Góp ý: ',
                      font: font,
                    }),
                    new TextRun({
                      text: result.feedback?.content,
                      font: font,
                    }),
                  ],
                })
              : new Paragraph({}),
          ],
        },
      ],
    });
    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        `${result.studentName}_Đánh giá_${result.name}_${CommonUtils.getCurrentDate()}${result.studentName}_${result.name}_${CommonUtils.getCurrentDate()}`,
      );
    });
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
