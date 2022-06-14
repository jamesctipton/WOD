import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { CookieService } from '../cookie.service';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: StorageService,
    private cookie: CookieService
  ) {}

  user: User;

  ngOnInit() {
  }

  login() {
    var user_text = (<HTMLInputElement>document.getElementById("user")).value;
    var pass_text = (<HTMLInputElement>document.getElementById("pass")).value;

    let params = 'username='+ user_text +'&password='+ pass_text

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      // .set('Access-Control-Allow-Origin','null'),
      // withCredentials: true,
      Origin: 'https://wateroil.itongue.cn:80'
    }

    this.http
    .post('https://wateroil.itongue.cn/login', params , options)
    .subscribe(response => {
      console.log(response);
      if(response['status'] == 0) {

        // clear previous user (if any), set current user data to retrieve later when necessary
        this.storage.setItem('user', '');
        response['msg']['admin'] = false;
        this.user = response['msg'];
        this.storage.setItem('user', this.user);
        //used for auth guard
        this.storage.setItem('loggedIn', true);
        this.router.navigate(['/menu']);
        // test to see if account is admin as well.
        this.http
        .post('https://wateroil.itongue.cn/adminlogin', params , options)
        .subscribe(response => {
            console.log(response);
            if(response['status'] == 0) {
              // cookie not necessary this is mostly for testing not for security
              this.cookie.setCookie("admin", "admin123", 30, "");
              this.storage.setItem('adminLog', true);

              this.user.admin = true;
              this.storage.setItem('user', this.user);
            }
            else {
              alert(response['msg']);
            }
        });
      }
      else {
        alert(response['msg']);
      }
    });
  }

  register() {
    this.router.navigateByUrl('/register');
  }

  resetPass() {
    this.router.navigateByUrl('/resetpass');
  }

}
