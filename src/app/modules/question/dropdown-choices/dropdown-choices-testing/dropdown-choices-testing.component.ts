import { Component } from '@angular/core';
import { DropdownChoicesEditingComponent } from '../dropdown-choices-editing/dropdown-choices-editing.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { isEmpty } from 'lodash-es';

@Component({
  selector: 'app-dropdown-choices-testing',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './dropdown-choices-testing.component.html',
  styleUrl: './dropdown-choices-testing.component.scss',
})
export class DropdownChoicesTestingComponent extends DropdownChoicesEditingComponent {
  override ngOnInit() {
    super.ngOnInit();
    if (!isEmpty(this.question.answer)) {
      this.selectedChoice = this.question.answer[0];
    }
  }

  onSelectAnswer(choiceId: string) {
    if (this.question.answer.includes(choiceId)) {
      this.question.answer = [];
      this.selectedChoice = null;
    } else {
      this.question.answer = [choiceId];
      this.selectedChoice = choiceId;
    }
    this.onAnswer.emit(this.question);
  }
}
