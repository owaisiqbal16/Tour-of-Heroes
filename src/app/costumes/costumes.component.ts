import { Component, OnInit } from '@angular/core';
import { Costume } from '../costume';
import { CostumeService } from '../costume.service';


@Component({
  selector: 'app-costumes',
  templateUrl: './costumes.component.html',
  styleUrls: ['./costumes.component.css']
})
export class CostumesComponent implements OnInit {

  constructor(private costumeService: CostumeService) { }

  ngOnInit() {
    this.getCostumes();
  }

  costumes : Costume[];

  getCostumes(): void {
    this.costumeService.getCostumes()
      .subscribe(costumes => this.costumes = costumes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.costumeService.addCostume({ name } as Costume)
      .subscribe(costume => {
        this.costumes.push(costume);
        this.getCostumes();
      });
  }

  delete(costume: Costume): void {
    this.costumes = this.costumes.filter(h => h !== costume);
    this.costumeService.deleteCostume(costume).subscribe();
  }

}

