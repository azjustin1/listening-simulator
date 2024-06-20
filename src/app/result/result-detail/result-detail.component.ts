import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  differenceWith,
  each,
  intersection,
  isEqual,
  isString,
  isUndefined,
} from 'lodash-es';
import { Choice } from '../../../common/models/choice.model';
import { Question } from '../../../common/models/question.model';
import { Result } from '../../../common/models/result.model';
import { ListeningComponent } from '../../listening/listening.component';
import { MultipleChoicesComponent } from '../../multiple-choices/multiple-choices.component';
import { PartNavigationComponent } from '../../part-navigation/part-navigation.component';
import { ReadingComponent } from '../../reading/reading.component';
import { ShortAnswerComponent } from '../../short-answer/short-answer.component';
import { WritingComponent } from '../../writing/writing.component';
import { BandScorePipe } from '../band-score.pipe';
import { ResultService } from '../result.service';

@Component({
  selector: 'app-result-detail',
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
    MatTabsModule,
    ReadingComponent,
    ListeningComponent,
    WritingComponent,
    BandScorePipe,
    PartNavigationComponent,
  ],

  templateUrl: './result-detail.component.html',
  styleUrl: './result-detail.component.scss',
})
export class ResultDetailComponent {
  result: Result = {
    id: '',
    name: '',
    studentName: '',
    listeningParts: [],
    readingParts: [],
    writingParts: [],
    correctReadingPoint: 0,
    totalReadingPoint: 0,
    correctListeningPoint: 0,
    totalListeningPoint: 0,
    testDate: '',
    quizId: '',
    isSubmit: false,
  };

  correctListeningPoint = 0;
  totalListeningPoint = 0;

  selectedListeningPart = 0;
  selectedReadingPart = 0;
  selectedWritingPart = 0;

  constructor(
    private route: ActivatedRoute,
    private resultService: ResultService,
    private router: Router,
  ) {
    this.route.paramMap.subscribe((paramMap: any) => {
      const resultId = paramMap.get('resultId');
      if (resultId) {
        this.resultService.getById(resultId).subscribe((result) => {
          this.result = result;
          this.calculateListeningPoint();
          this.calculateReadingPoint();
        });
      }
    });
  }

  private calculateListeningPoint() {
    let correctPoint = 0;
    let totalPoint = 0;
    each(this.result.listeningParts, (part) => {
      each(part.questions, (question) => {
        switch (question.type) {
          case 0:
            // Multiple choices
            totalPoint = totalPoint + question.correctAnswer.length;
            if (
              intersection(question.correctAnswer, question.answer).length !== 0
            ) {
              correctPoint =
                correctPoint +
                intersection(question.correctAnswer, question.answer).length;
            }
            break;
          case 1:
            // Short answer
            each(question.choices, (choice) => {
              totalPoint++;
              if (this.isCorrectAnswer(choice)) {
                correctPoint++;
              }
            });
            break;
          case 3:
            totalPoint++;
            if (question.answer === question.correctAnswer) {
              correctPoint++;
            }
            break;
          case 4:
            each(question.subQuestions, (question) => {
              totalPoint++;
              console.log(question.answer, 'Correct: ', question.correctAnswer);
              if (
                differenceWith(question.answer, question.correctAnswer, isEqual)
                  .length === 0
              ) {
                correctPoint++;
              }
            });
            break;
          default:
            break;
        }
      });
    });
    this.result.correctListeningPoint = correctPoint;
    this.result.totalListeningPoint = totalPoint;
  }

  private calculateReadingPoint() {
    let correctPoint = 0;
    let totalPoint = 0;
    each(this.result.readingParts, (part) => {
      each(part.questions, (question) => {
        each(question.subQuestions, (subQuestion) => {
          switch (subQuestion.type) {
            case 0:
              // Multiple choices
              totalPoint = totalPoint + question.answer.length;
              if (this.isCorrectChoices(subQuestion)) {
                correctPoint++;
              }
              break;
            case 1:
              // Short answer
              each(subQuestion.choices, (choice) => {
                totalPoint++;
                if (this.isCorrectAnswer(choice)) {
                  correctPoint++;
                }
              });
              break;
            case 3:
              totalPoint++;
              if (subQuestion.answer === subQuestion.correctAnswer) {
                correctPoint++;
              }
              break;
            default:
              break;
          }
        });
      });
    });
    this.result.correctReadingPoint = correctPoint;
    this.result.totalReadingPoint = totalPoint;
  }

  private isCorrectAnswer(choice: Choice) {
    return (
      choice.answer !== '' &&
      !isUndefined(choice.answer) &&
      !isUndefined(choice.correctAnswer) &&
      (choice.answer?.trim() === choice.correctAnswer?.trim() ||
        choice.correctAnswer?.split('/').includes(choice.answer?.trim()))
    );
  }

  private isCorrectChoices(question: Question) {
    if (question.type === 3 || isString(question.answer)) {
      return question.answer === question.correctAnswer;
    }

    return (
      question.answer.length > 0 &&
      isEqual(question.answer.sort(), question.correctAnswer.sort())
    );
  }

  printPage() {
    window.print();
  }

  back() {
    this.router.navigate(['']);
  }
}
