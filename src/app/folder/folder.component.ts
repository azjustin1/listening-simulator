import { Component, EventEmitter, inject, Input, input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Folder } from '../../common/models/folder.model';
import { FolderService } from './folder.service';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [MatCardModule, MatMenuModule, MatIconModule],
  providers: [FolderService],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss',
})
export class FolderComponent {
  @Input() folder: Folder = {
    id: '',
    name: '',
  };
  @Output() onDelete = new EventEmitter();
  @Output() onUpdate = new EventEmitter();
  @Output() onDuplicate = new EventEmitter();

  folderService = inject(FolderService);

  onDeleteClick(id: string) {
    this.folderService.deleteFolder(id).subscribe(() => {
      this.onDelete.emit();
    }) 
  }

  onEditClick(id: string) {}

  onDuplicateClick(id: string) {}
}
