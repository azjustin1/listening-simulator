import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractSection } from '../models/abstract-section.model';
import { Observable } from 'rxjs';

@Injectable()
export class SectionService {
  baseUrl = '/sections';

  constructor(private httpClient: HttpClient) {}

  updateSection(section: AbstractSection): Observable<AbstractSection> {
    return this.httpClient.put<AbstractSection>(
      `${this.baseUrl}/${section._id}`,
      section,
    );
  }
}
