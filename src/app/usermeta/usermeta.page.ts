import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usermeta',
  templateUrl: './usermeta.page.html',
  styleUrls: ['./usermeta.page.scss'],
})
export class UsermetaPage implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
      // withCredentials: true,
      Origin: 'https://wateroil.itongue.cn'
    }

    this.http
    .get('https://wateroil.itongue.cn/user', options)
    .subscribe(response => {
        console.log(response);
        if(response['status'] == 0) {
          this.router.navigateByUrl('/home');
        }
        else {
          alert(response['msg']);
        }
    });

  }

  back() {
    this.router.navigate(['menu']);
  }
}
