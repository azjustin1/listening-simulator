import {
  Component,
  EventEmitter,
  input,
  Input,
  model,
  OnInit,
  Output,
  WritableSignal,
} from '@angular/core';
import { AbstractPart } from '../../../shared/models/abstract-part.model';
import { JsonPipe, KeyValuePipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { QuestionIndex } from '../../../pages/full-test/full-test.component';

@Component({
  selector: 'app-question-navigation',
  standalone: true,
  imports: [KeyValuePipe, NgClass, MatIcon, JsonPipe],
  templateUrl: './question-navigation.component.html',
  styleUrl: './question-navigation.component.scss',
})
export class QuestionNavigationComponent {
  @Output() selectedIdChange = new EventEmitter();
  @Input() parts: AbstractPart[] = [];
  @Input() mapAnsweredById: Record<string, QuestionIndex[]> = {};
  @Output() onSelectQuestion = new EventEmitter();
  selectedId = model('');
  selectedQuestionIndex = model<QuestionIndex | null>();

  onClickQuestion(questionId: string, questionIndex: QuestionIndex) {
    this.selectedQuestionIndex.set(questionIndex);
    this.selectedId.set(questionIndex.id!);
    this.onSelectQuestion.emit(questionId);
  }
}
