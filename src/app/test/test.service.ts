import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor(private httpClient: HttpClient) {}

  getAllResult(): Observable<any> {
    return this.httpClient.get<any>(`/results`);
  }

  getResultById(resultId: number): Observable<any> {
    return this.httpClient.get<any>(`/results/${resultId}`);
  }

  submitTest(result: any): Observable<any> {
    return this.httpClient.post<any>('/results', result);
  }
}
