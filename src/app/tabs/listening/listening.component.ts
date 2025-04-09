import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { SectionType } from '../../shared/enums/section-type.enum';
import { isEmpty } from 'lodash-es';

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
    ReactiveFormsModule,
  ],
  providers: [ListeningService, FileService],
  templateUrl: './listening.component.html',
  styleUrl: './listening.component.scss',
})
export class ListeningComponent extends AbstractQuizSectionComponent<Listening> {
  selectedFile!: File;

  override ngOnInit() {
    super.ngOnInit();
    if (isEmpty(this.section.audioName) || isEmpty(this.section.audioUrl)) {
      this.sectionForm.updateValueAndValidity();
    }
  }

  override getSectionType(): SectionType {
    return SectionType.Listening;
  }

  onFileSelected(event: any) {
    if (!isEmpty(this.section.audioName)) {
      // this.deleteFile(this.section.audioName!);
    }
    this.selectedFile = event.target.files[0] ?? null;
    this.uploadFile();
  }

  deleteFile() {
    this.subscriptions.add(
      this.quizService
        .removeAudioFile(this.section._id!)
        .subscribe((isDeleted) => {
          if (isDeleted) {
            this.section = {
              ...this.section,
              audioName: '',
              audioUrl: '',
            };
            this.isValidSection.set(false);
          }
        }),
    );
  }

  uploadFile() {
    this.subscriptions.add(
      this.quizService
        .uploadAudioFile(this.section._id!, this.selectedFile)
        .subscribe((res) => {
          if (res) {
            this.section.audioName = res.file.fileName;
            this.section.audioUrl = res.file.fileUrl;
          }
          this.sectionForm.updateValueAndValidity();
        }),
    );
  }
}
