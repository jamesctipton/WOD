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

    return this.httpClient.post<any>(this.SERVER_URL, data, {
      // headers: new HttpHeaders().set('Content-Type', 'multipart/form-data; boundary=???'), // it doesnt like this for some reason
      headers: new HttpHeaders().delete('Content-Type'),
      reportProgress: true,
      observe: 'events',
      withCredentials: true,
    });
  }

}
