import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { each } from 'lodash-es';
import { Result } from '../../common/models/result.model';
import { MultipleChoicesComponent } from '../multiple-choices/multiple-choices.component';
import { QuizService } from '../quizzes/quizzes.service';
import { ShortAnswerComponent } from '../short-answer/short-answer.component';
import { TestService } from '../test/test.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    MultipleChoicesComponent,
    ShortAnswerComponent,
    CommonModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [QuizService, TestService],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent {
  result: Result = {
    id: '',
    name: '',
    timeout: 0,
    audioName: '',
    studentName: '',
    questions: [],
    parts: [],
  };

  constructor(
    private route: ActivatedRoute,
    private testService: TestService,
    private router: Router
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const resultId = paramMap.get('resultId');
      if (resultId) {
        this.testService.getResultById(resultId).subscribe((result) => {
          this.result = result;
          this.calculatePoint();
        });
      }
    });
  }

  private calculatePoint() {
    this.result.totalPoint = 0;
    each(this.result.questions, (question) => {
      if (question.type === 0) {
        // Multiple choices
        this.result.totalPoint!++;
        if (question.answer === question.correctAnswer) {
          this.result.correctPoint!++;
        }
      }

      if (question.type === 1) {
        // Short answer
        each(question.choices, (choice) => {
          this.result.totalPoint!++;
          if (choice.answer === choice.content) {
            this.result.correctPoint!++;
          }
        });
      }
    });
  }

  printPage() {
    window.print();
  }

  back() {
    this.router.navigate(['']);
  }
}
