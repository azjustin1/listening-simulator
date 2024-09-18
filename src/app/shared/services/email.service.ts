import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  httpClient = inject(HttpClient);

  send(html: string, studentName: string, studentEmail: string) {
    const requestBody = {
      html,
      studentName,
      studentEmail,
    };
    return this.httpClient.post('/mail/self-reading', requestBody);
  }
}
