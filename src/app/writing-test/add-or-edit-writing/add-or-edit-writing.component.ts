import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AngularEditorConfig,
  AngularEditorModule,
  UploadResponse,
} from '@wfpena/angular-wysiwyg';
import { each } from 'lodash-es';
import { interval, map, Subscription } from 'rxjs';
import { Writing } from '../../../common/models/writing.model';
import { CommonUtils } from '../../../utils/common-utils';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { FileService } from '../../file.service';
import { WritingComponent } from '../../writing/writing.component';
import { WritingService } from '../writing-test.service';

@Component({
  selector: 'app-add-or-edit-writing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    MatTabsModule,
    AngularEditorModule,
    WritingComponent,
  ],
  providers: [WritingService, FileService],
  templateUrl: './add-or-edit-writing.component.html',
  styleUrl: './add-or-edit-writing.component.css',
})
export class AddOrEditWritingComponent {
  state: { [key: string]: boolean } = {
    isSaved: false,
    isEditting: false,
    isTesting: false,
    isReadOnly: false,
  };
  writing: Writing = {
    id: '',
    name: '',
    content: '',
    answer: '',
    timeout: 0,
    imageName: '',
    wordCount: 0,
    questions: [],
    parts: [],
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
          const imageUrl = `http://localhost:3000/upload/${response.fileName}`;
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
    if (this.state['isEditting']) {
      this.saveOrEdit(this.writing);
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
        this.writing = result;
        this.result = { ...this.writing };
        this.writing.timeout = this.result.timeout;
        this.onStart();
      });
    }
    this.route.paramMap.subscribe((paramMap: any) => {
      const id = paramMap.get('id');
      if (id) {
        if (this.state['isEditting'] || this.state['isTesting']) {
          const sub = this.writingService
            .getById(id)
            .subscribe((writing: any) => {
              this.writing = writing;
              each(this.writing.parts, (part, index) => {
                this.mapSavedPart[index] = true;
              });
            });
          this.subscriptions.push(sub);
        }
        if (this.state['isReadOnly']) {
          const sub = this.writingService
            .getResultById(id)
            .subscribe((result) => {
              this.writing = result;
            });
          this.subscriptions.push(sub);
        }
      }
    });
  }

  getTimeout() {
    this.totalSeconds = this.writing.timeout! * 60;
    this.minutes = Math.floor(this.totalSeconds / 60);
    this.seconds = this.totalSeconds % 60;
  }

  onStart() {
    if (!this.result) {
      this.result = { ...this.writing, id: CommonUtils.generateRandomId() };
      this.writingService.submit(this.result).subscribe();
    }
    this.isReady = true;
    this.getTimeout();
    const sub = interval(1000).subscribe(() => {
      if (this.seconds === 0) {
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
          this.onSubmit();
        });
      }
    });
    this.subscriptions.push(sub);
  }

  onSaveClick() {
    this.saveOrEdit(this.writing);
    this.router.navigate(['writings']);
  }

  saveOrEdit(writing: Writing) {
    let observer;
    if (writing.id) {
      observer = this.writingService.edit(writing);
    } else {
      writing.id = CommonUtils.generateRandomId();
      observer = this.writingService.create(writing);
    }
    const sub = observer.subscribe();

    this.subscriptions.push(sub);
  }

  onCtrlSave() {
    this.result = {
      ...this.writing,
      timeout: this.seconds / 60 + this.minutes,
    };
    this.writingService.editWritingResult(this.result).subscribe();
  }

  onSubmit() {
    this.result = { ...this.result, isSubmit: true };
    this.onCtrlSave();
    this.router.navigate(['writings']);
  }

  onWritingChange(value: string) {
    this.writing.wordCount = value.trim().split(/\s+/).length;
  }

  onAddPart() {
    const id = CommonUtils.generateRandomId();
    const newWritingParagraph: Writing = {
      id: id,
      content: '',
      timeout: undefined,
      questions: [],
      imageName: '',
      answer: '',
      wordCount: 0,
    };
    this.writing.parts?.push(newWritingParagraph);
  }

  onSavePart(index: number) {
    this.mapSavedPart[index] = true;
  }

  onEditClick(index: number) {
    this.mapSavedPart[index] = false;
  }

  remove(index: number) {
    this.writing.parts!.splice(index, 1);
  }

  ngOnDestroy(): void {
    this.onCtrlSave();
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
