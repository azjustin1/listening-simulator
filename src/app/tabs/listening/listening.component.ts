import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AbstractQuizSectionComponent } from '../../shared/abstract/abstract-quiz-section.component';
import { Listening } from '../../shared/models/listening.model';
import { FileService } from '../../file.service';
import { ListeningService } from './listening.service';
import { AngularEditorModule } from '@wfpena/angular-wysiwyg';
import { NgClass } from '@angular/common';
import { QuestionComponent } from '../../modules/question/question.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AbstractSection } from '../../shared/models/abstract-section.model';
import { SectionType } from '../../shared/enums/section-type.enum';

@Component({
  selector: 'app-listening',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    AngularEditorModule,
    NgClass,
    QuestionComponent,
    FroalaEditorModule,
    FroalaViewModule,
  ],
  providers: [ListeningService, FileService],
  templateUrl: './listening.component.html',
  styleUrl: './listening.component.scss',
})
export class ListeningComponent extends AbstractQuizSectionComponent<Listening> {
  override getSectionType(): SectionType {
    return SectionType.Listening;
  }

  testForm($event: any) {
    console.log($event);
  }
}
