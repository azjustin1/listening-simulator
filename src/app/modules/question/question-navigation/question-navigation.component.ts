import { Component, EventEmitter, Input, model, Output } from '@angular/core';
import { AbstractPart } from '../../../shared/models/abstract-part.model';
import { KeyValuePipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { QuestionIndex } from '../../../pages/full-test/full-test.component';
import { each, forEach, isEmpty } from 'lodash-es';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question-navigation',
  standalone: true,
  imports: [KeyValuePipe, NgClass, MatIcon, FormsModule],
  templateUrl: './question-navigation.component.html',
  styleUrl: './question-navigation.component.scss',
})
export class QuestionNavigationComponent {
  @Input() parts: AbstractPart[] = [];
  @Input() mapAnsweredById: Record<string, QuestionIndex[]> = {};
  @Output() onSelectQuestion = new EventEmitter();
  @Output() onReviewQuestion = new EventEmitter();
  selectedId = model('');
  selectedQuestionIndex = model<QuestionIndex | null>();

  returnZero() {
    return 0;
  }

  onClickQuestion(questionId: string, questionIndex: QuestionIndex) {
    this.selectedQuestionIndex.set(questionIndex);
    this.selectedId.set(questionIndex.id!);
    this.onSelectQuestion.emit(questionId);
    console.log(this.selectedId());
    console.log(this.selectedQuestionIndex());
    this.scrollToQuestion(this.selectedQuestionIndex()!.id as string);
  }

  scrollToQuestion(id: string) {
    const element = document.getElementById(id);
    const container = document.getElementById('quiz-container');
    if (element && container) {
      element.scrollIntoView({ inline: 'start' });
    }
  }

  next() {
    each(this.mapAnsweredById, (questionIndexes, questionId) => {
      if (this.selectedQuestionIndex() === null) {
        this.setSelectedId(questionId, questionIndexes[0]);
        return false;
      }
      const nextQuestionIndex = questionIndexes.find(
        (questionIndex) =>
          questionIndex.index === this.selectedQuestionIndex()!.index + 1,
      );
      if (nextQuestionIndex) {
        this.setSelectedId(questionId, nextQuestionIndex);
        return false;
      }
      return true;
    });
  }

  prev() {
    if (this.selectedQuestionIndex() !== null) {
      forEach(this.mapAnsweredById, (questionIndexes, questionId) => {
        const prevQuestionIndex = questionIndexes.find(
          (questionIndex) =>
            questionIndex.index === this.selectedQuestionIndex()!.index - 1,
        );
        if (prevQuestionIndex) {
          this.setSelectedId(questionId, prevQuestionIndex);
          return false;
        }
        return true;
      });
    }
  }

  private setSelectedId(questionId: string, questionIndex: QuestionIndex) {
    this.selectedQuestionIndex.set(questionIndex);
    this.onSelectQuestion.emit(questionId);
    if (!isEmpty(questionIndex.id)) {
      this.selectedId.set(questionIndex.id!);
    } else {
      this.selectedId.set(questionId);
    }
  }

  reviewQuestion() {
    if (this.selectedQuestionIndex() !== null) {
      this.selectedQuestionIndex.set({
        ...(this.selectedQuestionIndex() as QuestionIndex),
        isReviewed: !this.selectedQuestionIndex()?.isReviewed,
      });
      this.onReviewQuestion.emit(this.selectedQuestionIndex());
    }
  }
}
