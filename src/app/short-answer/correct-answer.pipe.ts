import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'correctAnswer',
})
export class CorrectShortAnswerPipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }


}
