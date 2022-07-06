import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpParams, HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { StorageService } from '../storage.service';
import { CookieService } from '../cookie.service';
import { User } from '../user';
import { Globals } from '../globals';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [ Globals ]
})
export class HomePage implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient,
    public global: Globals,
    private storage: StorageService,
    private cookie: CookieService
  ) {}

  user: User;

  ngOnInit() {
  }

  login() {
    var user_text = (<HTMLInputElement>document.getElementById("user")).value;
    var pass_text = (<HTMLInputElement>document.getElementById("pass")).value;

    let params = 'username='+ user_text +'&password='+ pass_text;

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      withCredentials: true,
    };

    this.http
    .post(this.global.url + '/login', params , options)
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
        this.storage.setItem('adminLog', false);
        this.router.navigate(['/menu']);
        // test to see if account is admin as well.
        this.http
        .post('https://wateroil.itongue.cn/adminlogin', params , options)
        .subscribe(response => {
          console.log(response);
          if(response['status'] == 0) {
            this.user.admin = true;
            this.storage.setItem('user', this.user);
            this.storage.setItem('adminLog', true);
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
