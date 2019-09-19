import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import {PowerService} from '../power.service';
import {Power} from '../power';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero: Hero;
  powers: Power[];
  heroPowers : Power[];

  getHero(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero)
  }

  getPowers(): void {
    this.powerService.getPowers()
      .subscribe(powers => this.powers = powers);
  }

  getHeroPowers() : void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.powerService.getHeroPowers(id)
      .subscribe(heroPowers => this.heroPowers = heroPowers);
  }

  addPowerToHero(power: Power): void {
    console.log("clicked in add power func")
    const id = +this.route.snapshot.paramMap.get('id');
    const data = {
      power_id : power.id,
      hero_id : id
    }
    // console.log("Hero id is " + id);
    // console.log("Power id is " + power.id)
    if (!power) { 
      console.log("no power given")
      return; }
    this.powerService.addPowerToHero(data)
      .subscribe(power => {
        console.log("power is" + power)
        // this.powers.push(power);
        // this.heroPowers.push(power)
        // this.getPowers();
        // this.getHeroPowers();
      });
  }
  
  save(): void {
    this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
  }

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private powerService : PowerService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getHero();
    this.getPowers();
    this.getHeroPowers();
  }

  goBack(): void {
    this.location.back();
  }

}
