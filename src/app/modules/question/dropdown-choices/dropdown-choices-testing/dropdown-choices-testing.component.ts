import { Component } from '@angular/core';
import { DropdownChoicesEditingComponent } from '../dropdown-choices-editing/dropdown-choices-editing.component';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-dropdown-choices-testing',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './dropdown-choices-testing.component.html',
  styleUrl: './dropdown-choices-testing.component.scss',
})
export class DropdownChoicesTestingComponent extends DropdownChoicesEditingComponent {
  onSelectAnswer(choiceId: string) {
    if (this.question.answer.includes(choiceId)) {
      this.question.answer = [];
      this.selectedChoice = null;
    } else {
      this.question.answer = [choiceId];
      this.selectedChoice = choiceId;
    }
  }
}
