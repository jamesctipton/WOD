import { getLocaleMonthNames } from '@angular/common';
import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularDelegate } from '@ionic/angular';
import { RegisterPageModule } from './register.module';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Globals } from '../globals';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  providers: [ Globals ]
})
export class RegisterPage implements OnInit {

  constructor(
    private router: Router,
    public global: Globals,
    private http: HttpClient
  ) {  }

  ngOnInit () {  }

  submit() {
    var user_text = (<HTMLInputElement>document.getElementById("user")).value;
    var pass_text = (<HTMLInputElement>document.getElementById("pass")).value;
    var email = (<HTMLInputElement>document.getElementById("email")).value;
    var name = (<HTMLInputElement>document.getElementById("name")).value;

    var params = 'username='+ user_text +'&password='+ pass_text +'&email='+ email +'&name='+ name;

    var url = 'https://wateroil.itongue.cn/register';

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      // withCredentials: true,
      Origin: 'https://wateroil.itongue.cn'
    }

    this.http
    .post(url, params , options)
    .subscribe(response => {
        console.log(response);
        if(response['status'] == 0) {
          console.log(document.cookie);
          this.router.navigateByUrl('/home');
        }
        else {
          alert(response['msg']);
        }
    });
  
  }

  public goHome(): void {
    this.router.navigateByUrl('/home');
  }

}