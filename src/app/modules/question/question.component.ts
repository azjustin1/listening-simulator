import {
  Component,
  EventEmitter,
  Input,
  model,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AbstractQuestionComponent } from '../../shared/abstract/abstract-question.component';
import { DropdownChoicesComponent } from './dropdown-choices/dropdown-choices.component';
import { FillInTheGapComponent } from './fill-in-the-gap/fill-in-the-gap.component';
import { LabelOnMapComponent } from './label-on-map/label-on-map.component';
import { MultipleChoicesComponent } from './multiple-choices/multiple-choices.component';
import { DragAndDropAnswerComponent } from './drag-and-drop-answer/drag-and-drop-answer.component';
import { QuestionType } from '../../shared/enums/question-type.enum';
import { FillInTheTableComponent } from './fill-in-the-table/fill-in-the-table.component';
import { DragInTableComponent } from './drag-in-table/drag-in-table.component';
import { ShortAnswerComponent } from './short-answer/short-answer.component';
import { Question } from '../../shared/models/question.model';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    MatIconModule,
    MultipleChoicesComponent,
    DropdownChoicesComponent,
    LabelOnMapComponent,
    FillInTheGapComponent,
    DragAndDropAnswerComponent,
    FillInTheTableComponent,
    DragInTableComponent,
    ShortAnswerComponent,
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
})
export class QuestionComponent {
  @Input() question!: Question;
  @Input() isSaved: boolean = false;
  @Input() isEditing: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() isTesting: boolean = false;
  @Input() isExpandable: boolean = true;
  @Output() onSave = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onAnswer = new EventEmitter();
  @Output() onAnswerChoice = new EventEmitter();
  @Output() isInvalid = new EventEmitter();
  selectedId = model();
  selectedQuestionIndex = model();
  questionType = QuestionType;

  onSaveQuestion() {
    this.onSave.emit();
  }
}
