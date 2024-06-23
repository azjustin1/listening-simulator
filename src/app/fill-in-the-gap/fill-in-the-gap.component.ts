import { CommonModule } from '@angular/common';
import { Component, HostListener, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { clone, each, isEmpty, mapValues, toArray } from 'lodash-es';
import { AbstractQuestionComponent } from '../../common/abstract-question.component';
import { Choice } from '../../common/models/choice.model';
import { CommonUtils } from '../../utils/common-utils';
import { ArrayContentChoice } from './array-content.pipe';
import { FitContentDirective } from './fix-content.directive';
import { IsInputPipe } from './is-input.pipe';
import { MapIndexPipe } from './map-index.pipe';

@Component({
  selector: 'app-fill-in-the-gap',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    AngularEditorModule,
    MatIconModule,
    MatCardModule,
    ArrayContentChoice,
    IsInputPipe,
    MapIndexPipe,
    FitContentDirective,
  ],
  templateUrl: './fill-in-the-gap.component.html',
  styleUrl: './fill-in-the-gap.component.scss',
})
export class FillInTheGapComponent extends AbstractQuestionComponent {
  indexPattern = /<(.+?)>/;
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

  @HostListener('input', ['$event.target'])
  onInput(element: HTMLInputElement): void {
    this.autoGrowInput(element);
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
      this.mapChoiceById[choice.id] = choice;
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

  onDeleteLine(index: number) {
    this.question.arrayContent!.splice(index, 1);
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
  }

  onDeleteText(lineIndex: number, contentIndex: number) {
    this.question.arrayContent![lineIndex].splice(contentIndex, 1);
    this.saveAllEditting();
  }

  addInput(lineIndex: number, contentIndex: number) {
    const newChoice = {
      id: CommonUtils.generateRandomId(),
      content: '',
    };
    this.question.choices.push(newChoice);
    this.mapChoiceById[newChoice.id] = newChoice;
    this.question.arrayContent![lineIndex] = [
      ...CommonUtils.pushAtIndex(
        this.question.arrayContent![lineIndex],
        contentIndex,
        `<${newChoice.id}>`,
      ),
    ];
    this.saveAllEditting();
    this.mapSaveTextByIndex[lineIndex][contentIndex] = false;
    this.mapShowActionByIndex[lineIndex][contentIndex] = true;
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
  }

  private autoGrowInput(element: HTMLInputElement): void {
    element.style.width = `${element.value.length + 2}ch`;
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
