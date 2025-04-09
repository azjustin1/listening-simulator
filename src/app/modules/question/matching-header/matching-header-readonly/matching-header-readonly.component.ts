import { Component } from '@angular/core';
import { AbstractQuizSectionComponent } from '../../../../shared/abstract/abstract-quiz-section.component';
import { Reading } from '../../../../shared/models/reading.model';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatCard } from '@angular/material/card';
import { ChoiceContentPipe } from '../choice-content.pipe';
import { TextSelectionDirective } from '../../../../tabs/reading/text-selection.directive';
import { SectionType } from '../../../../shared/enums/section-type.enum';

@Component({
  selector: 'app-matching-header-readonly',
  standalone: true,
  imports: [
    AngularEditorModule,
    FormsModule,
    MatCard,
    NgClass,
    ChoiceContentPipe,
    TextSelectionDirective,
  ],
  templateUrl: './matching-header-readonly.component.html',
  styleUrl: './matching-header-readonly.component.scss',
})
export class MatchingHeaderReadonlyComponent extends AbstractQuizSectionComponent<Reading> {
  getSectionType(): SectionType {
    return SectionType.Reading;
  }
}
