import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { HttpParams, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';

import { CookieService } from '../cookie.service';
import { StorageService } from '../storage.service';
import { Globals } from '../globals';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  providers: [ Globals ]
})
export class MenuPage implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient,
    public global: Globals,
    private cookie: CookieService,
    private storage: StorageService,
    public platform: Platform
  ) { }

  admin = true;

  ngOnInit() {
    // this.admin = (this.cookie.getCookie("admin")) == '' ? false : true;
    this.storage.getItem('adminLog').then((val) => {
      this.admin = val;
    });
    // console.log(this.admin);
  }

  back() {
    this.router.navigate(['home']);
  }

  upload() {
    this.router.navigate(['upload']);
  }

  history() {
    this.router.navigate(['history']);
  }

  adminList() {
    this.router.navigate(['adminlist']);
  }

  adminInfo() {
    this.router.navigate(['admininfo']);
  }

  adminSearch() {
    this.router.navigate(['adminsearch']);
  }

  userMeta() {
    this.router.navigate(['usermeta']);
  }

  logout() {

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      // withCredentials: true,
      Origin: 'https://wateroil.itongue.cn'
    }

    this.http
    .get('https://wateroil.itongue.cn/logout', options)
    .subscribe(response => {
        console.log(response);
        if(response['status'] == 0) {
          this.router.navigateByUrl('/home');
        }
        else {
          alert(response['msg']);
        }
    });

    //clear all cookies
    this.cookie.deleteAllCookies();
    this.storage.removeItem('loggedIn');
    this.storage.removeItem('adminLog');

    // this.cookie.deleteCookie("admin");
  }

}
