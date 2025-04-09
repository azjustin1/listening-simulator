import {
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, mapValues, size, some } from 'lodash-es';
import { Observable, Subscription } from 'rxjs';
import { Quiz } from '../../../shared/models/quiz.model';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { FileService } from '../../../file.service';
import { ListeningComponent } from '../../../tabs/listening/listening.component';
import { PartNavigationComponent } from '../../../shared/components/part-navigation/part-navigation.component';
import { ReadingComponent } from '../../../tabs/reading/reading.component';
import { WritingComponent } from '../../../tabs/writing/writing.component';
import { QuizService } from '../quizzes.service';
import { Part } from '../../../shared/models/part.model';
import { SectionType } from '../../../shared/enums/section-type.enum';
import { QuestionService } from '../../question/question.service';
import { PartService } from '../../../shared/services/part.service';
import { SectionService } from '../../../shared/services/section.service';
import { Listening } from '../../../shared/models/listening.model';

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
    ReactiveFormsModule,
  ],
  providers: [
    QuizService,
    SectionService,
    PartService,
    QuestionService,
    FileService,
  ],
  templateUrl: './add-or-edit-quiz.component.html',
  styleUrl: './add-or-edit-quiz.component.scss',
})
export class AddOrEditQuizComponent implements OnInit, OnDestroy {
  quiz!: Quiz;
  quizForm!: FormGroup;
  mapSavedSection = signal<Record<string, boolean>>({});
  isUnsavedSection = computed(() =>
    some(this.mapSavedSection(), (isSaved) => !isSaved),
  );
  isValidSection = signal(false);
  selectedListeningPart = 0;
  selectedReadingPart = 0;
  selectedWritingPart = 0;
  subscriptions: Subscription = new Subscription();
  selectedTab: number = 0;
  sectionType = SectionType;
  quizService = inject(QuizService);
  partService = inject(PartService);
  sectionService = inject(SectionService);
  fb = inject(FormBuilder);

  @HostListener('document:keydown.control.s', ['$event'])
  onKeydownHandler() {
    this.saveOrEditQuiz(this.quiz);
  }

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected dialog: MatDialog,
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const quizId = paramMap.get('quizId');
      if (quizId) {
        this.subscriptions.add(
          this.quizService.getById(quizId).subscribe((quiz: any) => {
            this.quiz = quiz;
            this.generateSavedSection();
            this.quizForm = this.fb.group({
              name: [this.quiz.name, Validators.required],
            });
            this.quizForm.valueChanges.subscribe((value) => {
              this.quiz.name = value.name;
            });
          }),
        );
      }
    });
  }

  ngOnInit() {}

  generateSavedSection() {
    const savedSection: Record<string, boolean> = {};
    savedSection[this.quiz.listening._id!] = true;
    savedSection[this.quiz.reading._id!] = true;
    savedSection[this.quiz.writing._id!] = true;
    this.mapSavedSection.set(savedSection);
  }

  addPart(sectionType: SectionType) {
    switch (sectionType) {
      case SectionType.Listening:
        const listeningPart: Part = {
          questions: [],
          sectionId: this.quiz.listening._id!,
        };
        this.subscriptions.add(
          this.partService.createPart(listeningPart).subscribe((savedPart) => {
            this.quiz.listening?.parts.push(savedPart);
            this.selectedListeningPart = size(this.quiz.listening.parts) - 1;
          }),
        );
        break;
      case SectionType.Reading:
        const readingPart: Part = {
          questions: [],
          sectionId: this.quiz.reading._id!,
        };
        this.subscriptions.add(
          this.partService.createPart(readingPart).subscribe((savedPart) => {
            this.quiz.reading?.parts.push(savedPart);
            this.selectedReadingPart = size(this.quiz.listening.parts) - 1;
          }),
        );
        break;
      case SectionType.Writing:
        const writingPart: Part = {
          questions: [],
          sectionId: this.quiz.writing._id!,
        };
        this.subscriptions.add(
          this.partService.createPart(writingPart).subscribe((savedPart) => {
            this.quiz.writing?.parts.push(savedPart);
            this.selectedWritingPart = size(this.quiz.listening.parts) - 1;
          }),
        );
        break;
      default:
        break;
    }
  }

  onTabChange(sectionType: SectionType, index: number) {
    console.log(index);
  }

  saveSection(sectionType: SectionType) {
    switch (sectionType) {
      case SectionType.Listening:
        console.log(this.quiz.listening);
        this.subscriptions.add(
          this.sectionService
            .updateSection(this.quiz.listening)
            .subscribe((savedSection) => {
              this.quiz.listening = {
                ...this.quiz.listening,
                ...savedSection,
              };
              this.mapSavedSection.update((current) => ({
                ...current,
                [savedSection._id!]: true,
              }));
            }),
        );
        break;
      case SectionType.Reading:
        this.subscriptions.add(
          this.sectionService
            .updateSection(this.quiz.reading)
            .subscribe((savedSection) => {
              this.quiz.reading = {
                ...this.quiz.listening,
                ...savedSection,
              };
              this.mapSavedSection()[savedSection._id!] = true;
            }),
        );
        break;
      case SectionType.Writing:
        this.subscriptions.add(
          this.sectionService
            .updateSection(this.quiz.writing)
            .subscribe((savedSection) => {
              this.mapSavedSection()[savedSection._id!] = true;
              this.quiz.writing = {
                ...this.quiz.listening,
                ...savedSection,
              };
            }),
        );
        break;
      default:
        break;
    }
  }

  editSection(id: string) {
    if (this.mapSavedSection()[id] !== undefined) {
      this.saveAllEditingPart();
    }
    this.mapSavedSection()[id] = false;
  }

  saveAllEditingPart() {
    this.mapSavedSection.set({
      ...mapValues(this.mapSavedSection(), () => true),
    });
  }

  removePart(partId: string, sectionType: SectionType) {
    // this.currentQuiz.listening?.parts.splice(index, 1);
    this.partService.deletePart(partId).subscribe((isDeleted) => {
      if (isDeleted) {
        switch (sectionType) {
          case SectionType.Listening:
            this.quiz.listening.parts = filter(
              this.quiz.listening.parts,
              (part) => part._id !== partId,
            );
            break;
          case SectionType.Writing:
            break;
          case SectionType.Reading:
            break;
          default:
            break;
        }
      }
    });
  }

  removeReadingPart(index: number) {
    this.quiz.reading?.parts.splice(index, 1);
  }

  removeWritingPart(index: number) {
    this.quiz.writing?.parts.splice(index, 1);
  }

  onSaveClick() {
    if (this.quiz.name == '') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        hasBackdrop: true,
      });
      dialogRef.componentInstance.title = 'Warning';
      dialogRef.componentInstance.message = 'You are missing some fields?';
      dialogRef.componentInstance.isWarning = true;
    } else {
      this.saveOrEditQuiz(this.quiz);
      this.router.navigate(['/mock-test']).then(() => {});
    }
  }

  listeningSectionChange(listening: Listening) {
    this.quiz.listening = Object.assign(this.quiz.listening, listening);
    console.log(this.quiz.listening);
  }

  saveOrEditQuiz(quiz: Quiz) {
    let observer: Observable<Quiz>;
    if (quiz._id) {
      observer = this.quizService.edit(quiz);
    } else {
      observer = this.quizService.create(quiz);
    }
    const sub = observer.subscribe();
    sub.unsubscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onChangeTab($event: MatTabChangeEvent) {
    this.selectedTab = $event.index;
  }
}
