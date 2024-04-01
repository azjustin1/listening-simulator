import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { QuizService } from './quizzes/quizzes.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule],
  providers: [QuizService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'listening-simulator';

  quizService: QuizService = inject(QuizService);

  constructor() {
    window.addEventListener('keydown', function (e) {
      if (e.key === 'F3' || (e.ctrlKey && e.key === 'f')) {
        e.preventDefault();
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
      }
    });
    this.quizService.getAll().subscribe();
  }
}
