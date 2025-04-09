import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractSection } from '../../models/abstract-section.model';
import { CommonModule } from '@angular/common';
import { Part } from '../../models/part.model';

@Component({
  selector: 'app-part-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './part-navigation.component.html',
  styleUrl: './part-navigation.component.scss',
})
export class PartNavigationComponent {
  @Input() isUnsavedSection: boolean = false;
  @Input() selectedPart = 1;
  @Output() selectedPartChange = new EventEmitter();
  @Input() parts: Part[] = [];
  @Output() onPartChange = new EventEmitter();

  onPartClick(index: number) {
    if (this.isUnsavedSection) {
      return;
    }
    this.selectedPart = index;
    this.selectedPartChange.emit(this.selectedPart);
  }
}
