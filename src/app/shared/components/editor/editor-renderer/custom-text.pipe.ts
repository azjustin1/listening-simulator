import { Pipe, PipeTransform } from '@angular/core';
import { OutputBlockData } from '@editorjs/editorjs';

export interface CustomInputBlockData {}

@Pipe({
  standalone: true,
  name: 'CustomTextBlock',
})
export class CustomTextBlockPipe implements PipeTransform {
  transform(value: OutputBlockData, ...args: any[]): Array<any> {
    if (Array.isArray(value.data.content)) {
      return value.data.content as [];
    }
    return [];
  }
}
