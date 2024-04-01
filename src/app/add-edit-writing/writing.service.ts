import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Writing } from '../../common/models/writing.model';

@Injectable()
export class WritingService {
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<Writing[]> {
    return this.httpClient.get<Writing[]>('/writings');
  }

  getById(id: number): Observable<Writing> {
    return this.httpClient.get<Writing>(`/writings/${id}`);
  }

  create(writing: Writing): Observable<Writing> {
    return this.httpClient.post<Writing>(`/writings`, writing);
  }

  edit(writing: Writing): Observable<Writing> {
    return this.httpClient.put<Writing>(`/writings/${writing.id}`, writing);
  }

  delete(writingId: string): Observable<any> {
    return this.httpClient.delete(`/writings/${writingId}`);
  }
}
