import { Injectable } from '@angular/core';

import { HttpClient, HttpEvent, HttpErrorResponse, HttpHeaders } from  '@angular/common/http';  
import { map } from  'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadserviceService {

  SERVER_URL: string = "https://wateroil.itongue.cn/photoupload";

  constructor(
    private httpClient: HttpClient
  ) { }

  public upload(data) {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      // Origin: 'http://47.100.22.28',
      reportProgress: true,
      observe: 'events',
      // withCredentials: true,
    }

    return this.httpClient.post<any>(this.SERVER_URL, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      reportProgress: true,
      observe: 'events',
      // withCredentials: true,
    });
  }

}
