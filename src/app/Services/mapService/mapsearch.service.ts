import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsearchService {
  private searchUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=';
  private map!: any;
  constructor(private http: HttpClient) { }

  //Function to Initialize the Map
  initMap(){
    this.map = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13
    });

    //Adding a satellite tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.map);
  }

  
// Hybrid map
// private initMap(){
//   this.map = L.map('map', {
//       center: [51.505, -0.09],
//       zoom: 13
//   });

//   // Adding a hybrid tile layer
//   L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
//       maxZoom: 19,
//       attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, NOAA'
//   }).addTo(this.map);
// }



  //Function to get the user's current location
  getCurrentLocation(){
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
  // Function to search for a location on the  map
  searchLocation(query: string): Observable<any>{
    return this.http.get(`${this.searchUrl}${query}`).pipe(
      map((result) => result)
    )
  }
}
