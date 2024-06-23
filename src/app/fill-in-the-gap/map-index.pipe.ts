import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'mapIndex',
})
export class MapIndexPipe implements PipeTransform {
  transform(value: any[], key: string): any {
    return value.findIndex((item) => item.key === key) + 1;
  }
}
