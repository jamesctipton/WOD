import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-adminlist',
  templateUrl: './adminlist.page.html',
  styleUrls: ['./adminlist.page.scss'],
})
export class AdminlistPage implements OnInit {

  constructor(
    private router: Router,
    private storage: StorageService
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.init();
  }

  ngOnInit() {
  }

  clear() {
    this.storage.clear();
    this.storage.length = 0;
  }

  back() {
    this.router.navigate(['menu']);
  }

}
