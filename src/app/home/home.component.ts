import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { QuizzesComponent } from '../quizzes/quizzes.component';
import { QuizService } from '../quizzes/quizzes.service';
import { ReadingService } from '../reading/reading.service';
import { ResultComponent } from '../result/result.component';
import { TestService } from '../test/test.service';

enum Tab {
  tests,
  results,
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
   
  ],
  providers: [QuizService, TestService, ReadingService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
