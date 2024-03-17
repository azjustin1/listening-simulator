import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestService {
  baseUrl: string = 'http://localhost:3000'

  constructor(private httpClient: HttpClient) {}

  getAllResult(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/results`);
  }

  getResultById(resultId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/results/${resultId}`);
  }

  submitTest(result: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/results`, result);
  }
}
