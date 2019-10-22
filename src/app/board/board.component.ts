import { Component, OnInit } from "@angular/core";
import { GameComponent } from "../game/game.component";
import { Router, NavigationEnd } from "@angular/router";
import { isUndefined } from "util";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.css"]
})
export class BoardComponent implements OnInit {
  navigationSubscription;
  private size: number;
  private board: Cell[][] = Array();
  private moveController: MoveController;

  constructor(private gameComponent: GameComponent, private router: Router) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.newGame();
      }
    });
  }
  newGame(): void {
    while (this.board.pop()) {}
    this.createBoard();
  }
  ngOnInit() {
    this.createBoard();
  }

  createBoard() {
    this.size = this.gameComponent.getSize();
    for (let x = 0; x < this.size; x++) {
      this.board[x] = [];
      for (let y = 0; y < this.size; y++) {
        let piece = this.ifTwoFirstOrLastCellCreatePiece(x);
        let background = this.ifSumOddReturnTrue(x, y) ? "black" : "white";
        let cell = piece
          ? new Cell(x, y, background, piece)
          : new Cell(x, y, background);
        this.board[x][y] = cell;
      }
    }
    this.moveController = new MoveController(this.board);
  }

  ifSumOddReturnTrue(x: Number, y: Number) {
    let isOdd = (+x + +y) % 2 === 0 ? false : true;
    return isOdd;
  }

  ifTwoFirstOrLastCellCreatePiece(x: number) {
    let piece =
      x == 0 || x == 1
        ? new Piece(0)
        : x == this.size - 1 || x == this.size - 2
        ? new Piece(1)
        : false;
    return piece;
  }

  ifNotSizeReturnToHome() {
    return isUndefined(this.size) ? this.router.navigateByUrl("/") : true;
  }

  makeMove(cell: Cell) {
    this.moveController.controller(cell);
  }
}

export class Cell {
  public id: string;
  public el: HTMLElement;
  public isPossibleMove = false;

  constructor(
    public x: number,
    public y: number,
    public background: string,
    public piece?: Piece
  ) {
    this.id = x.toString() + y.toString();
  }
  getInvertBackground() {
    let background = this.background === "black" ? "white" : "black";
    return background;
  }
  defineMove() {
    return this.piece ? this.piece.getMoveDirection(this) : null;
  }
  addPiece(piece: Piece) {
    this.piece = piece;
  }
  removePiece() {
    this.piece = null;
  }
  querySelector(elem: string) {}
}

class Piece {
  public pieceType: string;
  constructor(private type: number) {
    this.pieceType = type === 1 ? "white" : "black";
  }
  getMoveDirection(cell: Cell) {
    let x =
      this.pieceType === "white"
        ? this.rookPlay(cell.x)
        : this.queenPlay(cell.x);
    return x;
  }

  rookPlay(x: number) {
    return x - 1;
  }

  queenPlay(x: number) {
    return x + 1;
  }
}

class MoveController {
  private initialCell: Cell;
  private clickedCell: Cell;
  private gameOver: boolean;
  private playTime: string;
  private possibleMoves: Cell[];

  constructor(private board: Cell[][]) {
    this.gameOver = false;
    this.playTime = "white";
  }

  controller(clickedCell: Cell) {
    this.clickedCell = clickedCell;
    if (!this.gameOver) {
      this.changeStyleOnMoveCells();
      if (this.possibleMoves && this.isClickInPossibleMoves()) {
        this.secondClickToMove();
        this.possibleMoves = null;
      } else if (this.isPieceAndRightPlayer()) {
        this.initialCell = this.clickedCell;
        this.definePossibleMoves();
      }
      this.changeStyleOnMoveCells();
    } else {
      alert("please start a new game");
    }
  }

  definePossibleMoves() {
    let x = this.clickedCell.defineMove();

    let y = this.clickedCell.y;
    let first = this.isDiagonalMoveValid(x, y-1);
    let second = !this.board[x][y].piece ? this.board[x][y] : null;
    let third = this.isDiagonalMoveValid(x, y+1);
    this.possibleMoves = [first, second, third];
  }

  isDiagonalMoveValid(x: number,y: number){
    let isValid = this.board[x][y]
      ? this.board[x][y].piece &&
        this.board[x][y].piece.pieceType ===
          this.clickedCell.piece.pieceType
        ? null
        : this.board[x][y]
      : this.board[x][y]
    return isValid;
  }

  changeStyleOnMoveCells() {
    for (let pos in this.possibleMoves) {
      if (this.possibleMoves[pos]) {
        this.possibleMoves[pos].isPossibleMove =
          this.possibleMoves[pos].isPossibleMove === false ? true : false;
      }
    }
  }

  secondClickToMove() {
    this.clickedCell.addPiece(this.initialCell.piece);
    this.initialCell.removePiece();
    this.checkEnd();
  }
  changePlayer() {
    this.playTime = this.playTime == "black" ? "white" : "black";
  }
  isPieceAndRightPlayer() {
    if (this.clickedCell.piece) {
      return this.clickedCell.piece.pieceType === this.playTime;
    } else {
      return false;
    }
  }
  isClickInPossibleMoves() {
    return this.possibleMoves.find(x =>
      x ? this.clickedCell.id == x.id : false
    );
  }

  checkEnd() {
    let move = this.clickedCell.defineMove();
    let lastPlayer = this.playTime;
    this.changePlayer();

    console.log(lastPlayer);
    if (!this.board[move]) {
      this.grandFinalle(lastPlayer);
    } else {
      console.log(lastPlayer);
      let isMoves = false;
      for (let x in this.board) {
        for (let y in this.board[x]) {
          this.clickedCell = this.board[x][y];
          if (
            this.clickedCell.piece &&
            this.clickedCell.piece.pieceType === lastPlayer
          ) {
            this.definePossibleMoves();
          }
          for (let pos in this.possibleMoves) {
            if (this.possibleMoves[pos]) {
              isMoves = true;
              console.log(this.possibleMoves);
            }
          }
        }
      }
      !isMoves ? this.grandFinalle(lastPlayer) : true;
    }
  }

  grandFinalle(player: string) {
    this.gameOver = true;
    alert("That's it folks! Winner is " + player);
  }
}
