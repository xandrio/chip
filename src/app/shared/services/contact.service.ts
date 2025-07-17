import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ContactRequest {
  name: string;
  phone: string;
  model: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  sendRequest(data: ContactRequest): Observable<any> {
    return this.http.post('/api/contact', data);
  }
}
