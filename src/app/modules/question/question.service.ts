import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../../shared/models/question.model';
import { Observable } from 'rxjs';

@Injectable()
export class QuestionService {
  constructor(private httpClient: HttpClient) {}

  getQuestion(questionId: string): Observable<Question> {
    return this.httpClient.get<Question>(`/questions/${questionId}`);
  }

  updateQuestion(question: Question): Observable<Question> {
    return this.httpClient.put<Question>(
      `/questions/${question._id}`,
      question,
    );
  }

  deleteQuestion(questionId: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`/questions/${questionId}`);
  }
}
