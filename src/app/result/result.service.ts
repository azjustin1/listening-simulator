import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../common/models/result.model';

@Injectable({ providedIn: 'root' })
export class ResultService {
  baseUrl: string = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Result[]> {
    return this.httpClient.get<Result[]>(`${this.baseUrl}/results`);
  }

  getById(id: string): Observable<Result> {
    return this.httpClient.get<Result>(`${this.baseUrl}/results/${id}`);
  }

  getByStudentName(name: string): Observable<Result[]> {
    return this.httpClient.get<Result[]>(
      `${this.baseUrl}/results?name_like=${name}`
    );
  }

  deleteById(id: string): Observable<Result> {
    return this.httpClient.delete<Result>(`${this.baseUrl}/results/${id}`);
  }
}
