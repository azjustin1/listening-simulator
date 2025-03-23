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
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SectionType } from '../../shared/enums/section-type.enum';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';
import { isEmpty } from 'lodash-es';
import { environment } from '../../../environments/environment';

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
    SanitizeHtmlPipe,
    ReactiveFormsModule,
  ],
  providers: [ListeningService, FileService],
  templateUrl: './listening.component.html',
  styleUrl: './listening.component.scss',
})
export class ListeningComponent extends AbstractQuizSectionComponent<Listening> {
  selectedFile!: File;

  override getSectionType(): SectionType {
    return SectionType.Listening;
  }

  onFileSelected(event: any) {
    if (!isEmpty(this.section.audioName)) {
      this.deleteFile(this.section.audioName!);
    }
    this.selectedFile = event.target.files[0] ?? null;
    this.uploadFile();
  }

  deleteFile(fileName: string) {
    const deleteSub = this.fileService.deleteFile(fileName).subscribe();
    this.subscriptions.add(deleteSub);
  }

  uploadFile() {
    const uploadSub = this.fileService
      .uploadFile(this.selectedFile)
      .subscribe((res) => {
        this.subscriptions.add(uploadSub);
        if (res) {
          this.section.audioName = res.fileName;
          this.section.audioUrl = `${environment.api}/upload/${res.fileName}`;
        }
      });
    this.subscriptions.add(uploadSub);
  }
}
