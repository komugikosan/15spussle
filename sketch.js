let cols = 4;
let rows = 4;
let boardSize = 400;
let uiHeight = 80;

let tileW, tileH;
let board = [];
let tilePos = [];

function setup() {
  createCanvas(boardSize, boardSize + uiHeight);
  tileW = (width / cols) * 0.95;
  tileH = (boardSize / rows) * 0.95;

  resetGame();
}

function draw() {
  background(245, 235, 220);

  for (let i = 0; i < cols * rows; i++) {
    let val = board[i];
    if (val !== -1) {
      updateTilePos(i);
      drawTile(val, tilePos[i].x, tilePos[i].y);
    }
  }

  if (checkSolved() && isAnimationFinished()) {
    drawClearMessage();
  }

  drawButton();
}

function touchStarted() {
  if (isMouseOnButton()) {
    resetGame();
    return;
  }

  if (mouseY > boardSize || checkSolved()) return;

  let i = floor(mouseX / (width / cols));
  let j = floor(mouseY / (boardSize / rows));

  tryMove(i, j);
}

function resetGame() {
  board = [];
  tilePos = [];

  for (let i = 0; i < cols * rows; i++) {
    if (i < cols * rows - 1) board.push(i + 1);
    else board.push(-1);

    tilePos.push(getTargetPos(i));
  }

  for (let k = 0; k < 500; k++) {
    let blank = board.indexOf(-1);
    let neighbors = getNeighbors(blank);
    swap(blank, random(neighbors));
  }

  for (let i = 0; i < board.length; i++) {
    tilePos[i] = getTargetPos(i);
  }
}

function tryMove(col, row) {
  if (col < 0 || col >= cols || row < 0 || row >= rows) return;

  let index = col + row * cols;
  let blank = board.indexOf(-1);

  let blankCol = blank % cols;
  let blankRow = floor(blank / cols);

  if (dist(col, row, blankCol, blankRow) === 1) {
    swap(index, blank);
  }
}

function swap(i, j) {
  let temp = board[i];
  board[i] = board[j];
  board[j] = temp;

  let tempPos = tilePos[i];
  tilePos[i] = tilePos[j];
  tilePos[j] = tempPos;
}

function getNeighbors(idx) {
  let c = idx % cols;
  let r = floor(idx / cols);
  let neighbors = [];

  if (c > 0) neighbors.push(idx - 1);
  if (c < cols - 1) neighbors.push(idx + 1);
  if (r > 0) neighbors.push(idx - cols);
  if (r < rows - 1) neighbors.push(idx + cols);

  return neighbors;
}

function checkSolved() {
  for (let i = 0; i < board.length - 1; i++) {
    if (board[i] !== i + 1) return false;
  }
  return true;
}

function getTargetPos(index) {
  let c = index % cols;
  let r = floor(index / cols);
  return {
    x: c * (width / cols) + (width / cols - tileW) / 2,
    y: r * (boardSize / rows) + (boardSize / rows - tileH) / 2,
  };
}

function updateTilePos(index) {
  let target = getTargetPos(index);
  tilePos[index].x = lerp(tilePos[index].x, target.x, 0.25);
  tilePos[index].y = lerp(tilePos[index].y, target.y, 0.25);
}

function drawTile(val, x, y) {
  noStroke();

  fill(80, 60, 50, 100);
  rect(x + 4, y + 4, tileW, tileH, 12);

  if (checkSolved()) fill(184, 134, 11);
  else fill(101, 67, 33);
  rect(x, y, tileW, tileH, 12);

  fill(255, 248, 220);
  textSize(36);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text(val, x + tileW / 2, y + tileH / 2);
}

function drawClearMessage() {
  fill(60, 40, 30);
  textSize(50);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('CLEAR!', width / 2 + 2, boardSize / 2 + 2);
  fill(218, 165, 32);
  text('CLEAR!', width / 2, boardSize / 2);
}

function drawButton() {
  let btnY = boardSize + 20;
  let btnW = width - 240;
  let btnH = uiHeight - 40;
  let btnX = width / 2 - btnW / 2;

  fill(80, 60, 50, 50);
  rect(btnX + 3, btnY + 3, btnW, btnH, 20);

  fill(101, 67, 33);
  rect(btnX, btnY, btnW, btnH, 20);

  fill(255, 248, 220);
  textSize(20);
  textAlign(CENTER, CENTER);
  text('RETRY', width / 2, btnY + btnH / 2);
}

function isMouseOnButton() {
  let btnW = 160;
  let btnH = 40;
  let btnX = width / 2 - btnW / 2;
  let btnY = boardSize + 20;
  return mouseX > btnX && mouseX < btnX + btnW && mouseY > btnY && mouseY < btnY + btnH;
}

function isAnimationFinished() {
  let target = getTargetPos(0);
  return abs(tilePos[0].x - target.x) < 1;
}/* ここにソースコードを貼り付け */
