import { Pipe, PipeTransform } from '@angular/core';
import { Question } from '../../common/models/question.model';

@Pipe({
  standalone: true,
  name: 'answerChoice',
})
export class AnswerChoicePipe implements PipeTransform {
  transform(question: Question, ...args: any[]): any {
    const selectedChoice = question.choices.find(
      (choice) => choice.id === question.answer,
    );
    console.log(selectedChoice)
    if (selectedChoice) {
      return selectedChoice.content;
    }
    return '';
  }
}
