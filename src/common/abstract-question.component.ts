import { HttpResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AngularEditorConfig, UploadResponse } from '@wfpena/angular-wysiwyg';
import { debounce, each } from 'lodash-es';
import { map } from 'rxjs';
import { FileService } from '../app/file.service';
import { Question } from '../common/models/question.model';
import { CommonUtils } from '../utils/common-utils';
import { environment } from '../environments/environment';
import { BASE64_IMAGE_REGEX } from '../utils/constant';

@Component({
  template: '',
})
export abstract class AbstractQuestionComponent implements OnChanges {
  @Input() question!: Question;
  @Input() isSaved: boolean = false;
  @Input() isEditting: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() isTesting: boolean = false;
  @Input() isExpand: boolean = true;

  @Output() onSave = new EventEmitter();
  @Output() onEdit = new EventEmitter();

  onPaste = debounce((event) => this.uploadQuestionBase64Images(event), 1000);

  mapEdittingQuestion: Record<string, boolean> = {};

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.mapEdittingQuestion[this.question.id!] = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSaved']?.currentValue) {
      this.isEditting = false;
    }
  }

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
          const imageUrl = `${environment.api}/upload/${response.fileName}`;
          return {
            ...response,
            body: { imageUrl: imageUrl },
          } as HttpResponse<UploadResponse>;
        }),
      );
    },
  };

  defaultChoices(numberOfChocies: number) {
    const choices = [];
    for (let i = 0; i < numberOfChocies; i++) {
      const choice = {
        id: CommonUtils.generateRandomId(),
        content: '',
      };
      choices.push(choice);
    }
    return choices;
  }

  updateEdittingQuestion(status: boolean) {
    each(this.question.subQuestions, (question) => {
      this.mapEdittingQuestion[question.id!] = status;
    });
  }

  onSaveQuestion() {
    this.onSave.emit();
  }
  onEditQuestion() {
    this.onEdit.emit();
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
    const regex = BASE64_IMAGE_REGEX;
    const match = regex.exec(content);
    return match;
  }

  uploadQuestionBase64Images(content: string) {
    const base64Image = this.extractBase64Image(content);
    if (base64Image !== null && base64Image[1].startsWith('data')) {
      const imageSrc = base64Image[1];
      const fileName = `${this.question.id}_${new Date().getMilliseconds()}.png`;
      const imageFile: File = CommonUtils.base64ToFile(imageSrc, fileName);
      this.fileService.uploadFile(imageFile).subscribe((response) => {
        this.question.content = this.question.content?.replace(
          `"${imageSrc}"`,
          `"${environment.api}/upload/${response.fileName}" width="100%"`,
        );
      });
    }
  }
}
