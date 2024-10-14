import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { MapsearchService } from '../Services/Map_Service/mapsearch.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
 private map: any;
 
 @ViewChild('searchInput') searchInput!: ElementRef;

 searchQuery: string = '';


 nearbyBusStops = [
  { name: 'Bus Stop 1', availableBuses: 3 },
  { name: 'Bus Stop 2', availableBuses: 5 },
  { name: 'Bus Stop 3', availableBuses: 2 },
  { name: 'Bus Stop 4', availableBuses: 4 },
  { name: 'Bus Stop 5', availableBuses: 1 }
];
  constructor(private mapService: MapsearchService, private router: Router) {}

  ngOnInit() {
    this.initMap();
    this.getCurrentLocation();
  }
  

  //Initialize the map
  // Satelite map
//   private initMap(){
//     this.map = L.map('map', {
//         center: [51.505, -0.09],
//         zoom: 13
//     });

//     // Adding a satellite tile layer
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//         maxZoom: 19,
//         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     }).addTo(this.map);
// }

// Hybrid map
private initMap(){
  this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13
  });

  // Adding a hybrid tile layer
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, NOAA'
  }).addTo(this.map);
}


   // Get the user's current location
   private getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
         const defaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
          shadowSize: [41, 41]
        });

        // Setting marker at user's current location
        const userLocation = L.marker([latitude, longitude], { icon: defaultIcon }).addTo(this.map);
        userLocation.bindPopup('You are here!').openPopup();

        this.map.setView([latitude, longitude], 13);
      });
    } else {
      alert('Geolocation is not supported by your browser');
    }
  }


  //Search Location in the map
  searchLocation(searchText: string) {
    this.mapService.searchLocation(searchText).subscribe(location => {
      const {lat, lon} = location[0];
      const searchMarker = L.marker([lat, lon]).addTo(this.map)
      this.map.setView([lat, lon], 13);
    })
  }


   // Function to navigate to the search page after typing 3 or more letters on the search input on the home page
   onSearch(event: Event){
    const InputElement = event.target as HTMLInputElement;
    this.searchQuery = InputElement.value;

    // I am now checking if the input contains 3 or more words
    const words = this.searchQuery.trim();
    if(words.length >= 3){
      this.navigateToSearch();
    }
  }

   // Method to navigate to search page when the button is clicked
   onSearchClickButton(): void {
    this.searchQuery = this.searchInput.nativeElement.value;
    this.navigateToSearch();
  }

  // Navigation method
  private navigateToSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { query: this.searchQuery } });
    }
  }
}
