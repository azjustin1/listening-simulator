import { HttpResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { AngularEditorConfig, UploadResponse } from '@wfpena/angular-wysiwyg';
import {
  clone,
  cloneDeep,
  debounce,
  each,
  isEmpty,
  isNull,
  mapValues,
  some,
} from 'lodash-es';
import { map, Subscription } from 'rxjs';
import { FileService } from '../../file.service';
import { environment } from '../../../environments/environment';
import { CommonUtils } from '../../utils/common-utils';
import { BASE64_IMAGE_REGEX } from '../../utils/constant';
import { QuestionType } from '../enums/question-type.enum';
import { AbstractSection } from '../models/abstract-section.model';
import { Question } from '../models/question.model';
import { ExtractIdPipe } from '../../pipes/extract-id.pipe';
import { IsInputPipe } from '../../modules/question/fill-in-the-gap/is-input.pipe';
import { QuizService } from '../../modules/quizzes/quizzes.service';
import { SectionType } from '../enums/section-type.enum';
import { Choice } from '../models/choice.model';
import { QuestionService } from '../../modules/question/question.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { OutputBlockData } from '@editorjs/editorjs';

@Component({
  template: '',
})
export abstract class AbstractQuizSectionComponent<T extends AbstractSection>
  implements OnInit, OnChanges, OnDestroy
{
  @Input() section!: T;
  @Input() selectedPart = 0;
  @Input() isTesting: boolean = false;
  @Input() isEditing: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() isSaved: boolean = false;
  @Input() isStart: boolean = false;
  @Output() onStartChange = new EventEmitter();
  @Output() onTimeout = new EventEmitter();
  @Output() onSave = new EventEmitter();
  @Output() dataChange = new EventEmitter();
  @Output() validateChange = new EventEmitter<boolean>();
  @Output() onAddQuestion = new EventEmitter();
  @Output() onPartAnswerQuestion = new EventEmitter();
  @Output() onPartAnswerChoice = new EventEmitter();
  selectedId = model('');
  selectedQuestionIndex = model();
  isValidSection = signal(true);

  abstract getSectionType(): SectionType;

  fb = inject(FormBuilder);
  quizService = inject(QuizService);
  questionService = inject(QuestionService);
  sectionForm!: FormGroup;
  sectionType = SectionType;
  questionType = QuestionType;
  currentQuestion!: Question;
  mapSavedQuestionsByIndex: Record<number, boolean> = {};
  subscriptions: Subscription = new Subscription();
  onPaste = debounce((event) => this.uploadQuestionBase64Images(event), 1000);
  isQuestionInvalid = signal(false);
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
          const imageUrl = `${environment.api}/api/file/upload/${response.fileName}`;
          return {
            ...response,
            body: { imageUrl: imageUrl },
          } as HttpResponse<UploadResponse>;
        }),
      );
    },
  };
  wordCount: number = 0;
  fileService = inject(FileService);

  ngOnInit() {
    this.sectionForm = this.fb.group({
      timeout: [
        this.section.timeout ?? 0,
        [Validators.required, this.notAllowed(/^0/)],
      ],
    });
    this.sectionForm.valueChanges.subscribe((value) => {
      this.dataChange.emit(value);
    });
    this.sectionForm.statusChanges.subscribe((status) => {
      const dirtyForm = some(
        this.sectionForm.controls,
        (control) => control.dirty,
      );
      const invalidForm = dirtyForm && status === 'INVALID';
      if (this.getSectionType() === SectionType.Listening) {
        const notUploadAudioFile = isEmpty(this.section['audioName']);
        this.validateChange.emit(invalidForm && notUploadAudioFile);
      } else {
        this.validateChange.emit(invalidForm);
      }
    });
    if (this.isEditing) {
      this.generateMapSavedQuestion();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSaved']?.currentValue) {
      mapValues(this.mapSavedQuestionsByIndex, () => false);
      console.log(this.mapSavedQuestionsByIndex);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  notAllowed(input: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = input.test(control.value);
      return forbidden ? { notAllowed: { value: control.value } } : null;
    };
  }

  generateMapSavedQuestion(): void {
    this.section.parts[this.selectedPart].questions.forEach(
      (_question: Question, index) => {
        this.mapSavedQuestionsByIndex[index] = true;
      },
    );
  }

  onWritingChange(value: string) {
    // this.data!.wordCount = value.trim().split(/\s+/).length;
  }

  defaultChoices(numberOfChoices: number) {
    const choices: Choice[] = [];
    for (let i = 0; i < numberOfChoices; i++) {
      const choice: Choice = {
        content: '',
      };
      choices.push(choice);
    }
    return choices;
  }

  addQuestion(questionType: QuestionType) {
    switch (questionType) {
      case QuestionType.MULTIPLE_CHOICE:
        this.currentQuestion = {
          description: '',
          type: questionType,
          choices: [],
          answer: [],
          correctAnswer: [],
          numberOfChoices: 1,
        };
        break;
      case QuestionType.SHORT_ANSWER:
        this.currentQuestion = {
          description: '',
          type: questionType,
          choices: [],
          answer: [],
          correctAnswer: [],
        };
        break;
      case QuestionType.MULTIPLE_QUESTIONS:
        this.currentQuestion = {
          description: '',
          type: questionType,
          choices: this.defaultChoices(4),
          answer: [],
          correctAnswer: [],
          subQuestions: [],
        };
        break;
      case QuestionType.DROPDOWN_ANSWER:
        this.currentQuestion = {
          description: '',
          type: questionType,
          choices: this.defaultChoices(3),
          answer: [],
          correctAnswer: [],
          numberOfChoices: 1,
        };
        break;
      case QuestionType.LABEL_ON_MAP:
        this.currentQuestion = {
          description: '',
          type: questionType,
          choices: this.defaultChoices(4),
          answer: [],
          correctAnswer: [],
          subQuestions: [],
        };
        break;
      case QuestionType.FILL_IN_THE_GAP:
      case QuestionType.MATCHING_HEADER:
      case QuestionType.DRAG_AND_DROP_ANSWER:
        this.currentQuestion = {
          description: '',
          arrayContent: [],
          type: questionType,
          choices: [],
          answer: [],
          correctAnswer: [],
          subQuestions: [],
        };
        break;
      case QuestionType.FILL_IN_TABLE:
      case QuestionType.DRAG_IN_TABLE:
        this.currentQuestion = {
          description: '',
          name: 'Table title',
          tableContent: {
            tr0: {
              td0: [['Text']],
              td1: [['Text']],
            },
            tr1: {
              td0: [['Text']],
              td1: [['Text']],
            },
            tr2: {
              td0: [['Text']],
              td1: [['Text']],
            },
          },
          type: questionType,
          choices: [],
          answer: [],
          correctAnswer: [],
          subQuestions: [],
        };
        break;
      default:
        break;
    }
    switch (this.selectedPart) {
      case 0:
      default:
        break;
    }
    this.quizService
      .addNewQuestion({
        ...this.currentQuestion,
        partId: this.section.parts[this.selectedPart]._id!,
      })
      .subscribe((newQuestion) => {
        this.currentQuestion = newQuestion;
        this.section?.parts[this.selectedPart].questions.push({
          ...this.currentQuestion,
        });
        this.onAddQuestion.emit(this.currentQuestion);
      });
  }

  saveQuestion(index: number) {
    const question = this.section.parts[this.selectedPart].questions[index];
    if (question) {
      const questionDescription = JSON.parse(
        question.description!,
      ) as OutputBlockData[];
      if (questionDescription) {
        this.subscriptions.add(
          this.questionService.updateQuestion(question).subscribe(() => {
            this.mapSavedQuestionsByIndex[index] = true;
          }),
        );
      }
    }
  }

  extractAllInputFromContent(question: Question) {
    if (question.description && !isEmpty(question.description)) {
      const answers = question.description.match(/{\s*[^>]*}/g);
      if (answers) {
        const newChoices: Choice[] = [];
        answers.forEach((answer) => {
          const newChoice: Choice = {
            content: answer.replace(/{|}/g, ''),
          };
          newChoices.push(newChoice);
        });
        question.choices = [...newChoices];
        this.questionService
          .updateQuestion(question)
          .subscribe((newQuestion) => {
            this.onSave.emit(newQuestion);
          });
      }
    }
  }

  convertToInputTag(content: string, answer: string[]) {}

  onEditQuestion(index: number) {
    // this.saveOthersEditting();
    this.mapSavedQuestionsByIndex[index] = false;
  }

  moveQuestionUp(index: number) {
    // const tempQuestion = clone(this.data.questions[index - 1]);
    // this.data.questions[index - 1] = this.data.questions[index];
    // this.data.questions[index] = tempQuestion;
    this.onSave.emit();
  }

  moveQuestionDown(index: number) {
    // const tempQuestion = clone(this.data.questions[index + 1]);
    // this.data.questions[index + 1] = this.data.questions[index];
    // this.data.questions[index] = tempQuestion;
    this.onSave.emit();
  }

  duplicateQuestion(question: Question) {
    let cloneQuestion = cloneDeep(question);
    cloneQuestion = {
      ...cloneQuestion,
      description: `Copy of ${cloneQuestion.description}`,
    };
    this.changeChoiceId(cloneQuestion);
    // this.data.questions.push(cloneQuestion);
    this.onSave.emit();
  }

  private changeChoiceId(question: Question) {
    const correctAnswers = clone(question.correctAnswer);
    question.correctAnswer = [];
    if (question.correctAnswer) {
      if (question.type === QuestionType.LABEL_ON_MAP) {
        each(question.subQuestions, (subQuestion) => {
          const newId = CommonUtils.generateRandomId();
          if (correctAnswers.includes(subQuestion._id!)) {
            subQuestion.correctAnswer.push(subQuestion._id!);
          }
          subQuestion._id = newId;
        });
      }
      each(question.choices, (choice) => {
        const newChoiceId = CommonUtils.generateRandomId();
        if (correctAnswers.includes(choice._id!)) {
          question.correctAnswer.push(newChoiceId);
        }
        if (
          question.type === QuestionType.FILL_IN_THE_GAP ||
          question.type === QuestionType.DRAG_AND_DROP_ANSWER
        ) {
          this.changeIdLineFillInTheGap(question, choice._id!, newChoiceId);
        }
        if (
          question.type === QuestionType.DRAG_IN_TABLE ||
          question.type === QuestionType.FILL_IN_TABLE
        ) {
          this.changeIdInLine(question, choice._id!, newChoiceId);
        }
        choice._id = newChoiceId;
      });
    }
  }

  private changeIdInLine(
    question: Question,
    oldChoiceId: string,
    newChoiceId: string,
  ) {
    if (question.tableContent) {
      each(question.tableContent, (row) => {
        each(row, (column) => {
          each(column, (line) => {
            for (let i = 0; i < line.length; i++) {
              if (
                IsInputPipe.prototype.transform(line[i]) &&
                ExtractIdPipe.prototype.transform(line[i]) === oldChoiceId
              ) {
                line[i] = `<${newChoiceId}>`;
              }
            }
          });
        });
      });
    }
  }

  private changeIdLineFillInTheGap(
    question: Question,
    oldChoiceId: string,
    newChoiceId: string,
  ) {
    if (question.arrayContent) {
      for (
        let lineIndex = 0;
        lineIndex < question.arrayContent.length;
        lineIndex++
      ) {
        for (
          let textIndex = 0;
          textIndex < question.arrayContent[lineIndex].length;
          textIndex++
        ) {
          if (
            IsInputPipe.prototype.transform(
              question.arrayContent[lineIndex][textIndex],
            ) &&
            oldChoiceId ===
              ExtractIdPipe.prototype.transform(
                question.arrayContent[lineIndex][textIndex],
              )
          ) {
            question.arrayContent[lineIndex][textIndex] = `<${newChoiceId}>`;
          }
        }
      }
    }
  }

  deleteQuestion(questionId: string) {
    this.subscriptions.add(
      this.questionService.deleteQuestion(questionId).subscribe((isDeleted) => {
        if (isDeleted) {
          switch (this.getSectionType()) {
            case SectionType.Listening:
              this.section.parts[this.selectedPart].questions =
                this.section.parts[this.selectedPart].questions.filter(
                  (question) => question._id !== questionId,
                );
              break;
          }
        }
      }),
    );
  }

  saveOthersEditting() {
    this.mapSavedQuestionsByIndex = {
      ...mapValues(this.mapSavedQuestionsByIndex, () => true),
    };
  }

  extractBase64Image(content: string) {
    return BASE64_IMAGE_REGEX.exec(content);
  }

  uploadQuestionBase64Images(content: string) {
    const base64Image = this.extractBase64Image(content);
    if (!isNull(base64Image) && base64Image[1].startsWith('data')) {
      const imageSrc = base64Image[1];
      const fileName = `${this.section!._id}_${new Date().getMilliseconds()}.png`;
      const imageFile: File = CommonUtils.base64ToFile(imageSrc, fileName);
      this.fileService.uploadFile(imageFile).subscribe((response) => {
        this.section!.content = this.section!.content?.replace(
          `"${imageSrc}"`,
          `"${environment.api}/upload/${response.fileName}" width="100%"`,
        );
      });
    }
  }

  onSaveClick(question: Question) {
    console.log(question);
  }
}
