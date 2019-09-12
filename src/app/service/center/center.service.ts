import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CenterService {

  constructor(private http:HttpClient) { }

  private baseUrl = 'http://localhost:8080/spring/api/centerpoint';

  getRequestedConfirmations(_userId: string): Promise<any> {
    let headers = new HttpHeaders({
      'userId': _userId,
    });
  
    let options = { headers: headers };
    return this.http.get(`${this.baseUrl}/getRequestedConfirmations`,options).toPromise();
  }
  getRequestedModifications(_userId: string): Promise<any> {
    let headers = new HttpHeaders({
      'userId': _userId,
    });
  
    let options = { headers: headers };
    return this.http.get(`${this.baseUrl}/getRequestedModifications`,options).toPromise();
  }
  postReplyRequestedConfirmation(_districtId: string, _approved: string, _userId: string): Observable<Object> {
    let body = {
      districtId: _districtId,
      approved: _approved
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'userId': _userId
    });
  
    let options = { headers: headers };
    return this.http.post(`${this.baseUrl}/replyRequestedConfirmation`,body, options);
  }
  postReplyRequestedModification(_districtId: string, _approved: string, _userId: string): Observable<Object> {
    let body = {
      districtId: _districtId,
      approved: _approved
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'userId': _userId
    });
  
    let options = { headers: headers };
    return this.http.post(`${this.baseUrl}/replyRequestedModification`,body, options);
  }
}
