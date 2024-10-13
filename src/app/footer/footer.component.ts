// footer.component.ts
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  showRoutes: boolean = false; // Property to track if routes should be visible or hidden
  isSmallScreen: boolean = false; // Property to track if the screen size is small
  currentRoute: string = 'home'; // Property to track the current route

  constructor(private router: Router) {
    // Listen to route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects; // Get the current route
      }
    });
  }

  ngOnInit() {
    this.checkScreenSize(); // Check screen size on component initialization
  }

  // Toggle the visibility of routes on small screens
  toggleRoutes(): void {
    this.showRoutes = !this.showRoutes;
  }

  // Detect screen size changes
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  // Check if the screen size is small or not
  private checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth <= 768;
  }

  // Check if a route is active based on its path
  isActiveRoute(route: string): boolean {
    return this.currentRoute.includes(route);
  }
}
