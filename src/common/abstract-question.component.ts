import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FileService } from '../app/file.service';
import { AngularEditorConfig, UploadResponse } from '@wfpena/angular-wysiwyg';
import { map } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Question } from '../common/models/question.model';
import { CommonUtils } from '../utils/common-utils';

@Component({
  template: '',
})
export abstract class AbstractQuestionComponent implements OnInit {
  @Input() question!: Question;
  @Input() isEditting: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() isTesting: boolean = false;
  @Input() isExpand: boolean = true;

  @Output() onEdit = new EventEmitter();

  constructor(private fileService: FileService) {}

  config: AngularEditorConfig = {
    editable: true,
    uploadUrl: 'http://localhost:3000/file',
    upload: (file) => {
      return this.fileService.uploadAudioFile(file).pipe(
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

  addChoice() {
    this.question.choices.push({
      id: CommonUtils.generateRandomId(),
      content: '',
      index: '',
    });
    console.log(this.question)
  }

  removeChoice(index: number) {
    this.question.choices.splice(index, 1);
  }
}
