import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of as observableOf, throwError as observableThrowError, Observable, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public baseUrl = window["env" as any]["baseUrl" as any]  ;

  constructor(private http: HttpClient) {
  }
  
  post(requestParam: any): Observable<any> {
    // console.log(requestParam,"reqparam")

    return this.http.post(this.baseUrl + requestParam.url, requestParam.data,{
      headers:requestParam?.headers
    }).pipe(
      mergeMap((data: any) => {
        if (data?.status !== 200) {
          return observableThrowError(data?.error);
        }
        return observableOf(data);
      }));
  }

  get(requestParam: any, params?:HttpParams): Observable<any> {

    console.log(this.baseUrl,"data service line no 31")
    console.log(requestParam,"data service line no 32")
    console.log(this.baseUrl + requestParam.url,"data service line no 33")
    return this.http.get(this.baseUrl + requestParam.url).pipe(
      mergeMap((data: any) => {
        if (data?.status !== 200) {
          
          return observableThrowError(data?.error);
        }
        return observableOf(data);
      }));
  }

}
