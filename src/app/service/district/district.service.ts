import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  constructor(private http:HttpClient) { }

  private baseUrl = 'http://localhost:8080/spring/api/district';
  //สร้าง district
  postCreateElectionDistinct(_userId,_role,_prvId, _distNum,_pty1Id, _pty1Vote,_pty2Id, _pty2Vote,_pty3Id, _pty3Vote, _badVote, _VoteNo ): Promise<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'userId': _userId,
      'role':_role
    });
    let body = {
      "prvId": _prvId,
      "distNum": _distNum,
      "pty1Id": _pty1Id,
      "pty1Vote": _pty1Vote,
      "pty2Id": _pty2Id,
      "pty2Vote": _pty2Vote,
      "pty3Id": _pty3Id,
      "pty3Vote": _pty3Vote,
      "badVote": _badVote,
      "VoteNo": _VoteNo	
    }
    let options = {
      headers: headers,
    };
    return this.http.post(`${this.baseUrl}`+`/createElectionDistinct`,JSON.stringify(body),options).toPromise();
  }
  //send distID to modified
  postRequestToModifiedElectionResult(_userId:string,_distId: string): Promise<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'userId': _userId,
    });
    let body = {
      "districtId": _distId,
    }
    let options = {
      headers: headers,
    };
    return this.http.post(`${this.baseUrl}`+`/requestToModifiedElectionResult`,JSON.stringify(body),options).toPromise();
  }
  //waiting edit
  getResultRequestedModifications(): Promise<any> {
    return this.http.get(`${this.baseUrl}/getResultRequestedModifications`).toPromise();
  }
  //????
  getElectionDistricts(distId: string): Promise<any> {
    let params = new HttpParams();
    params = params.append('distId', distId);

    let options = {
      params: params
    };
    return this.http.get(`${this.baseUrl}/getElectionDistricts/?districtId=${distId}`,options).toPromise();
  }
  //send data to update district
  postUpdateElectionDistrict(_userId:string,_prvId: string, _distNum: string,_pty1Id: string, _pty1Vote: string,_pty2Id: string, _pty2Vote: string,_pty3Id: string, _pty3Vote: string, _badVote:string, _VoteNo:string): Promise<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'userId': _userId,
    });
    let body = {
      "prvId": _prvId,
      "distNum": _distNum,
      "pty1Id": _pty1Id,
      "pty1Vote": _pty1Vote,
      "pty2Id": _pty2Id,
      "pty2Vote": _pty2Vote,
      "pty3Id": _pty3Id,
      "pty3Vote": _pty3Vote,
      "badVote": _badVote,
      "voteNo": _VoteNo	
    }
    let options = {
      headers: headers,
    };
    return this.http.post(`${this.baseUrl}`+`/updateElectionDistrict`,JSON.stringify(body),options).toPromise();
  }
  
}
