import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService {
  constructor(private httpClient: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    return this.httpClient.post<any>(`/file/upload`, formData);
  }

  generatePdf(html: string): Observable<any> {
    const requestBody = {
      html
    }
    return this.httpClient.post('/file/generate-pdf', requestBody);
  }

  deleteFile(fileName: string): Observable<any> {
    return this.httpClient.delete<any>(`/file/${fileName}`, {
      responseType: 'json',
    });
  }
}
