import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService {
  constructor(private httpClient: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.httpClient.post<any>(`upload`, formData);
  }

  deleteFile(fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`file/${fileName}`, {
      responseType: 'json',
    });
  }
}
