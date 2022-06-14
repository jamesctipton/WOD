import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { User } from '../user';

@Component({
  selector: 'app-usermeta',
  templateUrl: './usermeta.page.html',
  styleUrls: ['./usermeta.page.scss'],
})
export class UsermetaPage implements OnInit {

  constructor(
    private router: Router,
    private storage: StorageService,
    private http: HttpClient,
  ) { }

  user: User = {
    name: '',
    username: '',
    email: '',
    admin: false
  };

  ngOnInit() {
    // depricated but maybe still usefull later
    // let options = {
    //   headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
    //   // withCredentials: true,
    //   Origin: 'https://wateroil.itongue.cn'
    // }

    // this.http
    // .get('https://wateroil.itongue.cn/user', options)
    // .subscribe(response => {
    //     console.log(response);
    //     if(response['status'] == 0) {
    //       this.router.navigateByUrl('/home');
    //     }
    //     else {
    //       alert(response['msg']);
    //     }
    // });

    this.storage.getItem('user').then((val) => {
      this.user = val;
    });

  }

  back() {
    this.router.navigate(['menu']);
  }
}
