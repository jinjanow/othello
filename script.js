let size = Math.min(innerHeight, innerWidth);
size = (size * 2) / 3;
let canvas = document.getElementById('can');
let ctx = canvas.getContext('2d');
canvas.height = size;
canvas.width = size;
ctx.fillStyle = 'grey';
ctx.fillRect(0, 0, 600, 600);
class Othello {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.size = canvasElement.height;
    this.pixcel = this.canvas.height / 8;
    this.backgroundColor = 'green';
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.order = 1;
    this.color = [null, 'black', 'white'];
    this.history = [];
    this.clickEvent = (e) => {
      this.mouseX = Math.floor(e.offsetX / this.pixcel);
      this.mouseY = Math.floor(e.offsetY / this.pixcel);
      if (0 <= this.mouseX <= 8 && 0 <= this.mouseY <= 8) {
        this.putOn(this.mouseX, this.mouseY);
        console.log(this.history);
        this.order = (() => {
          if (this.order === 1) {
            return 2;
          }
          if (this.order === 2) {
            return 1;
          }
        })();
        this.readHistry();
      }
    };
  }
  enableClickToPut() {
    this.canvas.addEventListener('click', this.clickEvent);
    return this;
  }
  disableClickToPut() {
    this.canvas.removeEventListener('click', this.clickEvent);
  }
  at(x, y) {
    if (this.board[y] === undefined) return undefined;
    return this.board[y][x];
  }
  setAt(x, y, value) {
    if (this.board[y] !== undefined) {
      if (this.board[y][x] !== undefined) {
        this.board[y][x] = value;
      }
    }
  }
  drow() {
    this.drowGrid();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j] === 1) {
          this.ctx.beginPath();
          this.ctx.fillStyle = 'black';
          this.ctx.arc(
            (j + 0.5) * this.pixcel,
            (i + 0.5) * this.pixcel,
            (this.pixcel * 2) / 5,
            0,
            Math.PI * 2
          );
          this.ctx.fill();
        } else if (this.board[i][j] === 2) {
          this.ctx.beginPath();
          this.ctx.fillStyle = 'white';
          this.ctx.arc(
            (j + 0.5) * this.pixcel,
            (i + 0.5) * this.pixcel,
            (this.pixcel * 2) / 5,
            0,
            Math.PI * 2
          );
          this.ctx.fill();
        }
      }
    }
    return this;
  }

  canPutAt(x, y, color) {
    //上から時計回り
    let coo = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];
    let other;
    if (color === 1) {
      other = 2;
    } else if (color === 2) {
      other = 1;
    }
    let directions = Array(8).fill(false);
    directions = directions.map((_, i) => {
      let co = coo[i];
      if (this.at(x + co[0], y + co[1]) === other) {
        return true;
      } else {
        return false;
      }
    });
    directions = directions.map((value, index) => {
      if (!value) return [false, 0];
      let i = 2;
      while (true) {
        let co = coo[index];
        let it = this.at(x + co[0] * i, y + co[1] * i);
        if (it === undefined || it === 0) return [false, 0];
        if (it === color) return [true, i];
        i++;
      }
    });
    return directions;
  }
  putOn(x, y) {
    this.history.push([x, y]);
    return this;
  }
  readHistry() {
    //historyから最新の盤面を計算する
    this.board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 2, 0, 0, 0],
      [0, 0, 0, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    let coo = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];
    for (let i = 0; i < this.history.length; i++) {
      let vs = this.canPutAt(...this.history[i], (i % 2) + 1);
      console.log(vs);
      if (!vs.map((v) => v[0]).includes(true))
        throw new Error(
          `cannnot put ${this.color[(i % 2) + 1]} on (${this.history[i][0]},${
            this.history[i][1]
          })`
        );
      for (let k = 0; k < vs.length; k++) {
        let co = coo[k];
        for (let l = 0; l <= vs[k][1]; l++) {
          //console.log(this.history[i][0]+co[0]*l,this.history[i][1]+co[1]*l)
          /*
          console.log(co)
          console.log(
            this.history[i][0] + co[0] * l,
            this.history[i][1] + co[1] * l,
            (i % 2) + 1
          );*/

          this.setAt(
            this.history[i][0] + co[0] * l,
            this.history[i][1] + co[1] * l,
            (i % 2) + 1
          );
        }

        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.size, this.size);
        this.drow();
      }
    }
    return this;
  }
  drowGrid() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.size, this.size);
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'black';
    for (let i = 0; i < 8; i++) {
      this.ctx.moveTo(i * this.pixcel, 0);
      this.ctx.lineTo(i * this.pixcel, size);
    }
    for (let i = 0; i < 8; i++) {
      this.ctx.moveTo(0, i * this.pixcel);
      this.ctx.lineTo(size, i * this.pixcel);
    }
    this.ctx.stroke();
    this, ctx.closePath();
    return this;
  }
}

let othello = new Othello(canvas).drowGrid().drow().enableClickToPut();
/*othello.history = [
  [4, 2],
  [5, 2],
  [3, 5],
];*/
othello.readHistry();
