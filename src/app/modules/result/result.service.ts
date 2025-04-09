import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Test } from '../../shared/models/test.model';

@Injectable({ providedIn: 'root' })
export class ResultService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Test[]> {
    return this.httpClient.get<Test[]>(`/results`);
  }

  getById(id: string): Observable<Test> {
    return this.httpClient.get<Test>(`/results/${id}`);
  }

  getByStudentName(name: string): Observable<Test[]> {
    return this.httpClient.get<Test[]>(`/results?name_like=${name}`);
  }

  deleteById(id: string): Observable<Test> {
    return this.httpClient.delete<Test>(`/results/${id}`);
  }
}
