const container = document.getElementById("puzzle-container");
const message = document.getElementById("message");
let tiles = [];

function createPuzzle() {
  tiles = [];
  container.innerHTML = "";
  const positions = [...Array(9).keys()];
  shuffle(positions);

  positions.forEach((pos, index) => {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.style.backgroundPosition = `-${(pos % 3) * 100}px -${Math.floor(pos / 3) * 100}px`;
    tile.dataset.index = pos;
    tile.draggable = true;

    tile.addEventListener("dragstart", dragStart);
    tile.addEventListener("dragover", dragOver);
    tile.addEventListener("drop", drop);

    container.appendChild(tile);
    tiles.push(tile);
  });
  startTimer();
}

function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.index);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  const fromIndex = e.dataTransfer.getData("text/plain");
  const toIndex = e.target.dataset.index;

  const fromTile = tiles.find(t => t.dataset.index === fromIndex);
  const toTile = tiles.find(t => t.dataset.index === toIndex);

  // Swap background positions
  const temp = fromTile.style.backgroundPosition;
  fromTile.style.backgroundPosition = toTile.style.backgroundPosition;
  toTile.style.backgroundPosition = temp;

  // Swap dataset index
  const tempIndex = fromTile.dataset.index;
  fromTile.dataset.index = toTile.dataset.index;
  toTile.dataset.index = tempIndex;

  checkWin();
}

function checkWin() {
  const correct = tiles.every((tile, i) => parseInt(tile.dataset.index) === i);
  if (correct) {
    message.textContent = "🎉 Bạn đã hoàn thành bức hình tình yêu!";
    clearInterval(timerInterval);
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

createPuzzle();
let seconds = 0;
let timerInterval;
let timeLeft = 60;
let countdown;

function startTimer() {
  timeLeft = 60;
  clearInterval(countdown);
  document.getElementById("timer").textContent = `⏱️ Thời gian còn lại: ${timeLeft} giây`;

  countdown = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `⏱️ Thời gian còn lại: ${timeLeft} giây`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      document.getElementById("message").textContent = "⏰ Hết giờ! Bạn chưa hoàn thành rồi 😢";
    }
  }, 1000);
}

