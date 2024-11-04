import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SearchLocationService } from '../Services/searchLocation/search-location.service';
import { Observable } from 'rxjs';
import { Bus } from '../Models/bus';
import { Route } from '../Models/route';

@Component({
  selector: 'app-bus-list',
  templateUrl: './bus-list.component.html',
  styleUrls: ['./bus-list.component.css']
})
export class BusListComponent implements OnInit {
location$!: Observable<Bus[]>
filteredLocation: Bus[] = [];
inputQuery: string = '';

locationSuggestionsFrom: Array<{ name: string; type: string; }> = []; 


searchResults: Array<{ start: string; end: string; expectedArrival: string; expectedDropOff: string; duration: string; }> = [];


@ViewChild('input', { static: false }) input!: ElementRef<HTMLInputElement>;


  constructor(private searchLocationService: SearchLocationService) {}

  ngOnInit(): void {
    this.location$ = this.searchLocationService.getLocations();
  }

  onCancelClicked(){
    this.inputQuery = '';
  }
  onSearch(query: string){
    this.inputQuery = query;
    if(!query) {
      this.filteredLocation = [];
    }

    this.location$.subscribe((location) => {
      this.filteredLocation = location.filter(location =>
        location.buses.some(bus => bus.toLowerCase().includes(query.toLowerCase()))
      )
    })
  }
}
