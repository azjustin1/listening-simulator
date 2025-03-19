import { Pipe, PipeTransform } from "@angular/core";
import { Question } from "../shared/models/question.model";
import { Choice } from "../shared/models/choice.model";

@Pipe({
  name: "correctDropdownAnswer",
  standalone: true,
})
export class CorrectDropDownAnswerPipe implements PipeTransform {
  transform(question: Question): Choice {
    return question.choices.find(choice => choice._id === question.correctAnswer[0])!;
  }
}
