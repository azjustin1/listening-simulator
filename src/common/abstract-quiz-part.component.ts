import { HttpResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularEditorConfig, UploadResponse } from '@wfpena/angular-wysiwyg';
import { clone, cloneDeep, debounce, each, mapValues } from 'lodash-es';
import { map, Subscription } from 'rxjs';
import { FileService } from '../app/file.service';
import { CommonUtils } from '../utils/common-utils';
import { AbstractPart } from './models/abstract-part.model';
import { Question } from './models/question.model';

@Component({
  template: '',
})
export abstract class AbstractQuizPartComponent<T extends AbstractPart>
  implements OnChanges, OnDestroy
{
  @Input() data!: T;
  @Input() isTesting: boolean = false;
  @Input() isEditting: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() isSaved: boolean = false;
  @Input() isStart: boolean = false;
  @Output() onStartChange = new EventEmitter();
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

  onPaste = debounce((event) => this.uploadQuestionBase64Images(event), 1000);

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

  wordCount: number = 0;

  constructor(
    protected fileService: FileService,
    private dialog: MatDialog,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSaved']?.currentValue) {
      mapValues(this.mapQuestionEditting, () => false);
    }
  }

  ngOnDestroy(): void {
    each(this.subscriptions, (sub) => {
      sub.unsubscribe();
    });
  }

  onStart() {
    this.isStart = true;
    this.onStartChange.emit();
  }

  onWritingChange(value: string) {
    this.data.wordCount = value.trim().split(/\s+/).length;
  }

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

  addQuestion(questionType: number) {
    const id = CommonUtils.generateRandomId();
    switch (questionType) {
      case 0:
        this.currentQuestion = {
          id: id,
          content: '',
          type: questionType,
          choices: this.defaultMultipleChoices(),
          answer: '',
          correctAnswer: '',
        };
        break;
      case 1:
        this.currentQuestion = {
          id: id,
          content: '',
          type: questionType,
          choices: [],
          answer: '',
          correctAnswer: '',
        };
        break;
      case 2:
        this.currentQuestion = {
          id: id,
          content: '',
          type: questionType,
          choices: [],
          answer: '',
          correctAnswer: '',
          subQuestions: [],
        };
        break;
      default:
        break;
    }
    this.data.questions.push({ ...this.currentQuestion });
    this.data = { ...this.data };
    this.mapQuestionEditting[id] = true;
  }

  onSaveQuestion(id: string) {
    this.mapQuestionEditting[id] = false;
  }

  onEditQuestion(id: string) {
    this.saveOthersEditting();
    this.mapQuestionEditting[id] = true;
  }

  moveQuestionUp(index: number) {
    const tempQuestion = clone(this.data.questions[index - 1]);
    this.data.questions[index - 1] = this.data.questions[index];
    this.data.questions[index] = tempQuestion;
  }

  moveQuestionDown(index: number) {
    const tempQuestion = clone(this.data.questions[index + 1]);
    this.data.questions[index + 1] = this.data.questions[index];
    this.data.questions[index] = tempQuestion;
  }

  duplicateQuestion(question: Question) {
    let cloneQuestion = cloneDeep(question);
    cloneQuestion = {
      ...cloneQuestion,
      id: CommonUtils.generateRandomId(),
      name: `Copy of ${cloneQuestion.name}`,
    };
    this.data.questions.push(cloneQuestion);
  }

  removeQuestion(questionIdex: number) {
    this.data.questions.splice(questionIdex, 1);
  }

  saveOthersEditting() {
    for (const key in this.mapQuestionEditting) {
      this.mapQuestionEditting[key] = false;
    }
  }

  extractBase64Image(content: string) {
    const regex = /<img[^>]+src="([^">]+)"/g;
    const match = regex.exec(content);
    return match;
  }

  updateQuizContent(newSrc: string) {
    const imageUrl = this.extractBase64Image(this.data.content);
    if (imageUrl !== null) {
      const imageSrc = imageUrl[1];
      this.data.content = this.data.content?.replace(imageSrc, newSrc);
    } else {
      this.data.content = `<img src="${newSrc}" />`;
    }
  }

  uploadQuestionBase64Images(content: string) {
    const base64Image = this.extractBase64Image(content);
    if (base64Image !== null && base64Image[1].startsWith('data')) {
      const imageSrc = base64Image[1];
      const fileName = `${this.data.id}.png`;
      const imageFile: File = CommonUtils.base64ToFile(imageSrc, fileName);
      this.fileService.uploadFile(imageFile).subscribe((response) => {
        const imageName = response.fileName;
        this.data.imageName = imageName;
        this.data.content = this.data.content?.replace(
          imageSrc,
          `http://localhost:3000/upload/${response.fileName}`,
        );
      });
    }
  }
}
