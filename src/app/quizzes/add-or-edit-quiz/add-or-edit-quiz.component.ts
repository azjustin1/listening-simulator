import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Listening } from '../../../common/models/listening.model';
import { Quiz } from '../../../common/models/quiz.model';
import { CommonUtils } from '../../../utils/common-utils';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { FileService } from '../../file.service';
import { ListeningComponent } from '../../listening/listening.component';
import { QuizService } from '../quizzes.service';
import { MatTabsModule } from '@angular/material/tabs';
import { ReadingComponent } from '../../reading/reading.component';
import { Reading } from '../../../common/models/reading.model';
import { each } from 'lodash-es';
import { Question } from '../../../common/models/question.model';

@Component({
  selector: 'app-add-or-edit-quiz',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    ListeningComponent,
    ReadingComponent,
  ],
  providers: [QuizService, FileService],
  templateUrl: './add-or-edit-quiz.component.html',
  styleUrl: './add-or-edit-quiz.component.css',
})
export class AddOrEditQuizComponent implements OnDestroy {
  currentQuiz: Quiz = {
    id: '',
    name: '',
    timeout: null,
    listeningParts: [],
    readingParts: [],
  };

  mapSavedPart: Record<string, boolean> = {};

  subscription: Subscription[] = [];

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const quizId = paramMap.get('quizId');
      if (quizId) {
        const sub = this.quizService.getById(quizId).subscribe((quiz: any) => {
          this.currentQuiz = quiz;
          console
          .log(this.currentQuiz)
          this.generateListeningEdittingPartMap(
            this.currentQuiz.listeningParts,
          );
          this.generateReadingEdittingPartMap(this.currentQuiz.readingParts);
        });
        this.subscription.push(sub);
      }
    });
  }

  generateListeningEdittingPartMap(listeningParts: Listening[]) {
    each(listeningParts, (part) => {
      this.mapSavedPart[part.id!] = true;
    });
  }

  generateReadingEdittingPartMap(readingParts: Reading[]) {
    each(readingParts, (part) => {
      this.mapSavedPart[part.id!] = true;
    });
  }

  onAddListeningPart() {
    const id = CommonUtils.generateRandomId();
    const newListeningPart: Listening = {
      id: CommonUtils.generateRandomId(),
      name: id,
      questions: [],
      audioName: '',
    };
    this.mapSavedPart[id] = false;
    this.currentQuiz.listeningParts.push(newListeningPart);
  }

  onAddReadingParagraph() {
    const newReadingParagraph: Reading = {
      id: CommonUtils.generateRandomId(),
      content: '',
      questions: [],
    };
    this.currentQuiz.readingParts.push(newReadingParagraph);
  }

  onSavePart(id: string) {
    if (this.mapSavedPart[id] !== undefined) {
      this.mapSavedPart[id] = true;
    }
  }

  onEditClick(id: string) {
    if (this.mapSavedPart[id] !== undefined) {
      this.saveOthersEditting();
      this.mapSavedPart[id] = false;
    }
  }

  saveOthersEditting() {
    for (const key in this.mapSavedPart) {
      this.mapSavedPart[key] = true;
    }
  }

  removePart(index: number) {
    this.currentQuiz.listeningParts.splice(index, 1);
  }

  removeParagraph(index: number) {
    this.currentQuiz.readingParts.splice(index, 1);
  }

  onSaveClick() {
    if (this.currentQuiz.name == '' || this.currentQuiz.timeout === null) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        hasBackdrop: true,
      });

      dialogRef.componentInstance.title = 'Warning';
      dialogRef.componentInstance.message = 'You are missing some fields?';
      dialogRef.componentInstance.isWarning = true;
    } else {
      this.saveOrEditQuiz(this.currentQuiz);
    }
  }

  saveOrEditQuiz(quiz: any) {
    let observer;
    if (quiz.id) {
      observer = this.quizService.edit(quiz);
    } else {
      quiz.id = CommonUtils.generateRandomId();
      observer = this.quizService.create(quiz);
    }
    const sub = observer.subscribe(() => {
      this.router.navigate(['/']);
    });
    this.subscription.push(sub);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
