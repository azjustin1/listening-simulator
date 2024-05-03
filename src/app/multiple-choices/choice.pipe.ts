import { Pipe, PipeTransform } from '@angular/core';
import { chunk, sortBy } from 'lodash-es';

@Pipe({
  standalone: true,
  name: 'correctChoice',
})
export class ChoicePipe implements PipeTransform {
  transform(value: string): string[] {
    return sortBy(chunk(value, 20).map((chunk) => chunk.join('')));
  }
}
