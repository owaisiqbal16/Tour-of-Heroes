import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { PowersComponent } from './powers/powers.component';
import { CostumesComponent } from './costumes/costumes.component';
import { CitiesComponent } from './cities/cities.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'heroes', component: HeroesComponent },
  { path: 'dashboard' , component: DashboardComponent },
  { path : 'details/:id' , component : HeroDetailComponent },
  { path : 'powers' , component : PowersComponent },
  { path : 'costumes', component : CostumesComponent },
  { path : 'cities', component : CitiesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
