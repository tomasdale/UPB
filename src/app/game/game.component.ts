import { OnInit, Component, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { BoardComponent } from '../board/board.component';

@Component({
  selector: "app-game",
  template: `
    <div class="input-group">
      <select class="custom-select" [(ngModel)]="selectedOption">
        <option selected disabled hidden>
          Board size:
        </option>
        <option [value]="size" *ngFor="let size of boardoptions"
          >{{ size }}x{{ size }}
        </option>
      </select>
      <button (click)="newGame()">Play the game</button>
    </div>
    <router-outlet></router-outlet>
  `,
  styleUrls: ["./game.component.css"]
})
export class GameComponent implements OnInit {
  private boardoptions = [4, 5, 6, 7, 8, 9, 10, 11, 12];
  private selectedOption = "Board size:";
  private size: number;
  private htmlText: string[];
  
  constructor(private router: Router) {}
  ngOnInit() {}
  
  newGame() {
    this.size = +this.selectedOption;

    this.router.navigateByUrl("/play");
  }
  getSize(): number {
    return this.size;
  }

}
