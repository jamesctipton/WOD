import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap, Data } from '@angular/router';
import { Globals } from '../globals';

declare const mapkit: any;

@Component({
  selector: 'app-sample',
  templateUrl: './sample.page.html',
  styleUrls: ['./sample.page.scss'],
  providers: [ Globals ]
})
export class SamplePage implements OnInit {
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public global: Globals,
    ) { 
   }


  datum: Data = {
    id : '',
    gps : '',
    path : '',
    notes : '',
    result : 0,
    tags : '',
    date : ''
  }

  source: string = '';

  ngOnInit() {

    // initialize the mapkit API before anything
    const tokenID = this.global.token;
      mapkit.init({     
        authorizationCallback: function(done) {         
          done(tokenID);     
    } }); 

    // grab the ID parameter passed through routing from the history page
    var id = this.route.snapshot.paramMap.get('id');
    // grab source that we routed from to get to the sample page for the back button
    this.source = this.route.snapshot.paramMap.get('source');
    // grab data from source page
    this.datum = JSON.parse(this.route.snapshot.paramMap.get('datum'));
  }

  mapInit() {

    var gps=this.datum.gps;
      
    var MarkerAnnotation = mapkit.MarkerAnnotation, clickAnnotation;
    var photo = new mapkit.Coordinate(parseFloat(gps.replace(' ','').split(',')[0]), parseFloat(gps.replace(' ','').split(',')[1]));
      
    var map = new mapkit.Map("map", { center: photo });
      
    var photoAnnotation = new MarkerAnnotation(photo, { color: "#f4a56d", title: "Photo ID: " + this.datum.id , selected: true});
    
    map.showItems([photoAnnotation]);
      
    // Drop an annotation where a Shift-click is detected:
    map.element.addEventListener("click", function(event) {
      if(!event.shiftKey) {
        return;
      }
    
      if(clickAnnotation) {
        map.removeAnnotation(clickAnnotation);
      }
    
      var coordinate = map.convertPointOnPageToCoordinate(new DOMPoint(event.pageX, event.pageY));
      clickAnnotation = new MarkerAnnotation(coordinate, {
        title: "",
        color: "#c969e0"
      });
      map.addAnnotation(clickAnnotation);
    });
  }

  back() {
    this.router.navigate([this.source]);
  }

}

// ui things                                    - 
// predictor tab                                - no backend
// update upload page to handle multiple images - yes
      // display files uploaded better          - 
// add all fields to admin info editing         - yes
      // open map and drop pin?                 - still needed


// search twice in a row
// search empty strings