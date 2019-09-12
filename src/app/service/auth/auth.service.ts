import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isSuccess = false;
  username = '';
  password = '';
  position = '';
  public data:any=[]
  constructor(private http:HttpClient,@Inject(SESSION_STORAGE) private storage: WebStorageService) { }
  private loggedInStatus = JSON.parse(localStorage.getItem('loggedIn')|| 'false')
  private baseUrl = 'http://localhost:8080/spring/api/user';
  
  setLoggedIn(value :boolean) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn','true');
    localStorage.setItem('isVisible','true');
  }
  setLoggedOut(value :boolean) {
    this.loggedInStatus = value;
    localStorage.setItem('loggedIn','false');
    localStorage.setItem('isVisible','false');
  }
  get isLoggedIn(){
    return JSON.parse(localStorage.getItem('loggedIn') || this.loggedInStatus.toString());
  }
  getState() {
    return this.isSuccess;
  }
  getUsername() {
    return this.username
  }
  getPosition() {
    return this.position
  }
  setState(isSuccess: boolean,username: string,password: string,position:string,userId) {
    this.isSuccess = isSuccess;
    this.username = username
    this.password = password
    this.position = position
    this.saveInLocal("username",username[0])
    this.saveInLocal("position",position)
    this.saveInLocal("userId",userId)
    this.setLoggedIn(true)
  }
  saveInLocal(key, val): void {
    console.log('recieved= key:' + key + 'value:' + val);
    this.storage.set(key, val);
    this.data[key]= this.storage.get(key);
   }
   getFromLocal(key): void {
    console.log('recieved= key:' + key);
    this.data[key]= this.storage.get(key);
    console.log(this.data);
   }
   getKey() {
     console.log(this.data)
   }
   //api
  postAuthorization(_username: string, _password: string): Observable<Object> {
    let body = {
      username: _username,
      password: _password
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    let options = { headers: headers };
    return this.http.post(`${this.baseUrl}`+`/authorization`,JSON.stringify(body), options);
  }
  
  getUserProfile(_userId: string): Promise<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'userId': _userId
    });

    let options = { headers: headers };
    return this.http.get(`${this.baseUrl}`+`/getProfile`,options).toPromise();
  }
  
}
