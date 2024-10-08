import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractPart } from '../../../shared/models/abstract-part.model';
import { Question } from '../../../shared/models/question.model';
import { each, findIndex, toArray } from 'lodash-es';
import { JsonPipe, KeyValuePipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-question-navigation',
  standalone: true,
  imports: [KeyValuePipe, NgClass, MatIcon, JsonPipe],
  templateUrl: './question-navigation.component.html',
  styleUrl: './question-navigation.component.scss',
})
export class QuestionNavigationComponent implements OnInit {
  @Input() selectedId = '';
  @Output() selectedIdChange = new EventEmitter();
  @Input() parts: AbstractPart[] = [];
  @Input() selectedPart = 0;
  @Input() mapAnsweredById: Record<string, boolean> = {};
  @Output() onSelectQuestion = new EventEmitter();

  ngOnInit(): void {}

  onClickQuestion(id: string) {
    this.onSelectQuestion.emit(id);
    this.selectedId = id;
  }
}
