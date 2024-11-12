import { Component, SimpleChanges } from "@angular/core";
import { MatIconModule } from '@angular/material/icon';
import { AbstractQuestionComponent } from '../../shared/abstract/abstract-question.component';
import { DropdownChoicesComponent } from './dropdown-choices/dropdown-choices.component';
import { FillInTheGapComponent } from './fill-in-the-gap/fill-in-the-gap.component';
import { LabelOnMapComponent } from './label-on-map/label-on-map.component';
import { MultipleChoicesComponent } from './multiple-choices/multiple-choices.component';
import { ShortAnswerComponent } from './short-answer/short-answer.component';
import { DragAndDropAnswerComponent } from './drag-and-drop-answer/drag-and-drop-answer.component';
import { QuestionType } from '../../shared/enums/question-type.enum';
import { FillInTheTableComponent } from "./fill-in-the-table/fill-in-the-table.component";

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    MatIconModule,
    MultipleChoicesComponent,
    ShortAnswerComponent,
    DropdownChoicesComponent,
    LabelOnMapComponent,
    FillInTheGapComponent,
    DragAndDropAnswerComponent,
    FillInTheTableComponent,
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
})
export class QuestionComponent extends AbstractQuestionComponent {
  questionType = QuestionType;
}
