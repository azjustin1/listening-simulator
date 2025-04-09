import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AbstractQuestionComponent } from '../../../shared/abstract/abstract-question.component';
import { FileService } from '../../../file.service';
import { MultipleChoicesEditingComponent } from './multiple-choices-editing/multiple-choices-editing.component';
import { MultipleChoicesTestingComponent } from './multiple-choices-testing/multiple-choices-testing.component';
import { MultipleChoicesReadonlyComponent } from './multiple-choices-readonly/multiple-choices-readonly.component';

@Component({
  selector: 'app-multiple-choices',
  standalone: true,
  imports: [
    MatIconModule,
    MultipleChoicesEditingComponent,
    MultipleChoicesTestingComponent,
    MultipleChoicesReadonlyComponent,
  ],
  providers: [FileService],
  templateUrl: './multiple-choices.component.html',
  styleUrl: './multiple-choices.component.scss',
})
export class MultipleChoicesComponent extends AbstractQuestionComponent {
}
