import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface ApiReq {
  from: string;
  to: string;
  name: string;
  subject: string;
  text: string;
  attachments: Attachment[];
}

export interface Attachment {
  attachmentName: string;
  attachmentData: string;
}

@Injectable({
  providedIn: 'root'
})
export class CallApiService {
  constructor(private http: HttpClient) {}

  sendEmail(req: ApiReq): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/sendEmail', req);
  }
}
