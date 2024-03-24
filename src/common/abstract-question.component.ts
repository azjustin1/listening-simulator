import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularEditorConfig, UploadResponse } from '@wfpena/angular-wysiwyg';
import { map } from 'rxjs';
import { FileService } from '../app/file.service';
import { Question } from '../common/models/question.model';
import { CommonUtils } from '../utils/common-utils';
import { debounce } from 'lodash-es';

@Component({
  template: '',
})
export abstract class AbstractQuestionComponent implements OnInit {
  @Input() question!: Question;
  @Input() isSaved: boolean = false;
  @Input() isEditting: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() isTesting: boolean = false;
  @Input() isExpand: boolean = true;

  @Output() onSave = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onRemove = new EventEmitter();

  onPaste = debounce((event) => this.uploadQuestionBase64Images(event), 1000);

  constructor(private fileService: FileService) {}

  config: AngularEditorConfig = {
    editable: true,
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
          const imageName = response.fileName;
          this.question.imageName = imageName;
          this.getImage(imageName);
          return {
            ...response,
            body: { imageUrl: imageName },
          } as HttpResponse<UploadResponse>;
        }),
      );
    },
  };

  ngOnInit(): void {
    if (this.question.imageName) {
      this.getImage(this.question.imageName);
    }
  }

  getImage(fileName: string) {
    this.fileService.getFile(fileName).subscribe((audioFile: Blob) => {
      const fileURL = URL.createObjectURL(audioFile);
      const regex = /<img[^>]+src="([^">]+)"/g;
      const match = regex.exec(this.question.content!);
      if (match) {
        this.question.content = this.question.content!.replace(
          match[1],
          fileURL,
        );
      }
    });
  }

  onSaveQuestion() {
    this.onSave.emit();
  }
  onEditQuestion() {
    this.onEdit.emit();
  }
  removeQuestion() {
    this.onRemove.emit();
  }

  addChoice() {
    this.question.choices.push({
      id: CommonUtils.generateRandomId(),
      content: '',
      index: '',
    });
  }

  removeChoice(index: number) {
    this.question.choices.splice(index, 1);
  }

  extractBase64Image(content: string) {
    const regex = /<img[^>]+src="([^">]+)"/g;
    const match = regex.exec(content);
    return match;
  }

  updateQuestionContent(question: any, originalSrc: string, newSrc: string) {
    return question.content.replace(originalSrc, newSrc);
  }

  uploadQuestionBase64Images(content: string) {
    const base64Image = this.extractBase64Image(content);
    if (base64Image !== null) {
      const imageSrc = base64Image[1];
      const fileName = `${this.question.id}.png`;
      const imageFile: File = CommonUtils.base64ToFile(imageSrc, fileName);
      this.fileService.uploadFile(imageFile).subscribe((response) => {
        const imageName = response.fileName;
        this.question.imageName = imageName;
        this.getImage(imageName);
      });
    }
  }
}
