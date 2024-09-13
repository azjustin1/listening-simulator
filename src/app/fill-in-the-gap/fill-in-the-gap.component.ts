import { NgClass } from '@angular/common';
import { Component, NgModule, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import {
  clone,
  each,
  filter,
  isEmpty,
  mapValues,
  omit,
  toArray,
} from 'lodash-es';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { Choice } from '../../common/models/choice.model';
import { CorrectAnswerPipe } from '../../common/pipes/correct-answer.pipe';
import { CommonUtils } from '../../utils/common-utils';
import { INPUT_PATTERN } from '../../utils/constant';
import { ArrayContentChoice } from './array-content.pipe';
import { FitContentDirective } from './fit-content.directive';
import { IsInputPipe } from './is-input.pipe';
import { ChoiceService } from '../question/choice.service';

@Component({
  selector: 'app-fill-in-the-gap',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    AngularEditorModule,
    MatIconModule,
    ArrayContentChoice,
    IsInputPipe,
    FitContentDirective,
    CorrectAnswerPipe,
  ],
  templateUrl: './fill-in-the-gap.component.html',
  styleUrl: './fill-in-the-gap.component.scss',
})
export class FillInTheGapComponent extends AbstractQuestionComponent {
  inputPattern = INPUT_PATTERN;
  mapSaveTextByIndex: Record<number, Record<number, boolean>> = {};
  mapChoiceById: Record<string, Choice> = {};
  mapShowActionByIndex: Record<number, Record<number, boolean>> = {};
  showTextActions = false;

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (!changes['isEditting']?.currentValue) {
      this.saveAllEditting();
    }
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.initMapSaveText();
    this.initChoiceContent();
  }

  initMapSaveText() {
    each(this.question.arrayContent, (line, lineIndex) => {
      this.mapSaveTextByIndex[lineIndex] = {};
      this.mapShowActionByIndex[lineIndex] = {};
      each(line, (content, contentIndex) => {
        this.mapSaveTextByIndex[lineIndex][contentIndex] = true;
        this.mapShowActionByIndex[lineIndex][contentIndex] = false;
      });
    });
  }

  initChoiceContent() {
    each(this.question.choices, (choice) => {
      this.mapChoiceById[choice._id!] = choice;
    });
  }

  addNewLine(index: number) {
    this.question.arrayContent = [
      ...CommonUtils.pushAtIndex(this.question.arrayContent!, index + 1, ['']),
    ];
    this.initMapSaveText();
    this.mapSaveTextByIndex[index + 1] = {
      0: false,
    };
  }

  onDeleteLine(lineIndex: number) {
    const inputId = this.getInputId(this.question.arrayContent![lineIndex])[0];
    if (inputId) {
      this.question.choices = filter(
        this.question.choices,
        (choice) => choice._id !== inputId,
      );
    }
    each(this.question.arrayContent![lineIndex], (content, contentIndex) => {
      this.updateMapChoiceId(lineIndex, contentIndex);
    });
    this.question.arrayContent!.splice(lineIndex, 1);
    this.initMapSaveText();
  }

  private getInputId(line: string[]) {
    return line
      .map((item) => {
        const match = item.match(INPUT_PATTERN);
        return match ? match[1] : null;
      })
      .filter(Boolean);
  }

  moveLineUp(index: number) {
    const tempQuestion = clone(this.question.arrayContent![index - 1]);
    this.question.arrayContent![index - 1] = this.question.arrayContent![index];
    this.question.arrayContent![index] = tempQuestion;
    this.initMapSaveText();
  }

  moveLineDown(index: number) {
    const tempQuestion = clone(this.question.arrayContent![index + 1]);
    this.question.arrayContent![index + 1] = this.question.arrayContent![index];
    this.question.arrayContent![index] = tempQuestion;
    this.initMapSaveText();
  }

  addText(lineIndex: number, contentIndex: number) {
    this.question.arrayContent![lineIndex] = [
      ...CommonUtils.pushAtIndex(
        this.question.arrayContent![lineIndex],
        contentIndex,
        '',
      ),
    ];
    this.saveAllEditting();
    this.mapSaveTextByIndex[lineIndex][contentIndex] = false;
    this.mapShowActionByIndex[lineIndex][contentIndex] = true;
  }

  onEditText(lineIndex: number, contentIndex: number) {
    if (!this.isEditting) {
      return;
    }
    this.saveAllEditting();
    this.mapSaveTextByIndex[lineIndex][contentIndex] = false;
  }

  onSaveText(lineIndex: number, contentIndex: number) {
    if (isEmpty(this.question.arrayContent![lineIndex])) {
      this.question.arrayContent!.splice(lineIndex, 1);
      return;
    }
    this.mapSaveTextByIndex[lineIndex][contentIndex] = true;

    if (
      IsInputPipe.prototype.transform(
        this.question.arrayContent![lineIndex][contentIndex],
      )
    ) {
      this.question.choices = toArray(this.mapChoiceById);
    }
    this.questionService.updateQuestion(this.question).subscribe((resp) => {
      this.question.arrayContent = resp.arrayContent;
    });
  }

  onDeleteText(lineIndex: number, contentIndex: number) {
    this.updateMapChoiceId(lineIndex, contentIndex);
    this.question.arrayContent![lineIndex].splice(contentIndex, 1);
    if (isEmpty(this.question.arrayContent![lineIndex])) {
      this.question.arrayContent![lineIndex].push('');
    }
    this.initMapSaveText();
    this.saveAllEditting();
    this.onSave.emit();
  }

  addInput(lineIndex: number, contentIndex: number) {
    const newChoice: Choice = {
      content: '',
      order: lineIndex + 1,
    };

    this.choiceService.create(this.question, newChoice).subscribe((choice) => {
      this.question.choices.push(choice);
      this.mapChoiceById[choice._id!] = choice;
      this.question.arrayContent![lineIndex] = [
        ...CommonUtils.pushAtIndex(
          this.question.arrayContent![lineIndex],
          contentIndex,
          `<${choice._id}>`,
        ),
      ];
      this.subscriptions.add(
        this.questionService.updateSubQuestion(this.question).subscribe(),
      );
      this.saveAllEditting();
      this.mapSaveTextByIndex[lineIndex][contentIndex] = false;
      this.mapShowActionByIndex[lineIndex][contentIndex] = true;
    });
  }

  saveInput(lineIndex: number, contentIndex: number) {
    const matchInput = RegExp(INPUT_PATTERN).exec(
      this.question.arrayContent![lineIndex][contentIndex],
    );
    if (matchInput) {
      const choice = this.mapChoiceById[matchInput[1]];
      this.subscriptions.add(
        this.choiceService.update(choice).subscribe(() => {
          this.mapSaveTextByIndex[lineIndex][contentIndex] = true;
        }),
      );
    }
  }

  deleteInput(lineIndex: number, contentIndex: number) {
    const matchInput = RegExp(INPUT_PATTERN).exec(
      this.question.arrayContent![lineIndex][contentIndex],
    );
    if (matchInput) {
      const choice = this.mapChoiceById[matchInput[1]];
      this.subscriptions.add(
        this.choiceService.delete(choice._id!).subscribe(),
      );
    }
  }

  onEditInput(lineIndex: number, contentIndex: number) {
    if (!this.isEditting) {
      return;
    }
    this.saveAllEditting();
    this.mapSaveTextByIndex[lineIndex][contentIndex] = false;
    this.mapShowActionByIndex[lineIndex][contentIndex] = true;
  }

  onSaveInput(lineIndex: number, contentIndex: number) {
    this.mapSaveTextByIndex[lineIndex][contentIndex] = true;
    this.onSave.emit();
  }

  private updateMapChoiceId(lineIndex: number, contentIndex: number) {
    const content = this.question.arrayContent![lineIndex][contentIndex];
    if (IsInputPipe.prototype.transform(content)) {
      this.mapChoiceById = omit(
        this.mapChoiceById,
        RegExp(INPUT_PATTERN).exec(content)![1],
      );
    }
  }

  private saveAllEditting() {
    this.mapSaveTextByIndex = {
      ...mapValues(this.mapSaveTextByIndex, (line) => {
        return { ...mapValues(line, () => true) };
      }),
    };

    this.mapShowActionByIndex = {
      ...mapValues(this.mapSaveTextByIndex, (line) => {
        return { ...mapValues(line, () => true) };
      }),
    };
  }
}
