import { Pipe, PipeTransform } from "@angular/core";

export interface CheckBoxBlock {
  items: {
    value: string;
    label: string;
    checked: boolean;
  }
}

@Pipe({
  name: "CheckBoxBlock",
  standalone: true
})
export class CheckboxBlockPipe implements PipeTransform {
  transform(value: any, ...args: any[]): CheckBoxBlock[] {
    return value;
  }
}
