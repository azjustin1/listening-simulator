import { HttpResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  model,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AngularEditorConfig, UploadResponse } from '@wfpena/angular-wysiwyg';
import { debounce, each, isEmpty, isNull, mapValues } from 'lodash-es';
import { map, Subscription } from 'rxjs';
import { FileService } from '../../file.service';
import { Question } from '../models/question.model';
import { CommonUtils } from '../../utils/common-utils';
import { environment } from '../../../environments/environment';
import { BASE64_IMAGE_REGEX } from '../../utils/constant';
import { Choice } from '../models/choice.model';
import { QuestionService } from '../../modules/question/question.service';
import { ChoiceService } from '../services/choice.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  template: '',
})
export abstract class AbstractQuestionComponent implements OnDestroy {
  selectedId = model();
  selectedQuestionIndex = model();
  @Input() question!: Question;
  @Input() isSaved: boolean = false;
  @Input() isEditing: boolean = false;
  @Input() isReadOnly: boolean = false;
  @Input() isTesting: boolean = false;
  @Input() isExpandable: boolean = true;
  @Output() onSave = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onAnswer = new EventEmitter();
  @Output() onAnswerChoice = new EventEmitter();
  @Output() isInvalid = new EventEmitter();
  mapEditingQuestion: Record<string, boolean> = {};
  mapChoiceEditingById: Record<string, boolean> = {};
  fileService = inject(FileService);
  questionService = inject(QuestionService);
  choiceService = inject(ChoiceService);
  fb = inject(FormBuilder);
  subscriptions: Subscription = new Subscription();

  ngOnInit(): void {
    this.mapEditingQuestion[this.question._id!] = false;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  defaultChoices(numberOfChoices: number) {
    const choices = [];
    for (let i = 0; i < numberOfChoices; i++) {
      const choice = {
        id: CommonUtils.generateRandomId(),
        content: '',
      };
      choices.push(choice);
    }
    return choices;
  }

  updateEditingQuestion(status: boolean) {
    each(this.question.subQuestions, (question) => {
      this.mapEditingQuestion[question._id!] = status;
    });
  }

  onSaveQuestion() {
    this.onSave.emit();
  }
}
