import { Component, OnInit } from '@angular/core';
import { Power } from '../power';
import { PowerService } from '../power.service';

@Component({
  selector: 'app-powers',
  templateUrl: './powers.component.html',
  styleUrls: ['./powers.component.css']
})
export class PowersComponent implements OnInit {

  constructor(private powerService: PowerService) { }

  ngOnInit() {
    this.getPowers();
  }

  powers: Power[];

  getPowers(): void {
    this.powerService.getPowers()
      .subscribe(powers => this.powers = powers);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.powerService.addPower({ name } as Power)
      .subscribe(power => {
        this.powers.push(power);
        this.getPowers();
      });
  }

  delete(power: Power): void {
    this.powers = this.powers.filter(h => h !== power);
    this.powerService.deletePower(power).subscribe();
  }

}
