import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  fromQuery: string = ''; 
  toQuery: string = ''; 
  searchResults: Array<{ start: string; end: string; expectedArrival: string; expectedDropOff: string; duration: string; }> = [];
  isSidebarOpen: boolean = false; // To manage sidebar state

  @ViewChild('fromInput') fromInput!: ElementRef;
  @ViewChild('toInput') toInput!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.loadRecentSearches();
  }

  onSearch() {
    this.fromQuery = this.fromInput.nativeElement.value.trim();
    this.toQuery = this.toInput.nativeElement.value.trim();

    if (this.fromQuery.length > 1 && this.toQuery.length > 1) {
      const now = new Date();
      const durationInMinutes = Math.floor(Math.random() * 60) + 15;
      const expectedArrival = new Date(now.getTime() + durationInMinutes * 60000).toLocaleTimeString();
      const expectedDropOff = new Date(now.getTime() + (durationInMinutes + 5) * 60000).toLocaleTimeString();

      const result = {
        start: this.fromQuery,
        end: this.toQuery,
        expectedArrival: expectedArrival,
        expectedDropOff: expectedDropOff,
        duration: `${durationInMinutes} minutes`
      };

      this.saveSearchQuery(result);
      this.loadRecentSearches();
    }
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

  removeSearchQuery(index: number) {
    let searches = JSON.parse(localStorage.getItem('searchResults') || '[]');
    searches.splice(index, 1);
    localStorage.setItem('searchResults', JSON.stringify(searches));
    this.loadRecentSearches();
  }

  clearInput() {
    this.fromQuery = '';
    this.toQuery = '';
    this.fromInput.nativeElement.value = '';
    this.toInput.nativeElement.value = '';
  }

  useCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.fromQuery = `Current Location (${latitude}, ${longitude})`;
        this.fromInput.nativeElement.value = this.fromQuery; // Set the input value
      }, (error) => {
        console.error('Error getting location', error);
        alert('Unable to retrieve your location. Please try again.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  // Method to toggle the sidebar visibility
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

   // Listen for clicks outside the sidebar
  //  @HostListener('document:click', ['$event'])
  //  handleClick(event: MouseEvent) {
  //    const sidebar = document.getElementById('sidebar');
  //    const toggleBtn = document.getElementById('toggleSidebarBtn');
 
  //    // Check if the clicked target is not the sidebar or the toggle button
  //    if (sidebar && toggleBtn && !sidebar.contains(event.target as Node) && !toggleBtn.contains(event.target as Node)) {
  //      this.isSidebarOpen = false;
  //    }
  //  }
 
}
