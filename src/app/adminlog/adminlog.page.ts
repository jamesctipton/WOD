import { Component, OnInit } from '@angular/core';
import { CookieService } from '../cookie.service';

import { Router } from '@angular/router';
import { HttpParams, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-adminlog',
  templateUrl: './adminlog.page.html',
  styleUrls: ['./adminlog.page.scss'],
})
export class AdminlogPage implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookie: CookieService,
    private storage: StorageService
  ) { }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['menu']);
  }

  login_admin() {
    var user_text = (<HTMLInputElement>document.getElementById("user")).value;
    var pass_text = (<HTMLInputElement>document.getElementById("pass")).value;

    let params = 'username='+ user_text +'&password='+ pass_text

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      // withCredentials: true,
      Origin: 'https://wateroil.itongue.cn'
    }

    this.http
    .post('https://wateroil.itongue.cn/adminlogin', params , options)
    .subscribe(response => {
        console.log(response);
        if(response['status'] == 0) {
          this.cookie.setCookie("admin", "admin123", 30, "");
          this.storage.setItem('adminLog', true);
          this.router.navigateByUrl('/menu');
        }
        else {
          alert(response['msg']);
        }
    });
  }

}