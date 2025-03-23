import {
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { Question } from '../models/question.model';
import { Choice } from '../models/choice.model';
import { map, Subscription } from 'rxjs';
import { ChoiceService } from '../services/choice.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { debounce, isEmpty, isNull, some, toArray } from 'lodash-es';
import { AngularEditorConfig, UploadResponse } from '@wfpena/angular-wysiwyg';
import { environment } from '../../../environments/environment';
import { HttpResponse } from '@angular/common/http';
import { FileService } from '../../file.service';
import { CommonUtils } from '../../utils/common-utils';
import { BASE64_IMAGE_REGEX, INPUT_PATTERN } from '../../utils/constant';

@Component({
  template: '',
})
export abstract class AbstractEditQuestionComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() question!: Question;
  @Input() isEditing: boolean = false;
  @Output() onSave = new EventEmitter();
  @Output() isInvalid = new EventEmitter<boolean>();
  onPaste = debounce((event) => this.uploadQuestionBase64Images(event), 1000);
  subscriptions: Subscription = new Subscription();
  mapSavedChoiceById = signal<Record<string, boolean>>({});
  isUnsavedChoice = computed(() =>
    some(this.mapSavedChoiceById(), (isSaved) => !isSaved),
  );
  choiceService = inject(ChoiceService);
  fileService = inject(FileService);
  fb = inject(FormBuilder);
  questionForm!: FormGroup;
  config: AngularEditorConfig = {
    editable: true,
    sanitize: false,
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

  get choices() {
    return this.questionForm.controls['choices'] as FormArray;
  }

  ngOnInit(): void {
    this.initMapSavedChoice();
    this.questionForm = this.fb.group({
      description: [this.question.description, Validators.required],
      choices: this.fb.array(this.initChoicesControl(), Validators.required),
    });
    this.subscriptions.add(
      this.questionForm.valueChanges.subscribe((value) => {
        if (value.description) {
          this.question.description = value.description;
        }
      }),
    );
    this.subscriptions.add(
      this.questionForm.statusChanges.subscribe((status) => {
        const dirtyForm = some(
          this.questionForm.controls,
          (control) => control.dirty,
        );
        this.isInvalid.emit(
          this.isUnsavedChoice() || (dirtyForm && status === 'INVALID'),
        );
      }),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSaved']?.currentValue) {
      this.isEditing = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  initMapSavedChoice() {
    if (!isEmpty(this.question.choices)) {
      this.question.choices.forEach((choice) => {
        if (choice._id) {
          this.mapSavedChoiceById.update((current) => ({
            ...current,
            [choice._id!]: true,
          }));
        }
      });
    }
  }

  initChoicesControl() {
    if (this.question && !isEmpty(this.question.choices)) {
      const choiceControls: FormGroup[] = [];
      this.question.choices.forEach((choice) => {
        if (choice._id) {
          this.mapSavedChoiceById.update((current) => ({
            ...current,
            [choice._id!]: true,
          }));
          choiceControls.push(this.generateChoiceControl(choice));
        }
      });
      return choiceControls;
    }
    return [];
  }

  generateChoiceControl(choice: Choice) {
    return this.fb.group({
      _id: [choice._id],
      content: [choice.content, Validators.required],
      isCorrect: [choice.isCorrect ?? false],
    });
  }

  addChoice() {
    const newChoice: Choice = {
      content: '',
      index: '',
      questionId: this.question._id,
    };
    this.subscriptions.add(
      this.choiceService.createChoice(newChoice).subscribe((savedChoice) => {
        this.question.choices.push(savedChoice);
        this.mapSavedChoiceById.update((current) => ({
          ...current,
          [savedChoice._id!]: false,
        }));
      }),
    );
  }

  saveChoice(choiceControl: AbstractControl): void {
    if (choiceControl.touched) {
      this.choiceService
        .updateChoice(choiceControl.value)
        .subscribe((savedChoice) => {
          this.mapSavedChoiceById.update((current) => ({
            ...current,
            [savedChoice._id!]: true,
          }));
          console.log(this.mapSavedChoiceById);
          this.questionForm.updateValueAndValidity();
        });
    } else {
      console.log(choiceControl.value._id);
      this.mapSavedChoiceById.update((current) => ({
        ...current,
        [choiceControl.value._id!]: true,
      }));
      console.log(this.mapSavedChoiceById);
    }
  }

  editChoice(choiceId: string) {
    this.mapSavedChoiceById.update((current) => ({
      ...current,
      [choiceId]: false,
    }));
  }

  deleteChoice(choiceId: string) {
    this.choiceService.deleteChoice(choiceId).subscribe({
      next: () => {
        this.question.choices = this.question.choices.filter(
          (choice) => choice._id !== choiceId,
        );
      },
    });
  }

  private uploadQuestionBase64Images(content: string) {
    const base64Image = this.extractBase64Image(content);
    if (!isNull(base64Image) && base64Image[1].startsWith('data')) {
      const imageSrc = base64Image[1];
      const fileName = `${this.question._id}_${new Date().getMilliseconds()}.png`;
      const imageFile: File = CommonUtils.base64ToFile(imageSrc, fileName);
      this.fileService.uploadFile(imageFile).subscribe((response) => {
        this.question.description = this.question.description?.replace(
          `"${imageSrc}"`,
          `"${environment.api}/upload/${response.fileName}" width="100%"`,
        );
      });
    }
  }

  private extractBase64Image(content: string) {
    return BASE64_IMAGE_REGEX.exec(content);
  }
}
