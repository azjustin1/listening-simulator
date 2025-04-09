import { Pipe, PipeTransform } from '@angular/core';
import { ListItem } from '@editorjs/list/dist/types/ListParams';

@Pipe({
  name: 'ListBlock',
  standalone: true,
})
export class ListBlockPipe implements PipeTransform {
  transform(value: ListItem[], ...args: any[]): ListItem[] {
    return value;
  }
}
