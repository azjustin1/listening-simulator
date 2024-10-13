import { Component, HostListener, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { each, isEmpty, size } from 'lodash-es';
import { Subscription } from 'rxjs';
import { Listening } from '../../../shared/models/listening.model';
import { Quiz } from '../../../shared/models/quiz.model';
import { Reading } from '../../../shared/models/reading.model';
import { Writing } from '../../../shared/models/writing.model';
import { environment } from '../../../../environments/environment';
import { CommonUtils } from '../../../utils/common-utils';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { FileService } from '../../../file.service';
import { ListeningComponent } from '../../../tabs/listening/listening.component';
import { PartNavigationComponent } from '../../../shared/components/part-navigation/part-navigation.component';
import { ReadingComponent } from '../../../tabs/reading/reading.component';
import { WritingComponent } from '../../../tabs/writing/writing.component';
import { QuizService } from '../quizzes.service';
import { QuestionNavigationComponent } from '../../question/question-navigation/question-navigation.component';
import { Question } from '../../../shared/models/question.model';

@Component({
  selector: 'app-add-or-edit-quiz',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    ListeningComponent,
    ReadingComponent,
    WritingComponent,
    PartNavigationComponent,
    QuestionNavigationComponent,
  ],
  providers: [QuizService, FileService],
  templateUrl: './add-or-edit-quiz.component.html',
  styleUrl: './add-or-edit-quiz.component.scss',
})
export class AddOrEditQuizComponent implements OnDestroy {
  selectedFile!: File;
  currentQuiz: Quiz = {
    id: '',
    name: '',
    listeningParts: [],
    readingParts: [],
    writingParts: [],
  };
  mapSavedPart: Record<string, Record<number, boolean>> = {
    listening: {},
    reading: {},
    writing: {},
  };
  mapQuestionPart: Record<string, number> = {};
  selectedListeningPart = 0;
  selectedReadingPart = 0;
  selectedWritingPart = 0;
  subscriptions: Subscription = new Subscription();

  @HostListener('document:keydown.control.s', ['$event'])
  onKeydownHandler() {
    this.saveOrEditQuiz(this.currentQuiz);
  }

  constructor(
    protected quizService: QuizService,
    protected fileService: FileService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const quizId = paramMap.get('quizId');
      if (quizId) {
        this.subscriptions.add(
          this.quizService.getById(quizId).subscribe((quiz: any) => {
            this.generateListeningEditingPartMap(quiz.listeningParts);
            this.generateReadingEditingPartMap(quiz.readingParts);
            this.generateWritingEditingPartMap(quiz.writingParts);
            this.currentQuiz = quiz;
          }),
        );
      }
    });
  }

  onFileSelected(event: any) {
    if (!isEmpty(this.currentQuiz.audioName)) {
      this.deleteFile(this.currentQuiz.audioName!);
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
          this.currentQuiz.audioName = res.fileName;
          this.currentQuiz.audioUrl = `${environment.api}/upload/${res.fileName}`;
        }
      });
    this.subscriptions.add(uploadSub);
  }

  generateListeningEditingPartMap(listeningParts: Listening[]) {
    if (listeningParts.length === 0) {
      this.mapSavedPart['listening'][0] = true;
    }
    each(listeningParts, (_part, index: number) => {
      this.mapSavedPart['listening'][index] = true;
      each(_part.questions, (question) => {
        this.mapQuestionPart[question.id] = index;
      });
    });
  }

  generateReadingEditingPartMap(readingParts: Reading[]) {
    if (readingParts.length === 0) {
      this.mapSavedPart['reading'][0] = true;
    }
    each(readingParts, (_part, index: number) => {
      this.mapSavedPart['reading'][index] = true;
    });
  }

  generateWritingEditingPartMap(writingParts: Writing[]) {
    if (writingParts.length === 0) {
      this.mapSavedPart['writing'][0] = true;
    }
    each(writingParts, (_part, index: number) => {
      this.mapSavedPart['writing'][index] = true;
    });
  }

  onAddListeningPart() {
    const id = CommonUtils.generateRandomId();
    const newListeningPart: Listening = {
      id: id,
      name: '',
      timeout: undefined,
      content: '',
      questions: [],
      audioName: '',
      wordCount: 0,
      testDate: '',
    };
    this.mapSavedPart['listening'][size(this.mapSavedPart['listening'])] =
      false;
    this.currentQuiz.listeningParts.push(newListeningPart);
    this.selectedListeningPart = this.currentQuiz.listeningParts.length - 1;
  }

  onAddReadingParagraph(isMatchHeader: boolean) {
    const id = CommonUtils.generateRandomId();
    const newReadingParagraph: Reading = {
      name: '',
      id: id,
      content: '',
      timeout: undefined,
      questions: [],
      wordCount: 0,
      isMatchHeader: isMatchHeader,
      answers: [],
      testDate: '',
    };
    this.mapSavedPart['reading'][size(this.mapSavedPart['reading'])] = false;
    this.currentQuiz.readingParts.push(newReadingParagraph);
    this.selectedReadingPart = this.currentQuiz.readingParts.length - 1;
  }

  onAddWritingParagraph() {
    const id = CommonUtils.generateRandomId();
    const newWritingParagraph: Writing = {
      id: id,
      content: '',
      timeout: undefined,
      questions: [],
      answer: '',
      wordCount: 0,
      testDate: '',
    };
    this.mapSavedPart['writing'][size(this.mapSavedPart['writing'])] = false;
    if (!this.currentQuiz.writingParts) {
      this.currentQuiz = { ...this.currentQuiz, writingParts: [] };
    }
    this.currentQuiz.writingParts.push(newWritingParagraph);
    this.selectedWritingPart = this.currentQuiz.writingParts.length - 1;
  }

  onTabChange(key: string, index: number) {
    this.mapSavedPart[key][index] = true;
  }

  onSavePart(key: string, index: number) {
    this.saveOrEditQuiz(this.currentQuiz);
    this.saveAllEditingPart(key);
    if (this.mapSavedPart[key] !== undefined) {
      this.mapSavedPart[key][index] = true;
    }
  }

  onEditClick(key: string, index: number) {
    if (this.mapSavedPart[key] !== undefined) {
      this.saveAllEditingPart(key);
      this.mapSavedPart[key][index] = false;
    }
  }

  saveAllEditingPart(key: string) {
    for (const index in this.mapSavedPart[key]) {
      this.mapSavedPart[key][index] = true;
    }
  }

  removeListeningPart(index: number) {
    this.currentQuiz.listeningParts.splice(index, 1);
  }

  removeReadingPart(index: number) {
    this.currentQuiz.readingParts.splice(index, 1);
  }

  removeWritingPart(index: number) {
    this.currentQuiz.writingParts.splice(index, 1);
  }

  onSaveClick() {
    if (this.currentQuiz.name == '') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        hasBackdrop: true,
      });
      dialogRef.componentInstance.title = 'Warning';
      dialogRef.componentInstance.message = 'You are missing some fields?';
      dialogRef.componentInstance.isWarning = true;
    } else {
      this.saveOrEditQuiz(this.currentQuiz);
      this.router.navigate(['/mock-test']).then(() => {});
    }
  }

  addQuestionMap(question: Question, partIndex: number) {
    this.mapQuestionPart[question.id] = partIndex;
  }

  saveOrEditQuiz(quiz: Quiz) {
    let observer;
    if (quiz.id) {
      observer = this.quizService.edit(quiz);
    } else {
      quiz.id = CommonUtils.generateRandomId();
      observer = this.quizService.create(quiz);
    }
    const sub = observer.subscribe();
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
