import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Globals } from '../globals';

@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.page.html',
  styleUrls: ['./resetpass.page.scss'],
  providers: [ Globals ]
})
export class ResetpassPage implements OnInit {

  constructor(
    private router: Router,
    public global: Globals,
    private http: HttpClient
  ) { }

  ngOnInit() {
  }

  submit() {
    var user_text = (<HTMLInputElement>document.getElementById("user")).value;
    var pass_text = (<HTMLInputElement>document.getElementById("pass")).value;
    var email = (<HTMLInputElement>document.getElementById("email")).value;

    var params = 'username='+ user_text +'&password='+ pass_text +'&email='+ email;

    var url = 'https://wateroil.itongue.cn/resetpassword';

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
