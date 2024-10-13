import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsearchService {
  private searchUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=';

  constructor(private http: HttpClient) { }

  // Function to search for a location on the  map
  searchLocation(query: string): Observable<any>{
    return this.http.get(`${this.searchUrl}${query}`).pipe(
      map((result) => result)
    )
  }
}
