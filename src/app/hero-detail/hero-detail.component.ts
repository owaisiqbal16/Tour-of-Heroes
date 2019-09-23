import { Component, OnInit, Input } from '@angular/core';
import { Hero } from '../hero';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { HeroService } from '../hero.service';
import {PowerService} from '../power.service';
import {CostumeService} from '../costume.service';
import {Power} from '../power';
import {heroPower} from '../heroPower';
import {Costume} from '../costume';


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
  costumes : Costume[];
  heroCostume : Costume[];

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

  getCostumes(): void {
    this.costumeService.getCostumes()
      .subscribe(costumes => this.costumes = costumes);
  }

  getHeroCostume() : void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.costumeService.getHeroCostume(id)
      .subscribe(heroCostume => this.heroCostume = heroCostume);
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
    private location: Location
  ) { }

  ngOnInit() {
    this.getHero();
    this.getPowers();
    this.getHeroPowers();
    this.getCostumes();
    this.getHeroCostume();
  }

  goBack(): void {
    this.location.back();
  }

}
