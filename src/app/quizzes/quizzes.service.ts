import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quiz } from '../../common/models/quiz.model';

@Injectable()
export class QuizService {
  baseUrl: string = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/quiz`);
  }

  searchByName(name: string): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/quizzes?name_like=${name}`);
  }

  getById(id: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/quiz/${id}`);
  }

  create(quiz: Quiz): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/quiz`, quiz);
  }

  edit(quiz: Quiz): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/quiz/${quiz._id}`, quiz);
  }

  delete(quizId: string): Observable<any> {
    return this.httpClient.delete(`${this.baseUrl}/quizzes/${quizId}`);
  }
}
