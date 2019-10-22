import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { RouterModule, Routes } from "@angular/router";
import { GameComponent } from "./game/game.component";
import { BoardComponent } from "./board/board.component";

const appRoutes: Routes = [
  { path: "play", component: BoardComponent, runGuardsAndResolvers: "always" },
  { path: "game", component: GameComponent }
];
@NgModule({
  declarations: [AppComponent, GameComponent, BoardComponent],
  imports: [
    RouterModule.forRoot(appRoutes, {
      enableTracing: true,
      onSameUrlNavigation: "reload"
    }),
    BrowserModule,
    FormsModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
