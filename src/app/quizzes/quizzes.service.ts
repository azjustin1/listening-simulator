import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../../common/models/quiz.model';

@Injectable()
export class QuizService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<any> {
    return this.httpClient.get(`/quizzes`);
  }

  searchByName(name: string): Observable<any> {
    return this.httpClient.get(`/quizzes?name_like=${name}`);
  }

  getById(id: number): Observable<any> {
    return this.httpClient.get(`/quizzes/${id}`);
  }

  create(quiz: Quiz): Observable<any> {
    return this.httpClient.post(`/quizzes`, quiz);
  }

  edit(quiz: Quiz): Observable<any> {
    return this.httpClient.put(`/quizzes/${quiz.id}`, quiz);
  }

  delete(quizId: string): Observable<any> {
    return this.httpClient.delete(`/quizzes/${quizId}`);
  }
}
