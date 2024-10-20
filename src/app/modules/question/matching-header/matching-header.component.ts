import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgClass } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import {
  each,
  filter,
  isUndefined,
  map,
  mapValues,
  omit,
  sortBy,
} from 'lodash-es';
import { AbstractQuizPartComponent } from '../../../shared/abstract/abstract-quiz-part.component';
import { QuestionType } from '../../../shared/enums/question-type.enum';
import { Choice } from '../../../shared/models/choice.model';
import { Question } from '../../../shared/models/question.model';
import { Reading } from '../../../shared/models/reading.model';
import { CommonUtils } from '../../../utils/common-utils';
import { MultipleQuestionComponent } from '../multiple-question/multiple-question.component';
import { ChoiceContentPipe } from './choice-content.pipe';
import { FillInTheGapEditingComponent } from '../fill-in-the-gap/fill-in-the-gap-editing/fill-in-the-gap-editing.component';
import { FillInTheGapReadonlyComponent } from '../fill-in-the-gap/fill-in-the-gap-readonly/fill-in-the-gap-readonly.component';
import { FillInTheGapTestingComponent } from '../fill-in-the-gap/fill-in-the-gap-testing/fill-in-the-gap-testing.component';
import { MatchingHeaderReadonlyComponent } from './matching-header-readonly/matching-header-readonly.component';
import { MatchingHeaderTestingComponent } from './matching-header-testing/matching-header-testing.component';
import { MatchingHeaderEditingComponent } from './matching-header-editing/matching-header-editing.component';

const DATA_TRANSFER_KEY = 'answerId';
const DROP_OVER_CLASS = 'drop-over';
const CONTAINER_RIGHT_ID = 'container-right';

@Component({
  selector: 'app-matching-header',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    AngularEditorModule,
    MultipleQuestionComponent,
    DragDropModule,
    ChoiceContentPipe,
    MatchingHeaderReadonlyComponent,
    MatchingHeaderTestingComponent,
    MatchingHeaderEditingComponent,
  ],
  templateUrl: './matching-header.component.html',
  styleUrl: './matching-header.component.scss',
})
export class MatchingHeaderComponent extends AbstractQuizPartComponent<Reading> {
  @Input() answers: Choice[] = [];
  results: string[] = [];
}
