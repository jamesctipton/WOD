import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Globals } from '../globals';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.page.html',
  styleUrls: ['./predictor.page.scss'],
  providers: [ Globals ]
})
export class PredictorPage implements OnInit {

  constructor(
    private router: Router,
    public global: Globals,
  ) { }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['menu']);
  }

}
