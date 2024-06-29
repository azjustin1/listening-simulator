import { Pipe, PipeTransform } from '@angular/core';
import { each, find, isString } from 'lodash-es';
import { Choice } from '../../common/models/choice.model';

@Pipe({
  name: 'choiceContent',
  standalone: true,
})
export class ChoiceContentPipe implements PipeTransform {
  transform(answer: string | string[], answers: Choice[]): Choice | undefined {
    return find(answers, (item) => item.id === answer);
  }
}
