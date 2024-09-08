import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../../common/models/question.model';
import { Observable } from 'rxjs';

@Injectable()
export class QuestionService {
  constructor(private httpClient: HttpClient) {}

  addQuestion(quizId: string, question: Question): Observable<Question> {
    const requestBody = {
      quizId,
      question,
    };
    return this.httpClient.post<Question>('/questions', requestBody);
  }

  updateQuestion(question: Question): Observable<Question> {
    return this.httpClient.patch<Question>('/questions', question);
  }

  updateSubQuestion(subQuestion: Question): Observable<Question> {
    return this.httpClient.patch<Question>('/questions/sub-questions', subQuestion);
  }

  addSubQuestion(questionId: string, subQuestion: Question) {
    const requestBody = {
      questionId,
      subQuestion,
    };

    return this.httpClient.post<Question>(
      '/questions/sub-questions',
      requestBody,
    );
  }
}
