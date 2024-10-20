import { Pipe, PipeTransform } from '@angular/core';
import { INPUT_PATTERN } from '../utils/constant';

@Pipe({
  name: 'extractId',
  standalone: true,
})
export class ExtractIdPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): string {
    return value.match(INPUT_PATTERN)![1];
  }
}
