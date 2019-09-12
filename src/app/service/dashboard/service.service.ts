import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }

  private baseUrl = 'http://localhost:8080/spring/api/dashboard';

  getRegion(): Promise<any> {
    return this.http.get(`${this.baseUrl}/getRegions`).toPromise();
  }
  getProvince(): Promise<any> {
    return this.http.get(`${this.baseUrl}/getProvinces`).toPromise();
  }
  getSummaryElectionPartyDistricts(_userId: string, provinceId: string): Promise<any>{
    let headers = new HttpHeaders({
      'userId': _userId
    });

    let params = new HttpParams();
    params = params.append('provinceId', provinceId);

    let options = {
      headers: headers,
      params: params
    };
    return this.http.get(`${this.baseUrl}/getSummaryElectionPartyDistricts/?provinceId=${provinceId}`,options).toPromise();
  }
  getElectionPartyDistricts(_userId: string, provinceId: string): Promise<any>{
    let headers = new HttpHeaders({
      'userId': _userId
    });

    let params = new HttpParams();
    params = params.append('provinceId', provinceId);

    let options = {
      headers: headers,
      params: params
    };
    return this.http.get(`${this.baseUrl}/getElectionPartyDistricts/?provinceId=${provinceId}`,options).toPromise();
  }
  getElectionPartyRegion(_userId: string, regionId: string): Promise<any>{
    let headers = new HttpHeaders({
      'userId': _userId
    });

    let params = new HttpParams();
    params = params.append('regionId', regionId);

    let options = {
      headers: headers,
      params: params
    };
    return this.http.get(`${this.baseUrl}/getElectionPartyRegion/?provinceId=${regionId}`,options).toPromise();
  }
  getNotApprovedDistrictsByProvince(prvId: string):Promise<any>{
    let params = new HttpParams();
    params = params.append('prvId', prvId);

    let options = {
      params: params
    };
    return this.http.get(`${this.baseUrl}/getNotApprovedDistrictsByProvince/?provinceId=${prvId}`,options).toPromise();
  }

  //All party
  getAllParty(_userId:string ,_role: string):Promise<any>{

    let headers = new HttpHeaders({
      'userId': _userId,
      'role':_role
    });

    let options = {
      headers: headers,
    };
    
    return this.http.get(`${this.baseUrl}/getAllParty/`,options).toPromise();
  }
  // getSummaryElectionPartyDistricts(): Promise<any> {
  //   return this.http.get('http://localhost:8080/spring/api/dashboard/getSummaryElectionPartyDistricts?provinceId=2').toPromise();
  // }
}
