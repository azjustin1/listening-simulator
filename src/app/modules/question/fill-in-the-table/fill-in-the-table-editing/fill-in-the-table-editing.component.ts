import { Component } from '@angular/core';
import { FillInTheGapEditingComponent } from '../../fill-in-the-gap/fill-in-the-gap-editing/fill-in-the-gap-editing.component';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { ExtractIdPipe } from '../../../../pipes/extract-id.pipe';
import { FormsModule } from '@angular/forms';
import { IsInputPipe } from '../../fill-in-the-gap/is-input.pipe';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { KeyValuePipe, NgClass } from "@angular/common";
import {
  each,
  forEach,
  keys,
  mapKeys,
  mapValues,
  omit,
  toArray,
} from 'lodash-es';
import { INPUT_PATTERN } from '../../../../utils/constant';
import { CommonUtils } from '../../../../utils/common-utils';

@Component({
  selector: 'app-fill-in-the-table-editing',
  standalone: true,
  imports: [
    AngularEditorModule,
    ExtractIdPipe,
    FormsModule,
    IsInputPipe,
    MatButton,
    MatIcon,
    KeyValuePipe,
    NgClass,
  ],
  templateUrl: './fill-in-the-table-editing.component.html',
  styleUrl: './fill-in-the-table-editing.component.scss',
})
export class FillInTheTableEditingComponent extends FillInTheGapEditingComponent {
  headerColSpan = 1;
  mapEditingByCell: Record<string, Record<number, boolean>> = {
    tr0td0: {
      0: false,
      1: false,
    },
  };

  override ngOnInit() {
    super.ngOnInit();
    if (this.question.tableContent) {
      this.headerColSpan = Object.keys(
        this.question.tableContent['tr0'],
      ).length;
      each(this.question.tableContent, (row, rowKey) => {
        each(row, (column, columnKey) => {
          this.mapEditingByCell[`${rowKey}${columnKey}`] = {};
          each(column, (content, index) => {
            this.mapEditingByCell[`${rowKey}${columnKey}`][index] = false;
          });
        });
      });
      console.log(this.mapEditingByCell);
    }
  }

  addNewRow() {
    if (this.question.tableContent) {
      let columnLength = 2;
      if (this.question.tableContent['tr0']) {
        columnLength = Object.keys(this.question.tableContent['tr0']).length;
      }
      let newRow: Record<string, string[]> = {};
      const newRowIndex = keys(this.question.tableContent).length;
      for (let i = 0; i < columnLength; i++) {
        newRow[`td${i}`] = ['Text'];
        this.mapEditingByCell[`tr${newRowIndex}td${i}`] = {
          0: false,
        };
      }
      this.question.tableContent[`tr${newRowIndex}`] = newRow;
    }
  }

  deleteRow(index: number) {
    const omitted = omit(this.question.tableContent, [`tr${index}`]);
    const sortedKeys: string[] = keys(omitted).sort((key1, key2) => {
      const num1 = parseInt(key1.replace('tr', ''), 10);
      const num2 = parseInt(key2.replace('tr', ''), 10);
      return num1 - num2;
    });
    const reorderRows: Record<string, Record<string, string[]>> = {};
    sortedKeys.forEach((key: string, index: number) => {
      reorderRows[`tr${index}`] = omitted[key];
    });
    this.question.tableContent = reorderRows;
  }

  addNewColumn() {
    if (this.question.tableContent) {
      const columnLength = Object.keys(
        this.question.tableContent['tr0'],
      ).length;
      each(this.question.tableContent, (row, key) => {
        if (this.question.tableContent![`${key}`]) {
          this.question.tableContent![`${key}`][`td${columnLength}`] = ['Text'];
          this.mapEditingByCell[`${key}td${columnLength}`] = {
            0: false,
          };
        }
      });
      this.headerColSpan = keys(this.question.tableContent['tr0']).length;
    }
  }

  deleteColumn(index: number) {
    each(this.question.tableContent, (row, key) => {
      if (this.question.tableContent![`${key}`]) {
        const omitted = omit(this.question.tableContent![`${key}`], [
          `td${index}`,
        ]);
        const sortedKeys: string[] = keys(omitted).sort((key1, key2) => {
          const num1 = parseInt(key1.replace('td', ''), 10);
          const num2 = parseInt(key2.replace('td', ''), 10);
          return num1 - num2;
        });
        const reorderColumns: Record<string, string[]> = {};
        sortedKeys.forEach((key: string, index: number) => {
          reorderColumns[`td${index}`] = omitted[key];
        });
        this.question.tableContent![`${key}`] = reorderColumns;
      }
    });
    this.headerColSpan--;
  }

  addColumnText(rowKey: string, columnKey: string, index: number) {
    this.question.tableContent![`${rowKey}`][`${columnKey}`] = [
      ...CommonUtils.pushAtIndex(
        this.question.tableContent![`${rowKey}`][`${columnKey}`],
        index,
        '',
      ),
    ];
    this.enableEdit(rowKey, columnKey, index);
  }

  editColumnText(rowKey: string, columnKey: string, index: number) {
    const foundContent = this.mapEditingByCell[`${rowKey}${columnKey}`];
    if (foundContent) {
      this.mapEditingByCell[`${rowKey}${columnKey}`][index] = true;
    }
    this.enableEdit(rowKey, columnKey, index);
  }

  saveColumnText(rowKey: string, columnKey: string, index: number) {
    const foundContent = this.mapEditingByCell[`${rowKey}${columnKey}`];
    if (foundContent) {
      this.mapEditingByCell[`${rowKey}${columnKey}`][index] = false;
    }
    this.saveOthersEditing();
  }

  deleteColumnText(rowKey: string, columnKey: string, index: number) {
    this.question.tableContent![`${rowKey}`][`${columnKey}`].splice(index, 1);
  }

  addColumnInput(rowKey: string, columnKey: string, index: number) {
    this.enableEdit(rowKey, columnKey, index);
    const foundContent = this.mapEditingByCell[`${rowKey}${columnKey}`];
    if (foundContent) {
      const newChoice = {
        id: CommonUtils.generateRandomId(),
        content: '',
        correctAnswer: '',
        answer: '',
      };
      this.mapChoiceById[newChoice.id] = newChoice;
      this.question.tableContent![`${rowKey}`][`${columnKey}`] = [
        ...CommonUtils.pushAtIndex(
          this.question.tableContent![`${rowKey}`][`${columnKey}`],
          index,
          `<${newChoice.id}>`,
        ),
      ];
    }
  }

  editColumnInput(rowKey: string, columnKey: string, index: number) {
    this.mapEditingByCell[`${rowKey}${columnKey}`][index] = true;
  }

  saveColumnInput(rowKey: string, columnKey: string, index: number) {
    this.question.choices = toArray(this.mapChoiceById);
    this.saveOthersEditing();
  }

  deleteColumnInput(rowKey: string, columnKey: string, index: number) {
    const content =
      this.question.tableContent![`${rowKey}`][`${columnKey}`][index];
    this.question.tableContent![`${rowKey}`][`${columnKey}`].splice(index, 1);
    this.mapChoiceById = omit(
      this.mapChoiceById,
      RegExp(INPUT_PATTERN).exec(content)![1],
    );
  }

  private enableEdit(rowKey: string, columnKey: string, index: number) {
    this.saveOthersEditing();
    this.mapEditingByCell[`${rowKey}${columnKey}`][index] = true;
  }

  private saveOthersEditing() {
    this.mapEditingByCell = {
      ...mapValues(this.mapEditingByCell, (cell) => {
        return { ...mapValues(cell, () => false) };
      }),
    };
    this.onSave.emit();
  }
}
