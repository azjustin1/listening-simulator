import { Component, inject, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { Folder } from '../../../common/models/folder.model';
import { MatButtonModule } from '@angular/material/button';
import { FolderService } from '../../folder/folder.service';
import { AsyncPipe } from '@angular/common';
import { Observable, Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-move-to-folder-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatButtonModule,
    AsyncPipe
  ],
  providers: [FolderService],
  templateUrl: './move-to-folder-dialog.component.html',
  styleUrl: './move-to-folder-dialog.component.scss',
})
export class MoveToFolderDialogComponent {
  folders!: Observable<Folder[]>;
  folderForm!: FormGroup;

  folderService = inject(FolderService);
  constructor(
    public dialogRef: MatDialogRef<MoveToFolderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { folders: Folder[] },
    private formBuilder: FormBuilder,
  ) {
    this.folderForm = this.formBuilder.group({
      selectedFolder: [null, Validators.required],
    });
    this.folders = this.folderService.getFolders();
  }

  onSubmit(): void {
    this.dialogRef.close(this.folderForm.get('selectedFolder')?.value)
  }
}
