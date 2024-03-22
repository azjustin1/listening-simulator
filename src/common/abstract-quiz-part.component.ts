import { HttpResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig, UploadResponse } from '@wfpena/angular-wysiwyg';
import { each } from 'lodash-es';
import { map, Subscription } from 'rxjs';
import { FileService } from '../app/file.service';
import { CommonUtils } from '../utils/common-utils';
import { AbstractPart } from './models/abstract-part.model';
import { Question } from './models/question.model';

@Component({
  template: '',
})
export abstract class AbstractQuizPartComponent<T extends AbstractPart>
  implements OnInit, OnDestroy
{
  @Input() data!: T;
  @Input() isTesting: boolean = false;
  @Input() isEditting: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() isSaved: boolean = false;
  @Output() onTimeout = new EventEmitter();

  currentQuestion: Question = {
    content: '',
    type: null,
    choices: [],
    answer: '',
    correctAnswer: '',
  };
  mapQuestionEditting: Record<string, boolean> = {};
  subscriptions: Subscription[] = [];

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertHorizontalRule',
      ],
    ],
    upload: (file: File) => {
      return this.fileService.uploadAudioFile(file).pipe(
        map((response) => {
          const imageName = response.fileName;
          this.data.imageName = imageName;
          this.getImage(imageName);
          return {
            ...response,
            body: { imageUrl: imageName },
          } as HttpResponse<UploadResponse>;
        }),
      );
    },
  };

  constructor(
    protected fileService: FileService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.data.imageName) {
      this.getImage(this.data.imageName);
    }
  }

  ngOnDestroy(): void {
    each(this.subscriptions, (sub) => {
      sub.unsubscribe();
    });
  }

  getImage(fileName: string) {
    this.fileService.getFile(fileName).subscribe((audioFile: Blob) => {
      const fileURL = URL.createObjectURL(audioFile);
      const regex = /<img[^>]+src="([^">]+)"/g;
      const match = regex.exec(this.data.content);
      if (match) {
        this.data.content = this.data.content.replace(match[1], fileURL);
      }
    });
  }

  onStart() {}

  defaultMultipleChoices() {
    const choices = [];
    for (let i = 0; i < 4; i++) {
      const choice = {
        id: CommonUtils.generateRandomId(),
        content: '',
      };
      choices.push(choice);
    }
    return choices;
  }

  defaultShortAnswerChoices() {
    const choices = [];
    for (let i = 0; i < 4; i++) {
      const choice = {
        id: CommonUtils.generateRandomId(),
        content: '',
        index: '',
      };
      choices.push(choice);
    }
    return choices;
  }

  onSaveQuestion(id: string) {
    this.mapQuestionEditting[id] = false;
  }

  onEditQuestion(id: string) {
    this.saveOthersEditting();
    this.mapQuestionEditting[id] = true;
  }

  saveOthersEditting() {
    for (const key in this.mapQuestionEditting) {
      this.mapQuestionEditting[key] = false;
    }
  }
}
