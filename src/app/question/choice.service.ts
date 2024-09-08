import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Choice } from '../../common/models/choice.model';
import { Observable } from 'rxjs';

@Injectable()
export class ChoiceService {
  constructor(private httpClient: HttpClient) {}

  create(questionId: string, choice: Choice): Observable<Choice> {
    const requestBody = {
      questionId,
      choice,
    };
    return this.httpClient.post<Choice>('/choices', requestBody);
  }

  delete(choiceId: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`/choices/${choiceId}`);
  }
}
