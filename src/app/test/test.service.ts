import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TestService {
  baseUrl: string = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  getResultByStudentName(studentName: string): Observable<any> {
    return this.httpClient.get(
      `${this.baseUrl}/results?studentName_like=${studentName}`
    );
  }

  getResultById(resultId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/results/${resultId}`);
  }

  deleteResultById(resultId: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/results/${resultId}`);
  }

  submitTest(result: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/results`, result);
  }
}
