import { HttpResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AngularEditorConfig, UploadResponse } from '@wfpena/angular-wysiwyg';
import { debounce, each, isNull } from 'lodash-es';
import { map, Subscription } from 'rxjs';
import { FileService } from '../app/file.service';
import { Question } from './models/question.model';
import { CommonUtils } from '../utils/common-utils';
import { environment } from '../environments/environment';
import { BASE64_IMAGE_REGEX } from '../utils/constant';
import { QuestionService } from '../app/modules/question/question.service';
import { ChoiceService } from '../app/modules/question/choice.service';
import { Choice } from './models/choice.model';

@Component({
  template: '',
})
export abstract class AbstractQuestionComponent
  implements OnChanges, OnDestroy
{
  @Input() question!: Question;
  @Input() isSaved: boolean = false;
  @Input() isEditing: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() isTesting: boolean = false;
  @Input() isExpand: boolean = true;

  @Output() onSave = new EventEmitter();
  @Output() onEdit = new EventEmitter();

  onPaste = debounce((event) => this.uploadQuestionBase64Images(event), 1000);
  subscriptions: Subscription = new Subscription();
  mapEdittingQuestion: Record<string, boolean> = {};

  fileService = inject(FileService);
  questionService = inject(QuestionService);
  choiceService = inject(ChoiceService);

  ngOnInit(): void {
    this.mapEdittingQuestion[this.question._id!] = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSaved']?.currentValue) {
      this.isEditing = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

  defaultChoices(numberOfChoices: number) {
    const choices = [];
    for (let i = 0; i < numberOfChoices; i++) {
      const choice: Choice = {
        content: '',
        order: choices.length,
      };
      choices.push(choice);
    }
    return choices;
  }

  updateEditingQuestion(status: boolean) {
    each(this.question.subQuestions, (question) => {
      this.mapEdittingQuestion[question._id!] = status;
    });
  }

  onSaveQuestion() {
    this.subscriptions.add(
      this.questionService.updateQuestion(this.question).subscribe((resp) => {
        if (resp) {
          this.question = { ...resp };
        }
      }),
    );
  }

  onEditQuestion() {
    this.onEdit.emit();
  }

  addChoice(question: Question) {
    const newChoice: Choice = {
      content: '',
      index: '',
      order: this.question.choices ? this.question.choices.length + 1 : 0,
    };
    this.subscriptions.add(
      this.choiceService.create(question, newChoice).subscribe((resp) => {
        if (resp) {
          this.question.choices = [...this.question.choices, resp];
        }
      }),
    );
  }

  removeChoice(choiceId: string, index: number) {
    this.choiceService.delete(choiceId).subscribe(() => {
      this.question.choices.splice(index, 1);
    });
  }

  extractBase64Image(content: string) {
    return BASE64_IMAGE_REGEX.exec(content);
  }

  uploadQuestionBase64Images(content: string) {
    const base64Image = this.extractBase64Image(content);
    if (!isNull(base64Image) && base64Image[1].startsWith('data')) {
      const imageSrc = base64Image[1];
      const fileName = `${this.question._id!}_${new Date().getMilliseconds()}.png`;
      const imageFile: File = CommonUtils.base64ToFile(imageSrc, fileName);
      this.fileService.uploadFile(imageFile).subscribe((response) => {
        this.question.content = this.question.content?.replace(
          `"${imageSrc}"`,
          response.fileName,
        );
      });
    }
  }

  saveAllQuestion() {
    each(this.question.subQuestions, (question) => {
      this.mapEdittingQuestion[question._id!] = false;
    });
  }
}
