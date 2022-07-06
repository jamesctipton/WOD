import { Injectable } from '@angular/core';

import { HttpClient, HttpEvent, HttpErrorResponse, HttpHeaders } from  '@angular/common/http';  
import { Globals } from './globals';


@Injectable({
  providedIn: 'root',
})
export class UploadserviceService {

  SERVER_URL: string = this.global.url + "/photoupload";

  constructor(
    private httpClient: HttpClient,
    public global: Globals
  ) { }

  public upload(data) {

    return this.httpClient.post<any>(this.SERVER_URL, data, {
      // headers: new HttpHeaders().set('Content-Type', 'multipart/form-data; boundary=???'), // it doesnt like this for some reason
      headers: new HttpHeaders().delete('Content-Type'),
      reportProgress: true,
      observe: 'events',
      withCredentials: true,
    });
  }

}
