import { Pipe, PipeTransform } from '@angular/core';
import { Question } from '../../common/models/question.model';

@Pipe({
  standalone: true,
  name: 'dropDownChocie',
})
export class DropdownChoicePipe implements PipeTransform {
  transform(question: Question, ...args: any[]): any {
    const selectedChoice = question.choices.find(
      (choice) => choice.id === question.correctAnswer[0],
    );
    if (selectedChoice) {
      return selectedChoice.content;
    }
    return '';
  }
}
