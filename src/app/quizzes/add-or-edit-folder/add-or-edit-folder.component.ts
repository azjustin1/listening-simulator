import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonUtils } from '../../../utils/common-utils';

@Component({
  selector: 'app-add-or-edit-folder',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-or-edit-folder.component.html',
  styleUrl: './add-or-edit-folder.component.scss',
})
export class AddOrEditFolderComponent {
  nameControl = new FormControl('', [Validators.required]);
  constructor(
    public dialogRef: MatDialogRef<AddOrEditFolderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close({
      id: CommonUtils.generateRandomId(),
      name: this.nameControl.value,
    });
  }
}
