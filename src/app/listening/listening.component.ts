import { CommonModule } from '@angular/common';
import {
  Component
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { AbstractQuizPartComponent } from '../../common/abstract-quiz-part.component';
import { Listening } from '../../common/models/listening.model';
import { FileService } from '../file.service';
import { QuestionComponent } from '../question/question.component';
import { ListeningService } from './listening.service';

@Component({
  selector: 'app-listening',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    QuestionComponent,
    MatIconModule,
  ],
  providers: [ListeningService, FileService],
  templateUrl: './listening.component.html',
  styleUrl: './listening.component.css',
})
export class ListeningComponent extends AbstractQuizPartComponent<Listening> {
  isDisableStartButton = false;

  subscription: Subscription[] = [];

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override onStart() {
    super.onStart();
  }
}
