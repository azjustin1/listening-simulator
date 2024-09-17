import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { asBlob } from 'html-docx-js-typescript';
import { each, findIndex, isEmpty } from 'lodash-es';
import { IsInputPipe } from '../app/modules/question/fill-in-the-gap/is-input.pipe';
import { ChoiceContentPipe } from '../app/modules/question/matching-header/choice-content.pipe';
import { QuestionType } from '../common/enums/question-type.enum';
import { Question } from '../common/models/question.model';
import { Result } from '../common/models/result.model';
import { AnswerChoicePipe } from '../common/pipes/answer-choice.pipe';
import { CommonUtils } from './common-utils';
import { CHOICE_INDEX, INPUT_PATTERN } from './constant';
import { Reading } from '../common/models/reading.model';
export class ExportUtils {
  static exportQuestion(question: Question): string {
    let htmlString = '';
    htmlString += `<p><b>${question.content ? question.content : ''}</b></p>`;
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

  static exportSelfReading(reading: Reading) {
    let htmlString = `
      <html>
      <head>
        <style>
          .choice {
            display: flex;
            align-items: center;
            width: 100%;
            margin: 1rem 0;
          }
          .choice-index {
            width: 3rem;
            background-color: #d8d2d2;
            border-radius: 50%;
            text-align: center;
            cursor: pointer;
          }
          .choice-index.selected {
            background: #4caf50;
            color: #fff;
          }
          .choice-content {
            margin-left: 10px;
          }
          .question-text {
            width: 100%;
            height: fit-content;
          }
          .answer-input {
            padding: 0 1rem;
            border: 1px solid black;
          }
        </style>
      </head>
      <body>
      <h1>${reading.name} - Reading</h1><h2>Name: ${reading.studentName}</h2>`;

    htmlString += `${reading.content}`;
    each(reading.questions, (question) => {
      htmlString += `<b>${question.name ? question.name : ''}</b>`;
      each(question.subQuestions, (subQuestion) => {
        htmlString += this.exportQuestion(subQuestion);
      });
      htmlString += '<hr>';
    });
    htmlString += `
    </body>
    </html>
    `;
    return htmlString;
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
      if (question.answer?.includes(choice._id!)) {
        htmlString += `
        <div class="choice">
          <div class="choice-index selected">
            <p>${CHOICE_INDEX[index]}</p>
          </div>
          <div class="choice-content">
            <p class="question-text">
              ${choice.content ? choice.content : ''}
            </p>
          </div>
        </div>
        `;
      } else {
        htmlString += `
         <div class="choice">
          <div class="choice-index">
            <p>${CHOICE_INDEX[index]}</p>
          </div>
          <div class="choice-content">
            <p class="question-text">
              ${choice.content ? choice.content : ''}
            </p>
          </div>
        </div>
        `;
      }
    });
    return htmlString;
  }

  static exportShortAnswer(question: Question) {
    let htmlString = '';
    each(question.choices, (choice, index) => {
      htmlString += `<div><b>${choice.index ? choice.index : ''}</b> <span class="answer-input">${choice.answer ? choice.answer : ''}</span></div>`;
    });
    return htmlString;
  }

  static exportDropDownChoice(question: Question) {
    return `<b>Answer</b>: ${AnswerChoicePipe.prototype.transform(question)}`;
  }

  static exportFillInTheGap(question: Question) {
    let htmlString = '';
    const inputPattern = new RegExp(INPUT_PATTERN);
    each(question.arrayContent, (line) => {
      each(line, (content) => {
        if (IsInputPipe.prototype.transform(content)) {
          htmlString += `
            <span class="answer-input">${question.choices.find((choice) => choice._id! === inputPattern.exec(content)![1])?.answer}</span>
          `;
        } else {
          htmlString += `${content}`;
        }
      });
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
