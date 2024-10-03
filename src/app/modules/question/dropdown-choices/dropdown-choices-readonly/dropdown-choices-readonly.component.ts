import { Component } from '@angular/core';
import { DropdownChoicesEditingComponent } from "../dropdown-choices-editing/dropdown-choices-editing.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { CorrectDropdownPipe } from "../../../../pipes/correct-dropdown.pipe";

@Component({
  selector: 'app-dropdown-choices-readonly',
  standalone: true,
  imports: [MatExpansionModule, CorrectDropdownPipe],
  templateUrl: './dropdown-choices-readonly.component.html',
  styleUrl: './dropdown-choices-readonly.component.scss',
})
export class DropdownChoicesReadonlyComponent extends DropdownChoicesEditingComponent {
  override ngOnInit() {
    super.ngOnInit();
    console.log(this.question.answer, this.question.correctAnswer)
    console.log(this.question.answer[0] === this.question.correctAnswer[0])
  }
}
