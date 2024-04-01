import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {
  AngularEditorConfig,
  AngularEditorModule,
  UploadResponse,
} from '@wfpena/angular-wysiwyg';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { AbstractQuizPartComponent } from '../../common/abstract-quiz-part.component';
import { Writing } from '../../common/models/writing.model';
import { CommonUtils } from '../../utils/common-utils';
import { WritingService } from './writing.service';
import { FileService } from '../file.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { MatDialog } from '@angular/material/dialog';
import { map, Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { debounce } from 'lodash-es';

@Component({
  selector: 'app-add-edit-writing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MultipleChoicesComponent,
    ShortAnswerComponent,
    MatIconModule,
    MatExpansionModule,
    AngularEditorModule,
    MatSelectModule,
    MatStepperModule,
  ],
  providers: [WritingService, FileService],
  templateUrl: './add-edit-writing.component.html',
  styleUrl: './add-edit-writing.component.css',
})
export class AddEditWritingComponent implements OnDestroy {
  writing: Writing = {
    id: '',
    name: '',
    content: '',
    answer: '',
    timeout: 0,
    imageName: '',
    wordCount: 0,
    questions: [],
  };

  isReadOnly: boolean = false;

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

  onPaste = debounce((event) => this.uploadQuestionBase64Images(event), 1000);

  subscriptions: Subscription[] = [];

  constructor(
    protected writingService: WritingService,
    protected fileService: FileService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const id = paramMap.get('id');
      if (id) {
        const sub = this.writingService.getById(id).subscribe((quiz: any) => {
          this.writing = quiz;
        });
        this.subscriptions.push(sub);
      }
    });
  }

  onSaveClick(writing: Writing) {
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

  extractBase64Image(content: string) {
    const regex = /<img[^>]+src="([^">]+)"/g;
    const match = regex.exec(content);
    return match;
  }

  uploadQuestionBase64Images(content: string) {
    const base64Image = this.extractBase64Image(content);
    if (base64Image !== null && base64Image[1].startsWith('data')) {
      const imageSrc = base64Image[1];
      const fileName = `${this.writing.id}.png`;
      const imageFile: File = CommonUtils.base64ToFile(imageSrc, fileName);
      this.fileService.uploadFile(imageFile).subscribe((response) => {
        const imageName = response.fileName;
        this.writing.imageName = imageName;
        this.writing.content = this.writing.content?.replace(
          imageSrc,
          `http://localhost:3000/upload/${response.fileName}`,
        );
      });
    }
  }

  onWritingChange(value: string) {
    this.writing.wordCount = value.trim().split(/\s+/).length;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
