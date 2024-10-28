import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Route } from 'src/app/Models/route';

@Injectable({
  providedIn: 'root',
})
export class SearchLocationService {
  private fromQuery: string = '';
  private toQuery: string = '';

  private locations: Route[] = [
    // Avenues
    { id: 1, name: '1st Avenue', type: 'Avenue', buses: ['Bus 12', 'Bus 15'], latitude: 6.460983, longitude: 3.287857 },
    { id: 2, name: '2nd Avenue', type: 'Avenue', buses: ['Bus 20', 'Bus 25'], latitude: 6.459011, longitude: 3.289167 },
    { id: 3, name: '3rd Avenue', type: 'Avenue', buses: ['Bus 30', 'Bus 35'], latitude: 6.458500, longitude: 3.290177 },
    { id: 4, name: '4th Avenue', type: 'Avenue', buses: ['Bus 10', 'Bus 15'], latitude: 6.457920, longitude: 3.291867 },
    { id: 5, name: '5th Avenue', type: 'Avenue', buses: ['Bus 21', 'Bus 22'], latitude: 6.457055, longitude: 3.293179 },
    { id: 6, name: '6th Avenue', type: 'Avenue', buses: ['Bus 40', 'Bus 45'], latitude: 6.456410, longitude: 3.294789 },
    { id: 7, name: '7th Avenue', type: 'Avenue', buses: ['Bus 50', 'Bus 55'], latitude: 6.455720, longitude: 3.296012 },
    { id: 8, name: '8th Avenue', type: 'Avenue', buses: ['Bus 60', 'Bus 65'], latitude: 6.454501, longitude: 3.297678 },
    { id: 9, name: '9th Avenue', type: 'Avenue', buses: ['Bus 70', 'Bus 75'], latitude: 6.453810, longitude: 3.299290 },
    { id: 10, name: '10th Avenue', type: 'Avenue', buses: ['Bus 80', 'Bus 85'], latitude: 6.452700, longitude: 3.301056 },
    { id: 20, name: 'Bola Ahmed Tinubu Avenue', type: 'Avenue', buses: ['Bus 20', 'Bus 25'], latitude: 6.452800, longitude: 3.317100 },
    { id: 21, name: 'Bola Ige Avenue', type: 'Avenue', buses: ['Bus 30', 'Bus 35'], latitude: 6.451900, longitude: 3.318500 },
  
    // Closes
    { id: 11, name: '1st Close', type: 'Close', buses: ['Bus 5', 'Bus 10'], latitude: 6.460300, longitude: 3.302100 },
    { id: 12, name: '2nd Close', type: 'Close', buses: ['Bus 12', 'Bus 14'], latitude: 6.459200, longitude: 3.303700 },
    { id: 13, name: '3rd Close', type: 'Close', buses: ['Bus 30', 'Bus 32'], latitude: 6.458900, longitude: 3.305600 },
    { id: 14, name: '4th Close', type: 'Close', buses: ['Bus 40', 'Bus 45'], latitude: 6.458300, longitude: 3.307100 },
    { id: 15, name: '5th Close', type: 'Close', buses: ['Bus 20', 'Bus 25'], latitude: 6.457700, longitude: 3.309000 },
    { id: 25, name: 'Egbeada Close', type: 'Close', buses: ['Bus 12', 'Bus 16'], latitude: 6.457230, longitude: 3.311045 },
    { id: 26, name: 'Fola Osibo Close', type: 'Close', buses: ['Bus 25', 'Bus 29'], latitude: 6.456890, longitude: 3.312115 },
    { id: 47, name: 'Zahra Close', type: 'Close', buses: ['Bus 10', 'Bus 11'], latitude: 6.456540, longitude: 3.313670 },
    { id: 52, name: 'Salau Close', type: 'Close', buses: ['Bus 20', 'Bus 25'], latitude: 6.456345, longitude: 3.315004 },
    { id: 53, name: 'Odunfa Close', type: 'Close', buses: ['Bus 32', 'Bus 35'], latitude: 6.455970, longitude: 3.316200 },
  
    // Streets
    { id: 16, name: 'Adesola Street', type: 'Street', buses: ['Bus 15', 'Bus 18'], latitude: 6.456600, longitude: 3.310700 },
    { id: 17, name: 'Adeleke Street', type: 'Street', buses: ['Bus 22', 'Bus 27'], latitude: 6.455800, longitude: 3.312400 },
    { id: 18, name: 'Alakija Street', type: 'Street', buses: ['Bus 35', 'Bus 40'], latitude: 6.454700, longitude: 3.314000 },
    { id: 19, name: 'Babajide Street', type: 'Street', buses: ['Bus 10', 'Bus 12'], latitude: 6.453900, longitude: 3.315600 },
    { id: 22, name: 'Coconut Road', type: 'Road', buses: ['Bus 40', 'Bus 42'], latitude: 6.450800, longitude: 3.320200 },
    { id: 23, name: 'Cocoa Road', type: 'Road', buses: ['Bus 50', 'Bus 55'], latitude: 6.449900, longitude: 3.322000 },
    { id: 24, name: 'Davidson Street', type: 'Street', buses: ['Bus 60', 'Bus 62'], latitude: 6.449100, longitude: 3.323400 },
    { id: 27, name: 'Giwa Street', type: 'Street', buses: ['Bus 15', 'Bus 18'], latitude: 6.448100, longitude: 3.325050 },
    { id: 28, name: 'Ibadan Street', type: 'Street', buses: ['Bus 22', 'Bus 27'], latitude: 6.447000, longitude: 3.326600 },
    { id: 29, name: 'Ibukunoluwa Street', type: 'Street', buses: ['Bus 35', 'Bus 40'], latitude: 6.446500, longitude: 3.328000 },
    { id: 30, name: 'Jibowu Street', type: 'Street', buses: ['Bus 50', 'Bus 52'], latitude: 6.445300, longitude: 3.329600 },
    { id: 31, name: 'Kolawole Street', type: 'Street', buses: ['Bus 25', 'Bus 30'], latitude: 6.444500, longitude: 3.331000 },
    { id: 32, name: 'Lagos-Apapa Expressway', type: 'Road', buses: ['Bus 70', 'Bus 72'], latitude: 6.443700, longitude: 3.332500 },
    { id: 33, name: 'Mokola Street', type: 'Street', buses: ['Bus 80', 'Bus 82'], latitude: 6.443100, longitude: 3.334000 },
    { id: 34, name: 'Niyi Adewunmi Street', type: 'Street', buses: ['Bus 18', 'Bus 21'], latitude: 6.442500, longitude: 3.335500 },
    { id: 35, name: 'Oba Oyinlola Street', type: 'Street', buses: ['Bus 12', 'Bus 16'], latitude: 6.441900, longitude: 3.337000 },
    { id: 36, name: 'Obasanjo Road', type: 'Road', buses: ['Bus 22', 'Bus 25'], latitude: 6.441200, longitude: 3.338500 },
    { id: 37, name: 'Olajide Street', type: 'Street', buses: ['Bus 35', 'Bus 38'], latitude: 6.440500, longitude: 3.340000 },
    { id: 38, name: 'Osun State Road', type: 'Road', buses: ['Bus 40', 'Bus 45'], latitude: 6.439700, longitude: 3.341500 },
    { id: 39, name: 'Queen Street', type: 'Street', buses: ['Bus 50', 'Bus 53'], latitude: 6.438900, longitude: 3.343000 },
  ];  

  
  constructor() {}

  getLocations(): Observable<Route[]>{
    return of(this.locations);
  }

  //Function to filter and search for locations
  searchLocations(query: string) {
    if (!query) return [];
    return this.locations.filter((location) =>
      location.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Method to get route details based on the location names
getRouteDetails(from: string, to: string): Route | null {
  const fromLocation = this.locations.find(location => location.name.toLowerCase() === from.toLowerCase());
  const toLocation = this.locations.find(location => location.name.toLowerCase() === to.toLowerCase());

  if (fromLocation && toLocation) {
    // Create a new Route object based on the found locations
    return {
      id: fromLocation.id, // or a new unique id if you prefer
      name: `${from} to ${to}`,
      type: 'Route', // Set the type as desired
      buses: [...fromLocation.buses, ...toLocation.buses], // Combine buses from both locations
      latitude: (fromLocation.latitude),
      longitude: (fromLocation.longitude),
      fromLatitude: (fromLocation.latitude),
      fromLongitude: (fromLocation.longitude),
      toLatitude: (fromLocation.latitude),
      toLongitude: (fromLocation.longitude)
    };
  }

  return null; // Return null if either location is not found
}

  
}
