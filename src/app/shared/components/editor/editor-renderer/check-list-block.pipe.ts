import { Pipe, PipeTransform } from '@angular/core';
import { ListItem } from '@editorjs/list/dist/types/ListParams';
import { OutputBlockData } from '@editorjs/editorjs';
import { ChecklistItemMeta } from '@editorjs/list/dist/types/ItemMeta';

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
