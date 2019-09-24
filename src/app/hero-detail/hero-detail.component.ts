import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import {PowerService} from '../power.service';
import {CostumeService} from '../costume.service';
import {CityService} from '../city.service';
import {Power} from '../power';
import {heroPower} from '../heroPower';
import {Costume} from '../costume';
import { City } from '../city';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero;
  powers: Power[];
  heroPowers : Power[];
  heroPower : heroPower;
  filteredPowers : Power[];
  costumes : Costume[];
  filteredCostumes : Costume[];
  heroCostume : Costume[];
  cities : City[];
  filteredCities : City[];
  filteredCities2 : City[];
  heroCity : City;

  filterPower() : void {
    this.filteredPowers = [];
    console.log(this.powers)
    console.log(this.heroPowers);
    for(var i = 0 ; i < this.powers.length ; i++) 
    {
      for(var j =0 ; j< this.heroPowers.length ; j++)
      {
        if(this.powers[i].name == this.heroPowers[j].name)
          break;
      }
      if(j == this.heroPowers.length)
      {
        this.filteredPowers.push(this.powers[i]);
      }
    }
    // this.filteredPowers.forEach(lol => {
    //   console.log(lol)
    // })
  }

  filterCostumes() : void {
    this.filteredCostumes = [];
    // console.log(this.powers)
    // console.log(this.heroPowers);
    for(var i = 0 ; i < this.costumes.length ; i++)
    if(this.heroCostume[0]) 
    {
      if(this.costumes[i].name !== this.heroCostume[0].name)
        this.filteredCostumes.push(this.costumes[i]);
    }
    else{
      this.filteredCostumes = this.costumes;
    }
  }

  filterCities() : void {
    this.filteredCities2 = [];
    console.log(this.cities)
    console.log(this.filteredCities);
    for(var i = 0 ; i < this.cities.length ; i++) 
    {
      for(var j =0 ; j< this.filteredCities.length ; j++)
      {
        if(this.cities[i].name == this.filteredCities[j].name)
          break;
      }
      if(j == this.filteredCities.length)
      {
        this.filteredCities2.push(this.cities[i]);
      }
    }
  }

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero)
  }

  getPowers(): void {
    this.powerService.getPowers()
      .subscribe(powers => {
        this.powers = powers
        this.filterPower()
      });
      
  }

  getHeroPowers() : void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.powerService.getHeroPowers(id)
      .subscribe(heroPowers => {
        this.heroPowers = heroPowers
        this.filterPower()
      });
  }

  addPowerToHero( power : Power): void {
    console.log("clicked in add power func")
    const id = +this.route.snapshot.paramMap.get('id');
    const data : heroPower = {
      power_id : power.id,
      hero_id : id
    }
    // console.log("Hero id is " + id);
    // console.log("Power id is " + power.id)
    if (!data) { 
      console.log("no power given")
      return; }
    this.powerService.addPowerToHero(data)
      .subscribe( power => {
        console.log("power is" + power)
        this.getPowers();
        this.getHeroPowers();
      });
  }
  
  deletePowerFromHero( heroPower : any): void {
    console.log(heroPower)
    // const id = +this.route.snapshot.paramMap.get('id');
    if (!heroPower) { 
      console.log("no power given to delete")
      return; }
    this.powerService.deletePowerFromHero(heroPower.id)
      .subscribe( heroPower => {
        console.log("power is" + heroPower)
        this.getPowers();
        this.getHeroPowers();
      });
  }

  save(): void {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }

  getCities(): void {
    this.cityService.getCities()
      .subscribe(cities => {
        this.cities = cities
      });
  }

  getFilteredCities() : void {
    this.cityService.getFilteredCities()
      .subscribe( fc => {
        this.filteredCities = fc;
        this.filterCities();
      })
  }

  getHeroCity() : void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.cityService.getHeroCity(id)
      .subscribe(heroCity => this.heroCity = heroCity);
  }

  addCityToHero(city : City) : void {
    console.log("clicked in add city func")
    const id = +this.route.snapshot.paramMap.get('id');
    const data = {
      city_id : city.id,
      hero_id : id
    }
    if (!data) { 
      console.log("no city given")
      return; }
    this.cityService.addCityToHero(data)
      .subscribe( costume => {
        this.getHeroCity();
        this.getFilteredCities();
        this.filterCities();
      });
  }

  deleteCityFromHero() : void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.cityService.deleteCityFromHero(id)
      .subscribe(() => {
        this.getHeroCity()
        this.getFilteredCities();
        this.filterCities()
      });
  }

  getCostumes(): void {
    this.costumeService.getCostumes()
      .subscribe(costumes => {
        this.costumes = costumes
        this.filterCostumes();
      });
  }

  getHeroCostume() : void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.costumeService.getHeroCostume(id)
      .subscribe(heroCostume => {
        this.heroCostume = heroCostume
        this.filterCostumes();
      });
  }

  addCostumeToHero(costume : Costume) : void {
    console.log("clicked in add costume func")
    const id = +this.route.snapshot.paramMap.get('id');
    const data = {
      costume_id : costume.id,
      hero_id : id
    }
    if (!data) { 
      console.log("no costume given")
      return; }
    this.costumeService.addCostumeToHero(data)
      .subscribe( costume => {
        this.getCostumes();
        this.getHeroCostume();
      });
  }

  deleteCostumeFromHero() : void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.costumeService.deleteCostumeFromHero(id)
      .subscribe(() => this.getHeroCostume());
  }

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private powerService : PowerService,
    private costumeService : CostumeService,
    private cityService : CityService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getHero();
    this.getPowers();
    this.getHeroPowers();
    this.getCostumes();
    this.getHeroCostume();
    this.getCities();
    this.getFilteredCities();
    this.getHeroCity();
    this.filterPower();
    this.filterCostumes();
  }

  goBack(): void {
    this.location.back();
  }

}
