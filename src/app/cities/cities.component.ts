import { Component, OnInit } from '@angular/core';
import { City } from '../city';
import { CityService } from '../city.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {

  constructor(private cityService: CityService) { }

  ngOnInit() {
    this.getCities();
  }

  cities : City[];

  getCities(): void {
    this.cityService.getCities()
      .subscribe(cities => this.cities = cities);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.cityService.addCity({ name } as City)
      .subscribe(city => {
        this.cities.push(city);
        this.getCities();
      });
  }

  delete(city: City): void {
    this.cities = this.cities.filter(h => h !== city);
    this.cityService.deleteCostume(city).subscribe();
  }

}


