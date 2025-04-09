import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Test } from '../../shared/models/test.model';
import { Quiz } from '../../shared/models/quiz.model';

@Injectable({ providedIn: 'root' })
export class TestService {
  baseUrl = '/tests';

  constructor(private httpClient: HttpClient) {}

  private mapAnswerByQuestionId = signal<Record<string, string[]>>({});

  public getQuestionAnswer(questionId: string) {
    return this.mapAnswerByQuestionId()[questionId];
  }

  public getAnswers = computed(() => this.mapAnswerByQuestionId());

  public answerQuestion(questionId: string, answer: string[]) {
    this.mapAnswerByQuestionId.update((currentValue) => ({
      ...currentValue,
      [questionId]: answer,
    }));
  }

  getAllTests(): Observable<Test[]> {
    return this.httpClient.get<Test[]>(`${this.baseUrl}`);
  }

  getById(testId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/${testId}`);
  }

  createNewTest(quiz: Quiz): Observable<any> {
    const requestBody = {
      quizName: quiz.name,
      quizId: quiz._id,
      listening: quiz.listening,
      reading: quiz.reading,
      writing: quiz.writing,
    };
    return this.httpClient.post<any>(`${this.baseUrl}`, requestBody);
  }

  saveCurrentTest(test: Test): Observable<any> {
    const requestBody = {
      studentName: test.studentName,
      answers: test.answers,
    };
    return this.httpClient.put<any>(`${this.baseUrl}/${test._id}`, requestBody);
  }

  delete(testId: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.baseUrl}/${testId}`);
  }

  submitTest(result: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}`, result);
  }
}
