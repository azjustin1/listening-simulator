import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  httpClient = inject(HttpClient);

  isLogin() {
    return this.getToken() !== null;
  }

  check(): Observable<boolean> {
    const header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.getToken()}`,
      ),
    };
    return this.httpClient.get<boolean>('/auth/check', header);
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const req = {
      username,
      password,
    };
    return this.httpClient.post<LoginResponse>('/auth/login', req);
  }

  getToken() {
    return sessionStorage.getItem('token');
  }

  setToken(token: string) {
    sessionStorage.setItem('token', token);
  }
}
