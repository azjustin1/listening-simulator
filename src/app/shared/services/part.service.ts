import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Part } from "../models/part.model";

@Injectable({
  providedIn: 'root'
})
export class PartService {

  private apiUrl = '/parts';

  constructor(private http: HttpClient) {}

  createPart(part: Part): Observable<Part> {
    return this.http.post<Part>(this.apiUrl, part);
  }

  getParts(): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(this.apiUrl);
  }

  getPart(id: number): Observable<HttpResponse<any>> {
    return this.http.get<HttpResponse<any>>(`${this.apiUrl}/${id}`);
  }

  updatePart(part: any, id: number): Observable<HttpResponse<any>> {
    return this.http.put<HttpResponse<any>>(`${this.apiUrl}/${id}`, part);
  }

  deletePart(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
