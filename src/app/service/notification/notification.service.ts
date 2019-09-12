import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http:HttpClient) { }

  private baseUrl = 'http://localhost:8080/spring/api/notification';

  getFeedNotifications(_userId: string,_role: string,_username: string): Promise<any> {

    let headers = new HttpHeaders({
      'userId': _userId,
      'role': _role,
      'username':_username
    });
  
    let options = { headers: headers };
    return this.http.get(`${this.baseUrl}`+`/getFeedNotifications`,options).toPromise();
  }
}
