import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService {
  baseUrl: string = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {}

  getFile(fileName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/file/${fileName}`, {
      responseType: 'blob' as 'json',
    });
  }

  uploadAudioFile(file: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.httpClient.post<any>(`${this.baseUrl}/upload`, formData);
  }

  deleteFile(fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/file/${fileName}`, {
      responseType: 'json',
    });
  }
}
