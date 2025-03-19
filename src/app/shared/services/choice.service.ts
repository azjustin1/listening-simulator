import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Choice } from '../models/choice.model';
import { Observable } from 'rxjs';

@Injectable()
export class ChoiceService {
  constructor(private httpClient: HttpClient) {}

  createChoice(choiceData: Choice): Observable<Choice> {
    return this.httpClient.post<Choice>('/choices', choiceData);
  }

  updateChoice(choice: Choice): Observable<Choice> {
    console.log(choice);
    return this.httpClient.put<Choice>(`/choices/${choice._id}`, choice);
  }

  deleteChoice(id: string) {
    return this.httpClient.delete(`/choices/${id}`);
  }
}
