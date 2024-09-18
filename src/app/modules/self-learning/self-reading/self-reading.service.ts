import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reading } from '../../../../common/models/reading.model';
import { Observable } from 'rxjs';

@Injectable()
export class SelfReadingService {
  httpClient = inject(HttpClient);

  getAllSelfReading(): Observable<Reading[]> {
    return this.httpClient.get<Reading[]>('/self-reading');
  }

  getSelfReadingById(id: string): Observable<Reading> {
    return this.httpClient.get<Reading>(`/self-reading/${id}`);
  }

  createSelfReading(reading: Reading): Observable<Reading> {
    return this.httpClient.post<Reading>('/self-reading', reading);
  }

  updateSelfReading(reading: Reading): Observable<Reading> {
    return this.httpClient.patch<Reading>('/self-reading', reading);
  }

  deleteSeflReading(id: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`/self-reading/${id}`);
  }
}
