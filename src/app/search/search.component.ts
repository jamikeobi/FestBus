import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchLocationService } from '../Services/searchLocation/search-location.service';
import { Route } from '../Models/route';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  routeModel!: Route[];
  fromQuery: string = '';
  toQuery: string = '';
  searchResults: Array<{ start: string; end: string; expectedArrival: string; expectedDropOff: string; duration: string; }> = [];
  locationSuggestionsFrom: Array<{ name: string; type: string; }> = [];
  locationSuggestionsTo: Array<{ name: string; type: string; }> = [];
  isSidebarOpen: boolean = false;

  @ViewChild('fromInput', { static: false }) fromInput!: ElementRef<HTMLInputElement>;
  @ViewChild('toInput', { static: false }) toInput!: ElementRef<HTMLInputElement>;

  constructor(private route: ActivatedRoute, private router: Router) {}

  searchLocationService: SearchLocationService = inject(SearchLocationService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.fromQuery = params['query'];
      if (this.fromInput) this.fromInput.nativeElement.value = this.fromQuery;
    });
    this.loadRecentSearches();
  }

  OnFromInputChange() {
    this.locationSuggestionsFrom = this.searchLocationService.searchLocations(this.fromInput.nativeElement.value);
  }

  OnToInputChange() {
    this.locationSuggestionsTo = this.searchLocationService.searchLocations(this.toInput.nativeElement.value);
  }

  selectLocation(type: 'from' | 'to', name: string) {
    if (type === 'from') {
      this.fromQuery = name;
      this.fromInput.nativeElement.value = name;
      this.locationSuggestionsFrom = [];
    } else {
      this.toQuery = name;
      this.toInput.nativeElement.value = name;
      this.locationSuggestionsTo = [];
    }
    this.onSearch();
  }

  onSearch() {
    const fromQuery = this.fromInput.nativeElement.value.trim();
    const toQuery = this.toInput.nativeElement.value.trim();
  
    if (fromQuery.length > 1 && toQuery.length > 1) {
      this.router.navigate(['/route'], { queryParams: { query1: fromQuery, query2: toQuery }});
  
      const now = new Date(); 
      const durationInMinutes = Math.floor(Math.random() * 60) + 15;
      const expectedArrival = new Date(now.getTime() + durationInMinutes * 60000).toLocaleTimeString();
      const expectedDropOff = new Date(now.getTime() + (durationInMinutes + 5) * 60000).toLocaleTimeString();
  
      const result = {
        start: fromQuery,
        end: toQuery,
        expectedArrival: expectedArrival,
        expectedDropOff: expectedDropOff,
        duration: `${durationInMinutes} minutes`
      };
  
      this.saveSearchQuery(result);
      this.loadRecentSearches();
  
      const routeDetails = this.searchLocationService.getRouteDetails(fromQuery, toQuery);
      if (routeDetails) {
        this.storeRouteDetails(routeDetails);
      }
    } else {
      console.error("Invalid input: both 'from' and 'to' locations must have more than one character.");
    }
  }

  storeRouteDetails(route: Route) {
    localStorage.setItem('routeDetails', JSON.stringify(route));
  }

  saveSearchQuery(result: { start: string; end: string; expectedArrival: string; expectedDropOff: string; duration: string; }): void {
    let searches = JSON.parse(localStorage.getItem('searchResults') || '[]');
    searches.push(result);
    localStorage.setItem('searchResults', JSON.stringify(searches));
  }

  loadRecentSearches(): void {
    this.searchResults = JSON.parse(localStorage.getItem('searchResults') || '[]');
  }

  clearSearchHistory(): void {
    localStorage.removeItem('searchResults');
    this.searchResults = [];
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  removeSearchQuery(index: number): void {
    let searches = JSON.parse(localStorage.getItem('searchResults') || '[]');
    searches.splice(index, 1);
    localStorage.setItem('searchResults', JSON.stringify(searches));
    this.loadRecentSearches();
  }

  navigateUsingStoredQueries(index: number) {
    const query = this.searchResults[index];
    this.router.navigate(['/route'], {
      queryParams: { query1: query.start, query2: query.end }
    });
  }

  clearInput(): void {
    this.fromQuery = '';
    this.toQuery = '';
  }
}
