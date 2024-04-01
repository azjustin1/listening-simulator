import { Component, inject, OnDestroy } from '@angular/core';
import { Writing } from '../../common/models/writing.model';
import { WritingService } from '../add-edit-writing/writing.service';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialog/confirm-dialog/confirm-dialog.component';
import { cloneDeep, filter } from 'lodash-es';
import { CommonUtils } from '../../utils/common-utils';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-writing-test',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatMenuModule, MatButtonModule],
  providers: [WritingService],
  templateUrl: './writing-test.component.html',
  styleUrl: './writing-test.component.css',
})
export class WritingTestComponent implements OnDestroy {
  writings: Writing[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    private writingService: WritingService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    this.writingService.getAll().subscribe((writings) => {
      this.writings = writings;
    });
  }

  test(id: string) {
    this.router.navigate(['/test', id]);
  }

  addNewQuiz() {
    this.router.navigate(['add-writing']);
  }

  edit(id: string) {
    this.router.navigate(['edit-writing', id]);
  }

  duplicate(writing: Writing) {
    let cloneQuiz = cloneDeep(writing);
    cloneQuiz = {
      ...cloneQuiz,
      id: CommonUtils.generateRandomId(),
    };
    this.writingService.create(cloneQuiz).subscribe(() => {
      this.writings.push(cloneQuiz);
    });
  }

  onDeleteClick(quiz: Writing) {
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

  deleteQuiz(writing: Writing) {
    this.writingService.delete(writing.id!).subscribe(() => {
      this.writings = filter(this.writings, (item) => writing.id !== item.id);
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
