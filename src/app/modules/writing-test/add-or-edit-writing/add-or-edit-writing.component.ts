import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AngularEditorConfig,
  AngularEditorModule,
  UploadResponse,
} from '@wfpena/angular-wysiwyg';
import { each } from 'lodash-es';
import { interval, map, Subscription } from 'rxjs';
import { Writing } from '../../../../common/models/writing.model';
import { CommonUtils } from '../../../../utils/common-utils';
import { ConfirmDialogComponent } from '../../../shared/components/dialogs/confirm-dialog/confirm-dialog.component';
import { FileService } from '../../../file.service';
import { WritingComponent } from '../../part/writing/writing.component';
import { WritingService } from '../writing-test.service';

import { saveAs } from 'file-saver';
import { asBlob } from 'html-docx-js-typescript';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-or-edit-writing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    AngularEditorModule,
    WritingComponent,
  ],
  providers: [WritingService, FileService],
  templateUrl: './add-or-edit-writing.component.html',
  styleUrl: './add-or-edit-writing.component.scss',
})
export class AddOrEditWritingComponent {
  state: { [key: string]: boolean } = {
    isSaved: false,
    isEditing: false,
    isTesting: false,
    isReadOnly: false,
  };
  data: Writing = {
    id: '',
    name: '',
    content: '',
    answer: '',
    timeout: 0,
    wordCount: 0,
    questions: [],
    parts: [],
    testDate: '',
  };

  result!: Writing;

  isReady: boolean = false;
  mapSavedPart: Record<number, boolean> = {};
  minutes: number = 0;
  seconds: number = 0;
  totalSeconds: number = 0;

  config: AngularEditorConfig = {
    editable: true,
    sanitize: true,
    toolbarHiddenButtons: [
      [
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertHorizontalRule',
        'insertVideo',
        'subscript',
        'superscript',
        'undo',
        'redo',
        'toggleEditorMode',
      ],
      [],
    ],
    upload: (file: File) => {
      return this.fileService.uploadFile(file).pipe(
        map((response) => {
          const imageUrl = `${environment.api}/upload/${response.fileName}`;
          return {
            ...response,
            body: { imageUrl: imageUrl },
          } as HttpResponse<UploadResponse>;
        }),
      );
    },
  };

  subscriptions: Subscription[] = [];

  @HostListener('document:keydown.control.s', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (this.state['isTesting']) {
      this.onCtrlSave();
    }
    if (this.state['isEditing']) {
      this.saveOrEdit(this.data);
    }
  }

  constructor(
    protected writingService: WritingService,
    protected fileService: FileService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
  ) {
    this.state = {
      ...this.state,
      ...this.router.getCurrentNavigation()?.extras.state!,
    };
    const resultId =
      this.router.getCurrentNavigation()?.extras.state?.['resultId'];
    if (resultId) {
      this.writingService.getResultById(resultId).subscribe((result) => {
        this.result = { ...result };
        this.data = { ...result };
        this.getTimeout();
        this.onStart();
      });
    }

    this.route.paramMap.subscribe((paramMap: any) => {
      const id = paramMap.get('id');
      if (id) {
        if (this.state['isEditing'] || this.state['isTesting']) {
          const sub = this.writingService
            .getById(id)
            .subscribe((writing: any) => {
              this.data = writing;
              each(this.data.parts, (part, index) => {
                this.mapSavedPart[index] = true;
              });
            });
          this.subscriptions.push(sub);
        }
        if (this.state['isReadOnly']) {
          const sub = this.writingService
            .getResultById(id)
            .subscribe((result) => {
              this.data = result;
            });
          this.subscriptions.push(sub);
        }
      }
    });
  }

  getTimeout() {
    this.totalSeconds = this.result.timeout! * 60;
    this.minutes = Math.floor(this.totalSeconds / 60);
    this.seconds = this.totalSeconds % 60;
  }

  onStart() {
    if (!this.result) {
      this.result = { ...this.data, id: CommonUtils.generateRandomId() };
      this.writingService.submit(this.result).subscribe();
    }
    this.isReady = true;
    this.getTimeout();
    const sub = interval(1000).subscribe(() => {
      if (this.seconds < 1) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
      if (this.minutes === 0 && this.seconds === 0) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          hasBackdrop: true,
          disableClose: true,
        });
        dialogRef.componentInstance.title = 'Information';
        dialogRef.componentInstance.message = "Time's up";
        dialogRef.componentInstance.isWarning = true;
        dialogRef.afterClosed().subscribe((isConfirm) => {
          if (isConfirm) {
            this.onSubmit();
          }
        });
      }
    });
    this.subscriptions.push(sub);
  }

  onSaveClick() {
    this.saveOrEdit(this.data);
    this.router.navigate(['writings']);
  }

  saveOrEdit(writing: Writing) {
    let observer;
    if (writing.id) {
      observer = this.writingService.edit(writing);
    } else {
      observer = this.writingService.create({
        ...writing,
        id: CommonUtils.generateRandomId(),
      });
    }
    const sub = observer.subscribe();

    this.subscriptions.push(sub);
  }

  onCtrlSave() {
    this.result = {
      ...this.result,
      timeout: this.seconds / 60 + this.minutes,
    };
    this.subscriptions.push(
      this.writingService.editWritingResult(this.result).subscribe(),
    );
  }

  onSubmit() {
    this.result = {
      ...this.result,
      isSubmit: true,
      testDate: CommonUtils.getCurrentDate(),
    };
    this.buildDownloadFile();
    this.writingService.editWritingResult(this.result).subscribe(() => {
      this.router.navigate(['writings']);
    });
  }

  public buildDownloadFile(): void {
    let htmlString = `<h1>${this.result.name}</h1><br><h2>Name: ${this.result.studentName}</h2><br><h2>Date: ${CommonUtils.getCurrentDate()}</h2>`;
    each(this.result.parts, (part) => {
      htmlString =
        htmlString + part.content + '<br>' + part.answer + '<hr><br>';
    });

    asBlob(htmlString).then((data: any) => {
      saveAs(
        data,
        `${this.result.name}_${this.result.studentName}_${CommonUtils.getCurrentDate()}`,
      );
    });
  }

  onWritingChange(value: string) {
    this.data.wordCount = value.trim().split(/\s+/).length;
  }

  onAddPart() {
    const id = CommonUtils.generateRandomId();
    const newWritingParagraph: Writing = {
      id: id,
      content: '',
      timeout: undefined,
      questions: [],
      answer: '',
      wordCount: 0,
      testDate: '',
    };
    this.data.parts?.push(newWritingParagraph);
  }

  onSavePart(index: number) {
    this.mapSavedPart[index] = true;
  }

  onEditClick(index: number) {
    this.mapSavedPart[index] = false;
  }

  remove(index: number) {
    this.data.parts!.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.onCtrlSave();
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
