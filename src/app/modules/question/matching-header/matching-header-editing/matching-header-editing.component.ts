import { Component, SimpleChanges } from '@angular/core';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AbstractQuizSectionComponent } from '../../../../shared/abstract/abstract-quiz-section.component';
import { Reading } from '../../../../shared/models/reading.model';
import { MatIcon } from '@angular/material/icon';
import { CommonUtils } from '../../../../utils/common-utils';
import { Question } from '../../../../shared/models/question.model';
import { QuestionType } from '../../../../shared/enums/question-type.enum';
import { each, isUndefined, mapValues, omit } from 'lodash-es';
import { Choice } from '../../../../shared/models/choice.model';
import { JsonPipe, NgClass } from "@angular/common";

@Component({
  selector: 'app-matching-header-editing',
  standalone: true,
  imports: [
    AngularEditorModule,
    FormsModule,
    MatButton,
    MatCardModule,
    MatIcon,
    NgClass,
    JsonPipe,
  ],
  templateUrl: './matching-header-editing.component.html',
  styleUrl: './matching-header-editing.component.scss',
})
export class MatchingHeaderEditingComponent extends AbstractQuizSectionComponent<Reading> {
  mapEditingById: Record<string, boolean> = {};
  mapAnswerById: Record<string, Choice> = {};

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes['data']?.currentValue) {
      this.initMapEditAnswer();
    }
    if (changes['isSaved']?.currentValue) {
      this.saveAllEditing();
    }
  }

  initMapEditAnswer() {
    each(this.section.answers, (answer) => {
      this.mapEditingById[answer.id] = false;
      this.mapAnswerById[answer.id] = answer;
    });
    each(this.section.questions, (question) => {
      this.mapEditingById[question.id] = false;
    });
  }

  addParagraph() {
    const id = CommonUtils.generateRandomId();
    const newQuestion: Question = {
      id: id,
      description: '',
      type: QuestionType.MATCHING_HEADER,
      choices: [],
      answer: [],
      correctAnswer: [],
    };
    this.section.questions.push(newQuestion);
    this.mapEditingById[id] = true;
  }

  editContent(id: string) {
    if (!this.mapEditingById[id]) {
      this.saveAllEditing();
    }
    this.mapEditingById[id] = !this.mapEditingById[id];
  }

  removeParagraph(index: number) {
    this.removeMapEditingId(this.section.questions[index].id);
    this.section.questions.splice(index, 1);
  }

  addAnswer() {
    if (isUndefined(this.section.answers)) {
      this.section.answers = [];
    }
    const id = CommonUtils.generateRandomId();
    const newAnswer: Choice = {
      id: id,
      content: '',
    };
    this.section.answers?.push(newAnswer);
    this.mapEditingById[id] = true;
  }

  removeAnswer(index: number) {
    this.removeMapEditingId(this.section.answers![index].id);
    this.section.answers?.splice(index, 1);
  }

  private removeMapEditingId(id: string) {
    this.mapEditingById = omit(this.mapEditingById, id);
  }

  private saveAllEditing() {
    this.mapEditingById = mapValues(this.mapEditingById, () => false);
  }
}
