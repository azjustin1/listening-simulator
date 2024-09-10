import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Choice } from '../../common/models/choice.model';
import { Observable } from 'rxjs';
import { Question } from '../../common/models/question.model';

@Injectable()
export class ChoiceService {
  constructor(private httpClient: HttpClient) {}

  create(question: Question, choice: Choice): Observable<Choice> {
    const requestBody = {
      question,
      choice,
    };
    return this.httpClient.post<Choice>('/choices', requestBody);
  }

  update(choice: Choice): Observable<Choice> {
    return this.httpClient.patch<Choice>('/choices', choice);
  }

  delete(choiceId: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`/choices/${choiceId}`);
  }
}
