import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-predictor',
  templateUrl: './predictor.page.html',
  styleUrls: ['./predictor.page.scss'],
})
export class PredictorPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['menu']);
  }

}
