import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { AbstractQuizSectionComponent } from '../../shared/abstract/abstract-quiz-section.component';
import { Choice } from '../../shared/models/choice.model';
import { Reading } from '../../shared/models/reading.model';
import { ReadingService } from './reading.service';
import { Question } from '../../shared/models/question.model';
import { SectionType } from '../../shared/enums/section-type.enum';

@Component({
  selector: 'app-reading',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatExpansionModule,
    AngularEditorModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  providers: [ReadingService],
  templateUrl: './reading.component.html',
  styleUrl: './reading.component.scss',
})
export class ReadingComponent
  extends AbstractQuizSectionComponent<Reading>
  implements OnInit
{
  @Input() isMatchingHeader = false;
  @Output() onMatchHeaderAnswer = new EventEmitter();
  mapSavedQuestion: Record<string, boolean> = {};
  answers: WritableSignal<Choice[]> = signal([]);

  override getSectionType(): SectionType {
    return SectionType.Reading;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.section) {
      // each(this.data.reading, (question) => {
      //   this.mapSavedQuestion[question.id] = true;
      // });
    }
  }

  override ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (changes['data'] && this.section) {
      this.answers.set(this.section.answers!);
    }
  }

  override saveQuestion(question: Question): void {
    super.saveQuestion(question);
    this.mapSavedQuestion[question._id!] = true;
  }

  override onEditQuestion(question: Question): void {
    super.onEditQuestion(question);
    this.mapSavedQuestion[question._id!] = false;
  }
}
