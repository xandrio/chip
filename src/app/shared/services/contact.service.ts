import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactRequest {
  name: string;
  phone: string;
  model: string;
  description: string;
  captchaId: string;
  captcha: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  getCaptcha(): Observable<{ id: string; image: string }> {
    return this.http.get<{ id: string; image: string }>('/api/captcha');
  }

  sendRequest(data: ContactRequest): Observable<any> {
    return this.http.post('/api/contact', data);
  }
}
