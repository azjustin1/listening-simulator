import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep, debounce } from 'lodash-es';
import { Subscription, filter } from 'rxjs';
import { Folder } from '../../common/models/folder.model';
import { Quiz } from '../../common/models/quiz.model';
import { CommonUtils } from '../../utils/common-utils';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { FileService } from '../file.service';
import { FolderComponent } from '../folder/folder.component';
import { FolderService } from '../folder/folder.service';
import { ListeningComponent } from '../listening/listening.component';
import { AddOrEditFolderComponent } from './add-or-edit-folder/add-or-edit-folder.component';
import { MoveToFolderDialogComponent } from './move-to-folder-dialog/move-to-folder-dialog.component';
import { QuizService } from './quizzes.service';

@Component({
  selector: 'app-quizzes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ListeningComponent,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    FolderComponent,
  ],
  providers: [QuizService, FileService, FolderService],
  templateUrl: './quizzes.component.html',
  styleUrl: './quizzes.component.scss',
})
export class QuizzesComponent implements OnInit, OnDestroy {
  quizzes: Quiz[] = [];
  folders: Folder[] = [];
  searchString: string = '';

  onSearch = debounce(() => this.search(), 500);

  subscription: Subscription[] = [];
  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private dialogRef: MatDialog,
    private folderService: FolderService,
  ) {
    const folderId = this.route.snapshot.params['folderId'];
    if (folderId) {
      this.quizService
        .getAllQuizzesByFolderId(folderId)
        .subscribe((quizzes) => {
          this.quizzes = quizzes;
        });
    } else {
      this.folderService.getFolders().subscribe((folders) => {
        this.folders = folders;
      });
      this.quizService
        .getAll()
        .subscribe((quizzes) => {
          this.quizzes = quizzes.filter((quiz: any) => quiz.folderId === null);
        });
    }
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe((state) => {});
  }

  search() {
    this.quizService.searchByName(this.searchString).subscribe((quizzes) => {
      this.quizzes = quizzes;
    });
  }

  test(id: string) {
    const newResult = {
      id: CommonUtils.generateRandomId(),
      quizId: id,
    };
    this.router.navigate(['/test', newResult.id], { state: newResult });
  }

  addNewQuiz() {
    this.router.navigate(['add-quiz']);
  }

  onAddFolderClick() {
    const dialogRef = this.dialog.open(AddOrEditFolderComponent);
    dialogRef.afterClosed().subscribe((folder) => {
      this.saveOrUpdateFolder(folder);
    });
  }

  saveOrUpdateFolder(folder: Folder) {
    if (folder.id) {
      this.folderService.updateFolder(folder.id, folder).subscribe((folder) => {
        this.folders = this.folders.map((f) =>
          f.id === folder.id ? folder : f,
        );
      });
    } else {
      folder = { ...folder, id: CommonUtils.generateRandomId() };
      this.folderService.createFolder(folder).subscribe((res: any) => {
        this.folders = [...this.folders, res];
      });
    }
  }

  onDuplicateFolder() {}
  onDeleteFolder(deletedFolder: Folder) {
    this.folders = this.folders.filter(
      (folder) => folder.id !== deletedFolder.id,
    );
  }

  edit(id: string) {
    this.router.navigate(['edit-quiz', id]);
  }

  onMoveQuizClick(quiz: Quiz) {
    this.dialog
      .open(MoveToFolderDialogComponent)
      .afterClosed()
      .subscribe((folder: Folder) => {
        quiz = { ...quiz, folderId: folder.id };
        this.moveQuizToFolder(quiz);
      });
  }

  moveQuizToFolder(movedQuiz: Quiz) {
    this.quizService.edit(movedQuiz).subscribe((movedQuiz) => {
      this.quizzes = this.quizzes.filter((quiz) => quiz.id !== movedQuiz.id);
    });
  }

  duplicate(quiz: Quiz) {
    let cloneQuiz = cloneDeep(quiz);
    cloneQuiz = {
      ...cloneQuiz,
      id: CommonUtils.generateRandomId(),
      name: `Copy of ${cloneQuiz.name}`,
    };
    this.quizService.create(cloneQuiz).subscribe(() => {
      this.quizzes.push(cloneQuiz);
    });
  }

  onDeleteClick(quiz: Quiz) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
    });

    dialogRef.componentInstance.title = 'Warning';
    dialogRef.componentInstance.message = 'Confirm to delete this?';
    dialogRef.afterClosed().subscribe((isConfirm) => {
      if (isConfirm) {
        this.deleteQuiz(quiz);
      }
    });
  }

  deleteQuiz(deleteQuiz: Quiz) {
    this.quizService.delete(deleteQuiz.id).subscribe(() => {
      this.quizzes = this.quizzes.filter((quiz) => quiz.id !== deleteQuiz.id);
    });
  }

  ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
