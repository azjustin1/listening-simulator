import { Pipe, PipeTransform } from '@angular/core';

export interface ListBlock {
  items: {
    content: string;
    meta: {
      checked: boolean;
    };
  };
}

@Pipe({
  name: 'CheckListBlock',
  standalone: true,
})
export class CheckListBlockPipePipe implements PipeTransform {
  transform(value: any[], ...args: any[]): Array<ListBlock[]> {
    return value;
  }
}
