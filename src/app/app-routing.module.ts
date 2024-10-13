import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusListComponent } from './bus-list/bus-list.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { RouteComponent } from './route/route.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {path: 'home', component: HomeComponent},
  { path: 'buses', component: BusListComponent },
  {path: 'search', component: SearchComponent},
  {path: 'route', component: RouteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
