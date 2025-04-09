import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChoiceContentPipe } from '../choice-content.pipe';
import { each, filter, map, sortBy } from 'lodash-es';
import { Choice } from '../../../../shared/models/choice.model';
import { FormsModule } from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { NgClass } from '@angular/common';
import { Question } from '../../../../shared/models/question.model';
import { AbstractQuizSectionComponent } from '../../../../shared/abstract/abstract-quiz-section.component';
import { Reading } from '../../../../shared/models/reading.model';
import { SectionType } from '../../../../shared/enums/section-type.enum';

const DATA_TRANSFER_KEY = 'answerId';
const DROP_OVER_CLASS = 'drop-over';
const CONTAINER_RIGHT_ID = 'container-right';

@Component({
  selector: 'app-matching-header-testing',
  standalone: true,
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatCard,
    AngularEditorModule,
    NgClass,
    ChoiceContentPipe,
  ],
  templateUrl: './matching-header-testing.component.html',
  styleUrl: './matching-header-testing.component.scss',
})
export class MatchingHeaderTestingComponent
  extends AbstractQuizSectionComponent<Reading>
  implements OnInit
{
  answers: Choice[] = [];
  @Output() onAnswer = new EventEmitter();

  override ngOnInit(): void {
    const answeredIds = this.section.parts[this.selectedPart].questions.map(
      (question) => question.answer,
    );
    this.answers = this.section.answers!.filter(
      (answer) => !answeredIds.includes(answer._id!),
    );
    if (this.isTesting) {
      this.remapDroppedAnswers();
    }
  }

  remapDroppedAnswers() {
    const answerIds = map(
      this.section.parts[this.selectedPart].questions,
      (question) => question.answer,
    );
    this.answers = sortBy(
      filter(this.answers, (answer) => !answerIds.includes(answer._id!)),
    );
  }

  onDragOver(event: DragEvent, questionId: string) {
    event.preventDefault();
    this.addDropOverClass(questionId);
  }

  removeDropOver(event: DragEvent, questionId: string) {
    event.preventDefault();
    this.removeDropOverClass(questionId);
  }

  onDropAnswer(event: DragEvent, question: Question) {
    event.preventDefault();
    const choice = ChoiceContentPipe.prototype.transform(
      event.dataTransfer!.getData(DATA_TRANSFER_KEY),
      this.section.answers!,
    );
    if (choice) {
      this.removeDuplicateChoiceInOthers(choice);
      each(this.section.parts[this.selectedPart].questions, (dataQuestion) => {
        if (dataQuestion._id === question._id) {
          dataQuestion.answer = choice._id!;
        }
      });
      this.answers = filter(this.section.answers, (a) => a._id !== choice._id);
      this.removeDropOverClass(question._id!);
      this.remapDroppedAnswers();
      this.onAnswer.emit(question);
    }
  }

  removeDuplicateChoiceInOthers(choice: Choice) {
    each(this.section.parts[this.selectedPart].questions, (question) => {
      if (question.answer && question.answer === choice._id) {
        question.answer = '';
      }
    });
  }

  onDragStart(event: DragEvent, answerId: string) {
    event.dataTransfer!.dropEffect = 'move';
    event.dataTransfer!.setData(DATA_TRANSFER_KEY, answerId);
    event.dataTransfer!.setDragImage(event.target as HTMLElement, 0, 0);
  }

  onAnswerBackDragOver(event: DragEvent) {
    event.preventDefault();
    this.addDropOverClass(CONTAINER_RIGHT_ID);
  }

  onAnswerBackDragLeave(event: DragEvent) {
    event.preventDefault();
    this.removeDropOverClass(CONTAINER_RIGHT_ID);
  }

  onAnswerBackDrop(event: DragEvent) {
    event.preventDefault();
    const answer = ChoiceContentPipe.prototype.transform(
      event.dataTransfer!.getData(DATA_TRANSFER_KEY),
      this.section.answers!,
    );
    if (answer) {
      each(this.section.parts[this.selectedPart].questions, (question) => {
        if (question.answer === answer._id) {
          question.answer = '';
          this.onAnswer.emit(question);
        }
      });
      if (!map(this.answers, (answer) => answer._id).includes(answer._id)) {
        this.answers.push(answer);
        this.answers = sortBy(this.answers, ['id']);
      }
      this.removeDropOverClass(CONTAINER_RIGHT_ID);
    }
  }

  addDropOverClass(elementId: string) {
    const dropZone = document.getElementById(elementId) as HTMLElement;
    dropZone.classList.add(DROP_OVER_CLASS);
  }

  removeDropOverClass(elementId: string) {
    const dropZone = document.getElementById(elementId) as HTMLElement;
    dropZone.classList.remove(DROP_OVER_CLASS);
  }

  getSectionType(): SectionType {
    return SectionType.Reading;
  }
}
