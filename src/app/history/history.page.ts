import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { IonInfiniteScroll, IonLabel } from '@ionic/angular';
import { Data } from '../data';
import { Globals } from '../globals';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  providers: [ Globals ]
})
export class HistoryPage implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  constructor(
    private router: Router,
    private http: HttpClient,
    public global: Globals
    ) {  }

  data: Data[] = [];
  page: 1;
  totalPages: number;
  options = {
    withCredentials: true,
    headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  }

  ngOnInit() {
    // css stuff to let user know if storage is empty
    this.toggleListCSS(true);

    var self = this;
    this.http
    .post(this.global.url + '/history', 'page=' + this.page, this.options)
    .subscribe(response => {
      // console.log(response);
      if(response['status'] == 0) {
        this.data = Object.values(response['msg']);
        this.data.forEach(function (item) {
          item.path = self.global.url + '/' + item.path;
        });
        // console.log(this.data);

        this.totalPages = response['meta']['total_page'];
        this.page++;
        
        // un-empty the storage css
        this.toggleListCSS(false);
      }
      else {
        alert(response['msg']);
      }
    });
  }

  toggleListCSS(toggle: boolean) {
    (<HTMLInputElement>document.getElementById("list-element")).hidden = toggle;
    (<HTMLInputElement>document.getElementById("zero-items")).hidden = !toggle;
    (toggle) ? (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "-1000" : (<HTMLInputElement>document.getElementById("list-element")).style.zIndex = "1000";
    (toggle) ? (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "1000" : (<HTMLInputElement>document.getElementById("zero-items")).style.zIndex = "-1000";
    (toggle) ? (<HTMLInputElement>document.getElementById("zero-items")).innerHTML = "No items to display." : (<HTMLInputElement>document.getElementById("zero-items")).innerHTML = "";
  }

  back() {
    this.router.navigate(['menu']);
  }

  loadData(event) {

    setTimeout(() => {
      var self = this;
      this.http
      .post(this.global.url + '/history', 'page=' + this.page, this.options)
      .subscribe(response => {
        // console.log(response);
        if(response['status'] == 0) {
          var temp: Data[] = Object.values(response['msg']);
          temp.forEach(function (item) {
            item.path = self.global.url + '/' + item.path;
          });
          this.data.concat(temp);
          // console.log(this.data);
          this.page++;
        }
        else {
          alert(response['msg']);
        }
      });

      // App logic to determine if all data is loaded
      // and disable the infinite scroll.
      if (this.page == this.totalPages) {
        event.target.disabled = true;
      }
    }, 500);

  }

  detail(item) {
    var datum = JSON.stringify(this.data.find( ({id}) => id === item));
    this.router.navigate(['/sample', {id: item, source: 'history', datum: datum}]);
  }
}