const boardEl = document.getElementById('board');
const overlayEl = document.getElementById('overlay');
const diceEl = document.getElementById('dice');
const rollBtn = document.getElementById('roll-btn');
const resetBtn = document.getElementById('reset-btn');
const statusMsg = document.getElementById('status-msg');
const p1Card = document.getElementById('p1-card');
const p2Card = document.getElementById('p2-card');
const p1PosText = document.getElementById('p1-pos');
const p2PosText = document.getElementById('p2-pos');

const ladders = {
  4: 25,
  13: 46,
  33: 49,
  42: 63,
  50: 69,
  62: 81,
  74: 92
};

const snakes = {
  27: 5,
  40: 3,
  43: 18,
  54: 31,
  66: 45,
  76: 58,
  89: 53,
  99: 41
};

let positions = [1, 1];
let currentPlayer = 0;
let isBusy = false;
let gameOver = false;

function getGridCoords(square) {
  const index = square - 1;
  const rowFromBottom = Math.floor(index / 10);
  const colInRow = index % 10;
  const col = rowFromBottom % 2 === 0 ? colInRow : 9 - colInRow;
  const rowFromTop = 9 - rowFromBottom;
  return { row: rowFromTop, col };
}

function getSvgCenter(square) {
  const { row, col } = getGridCoords(square);
  return {
    x: col * 50 + 25,
    y: row * 50 + 25
  };
}

function buildBoard() {
  boardEl.innerHTML = '';
  const cellMap = new Array(101);

  for (let sq = 1; sq <= 100; sq++) {
    const { row, col } = getGridCoords(sq);
    const cell = document.createElement('div');
    const isLight = (row + col) % 2 === 0;
    cell.className = `cell ${isLight ? 'light' : 'dark'}`;
    if (sq === 1) cell.classList.add('start');
    if (sq === 100) cell.classList.add('finish');
    cell.dataset.square = sq;

    const num = document.createElement('span');
    num.className = 'cell-num';
    num.textContent = sq;

    const tokensWrap = document.createElement('div');
    tokensWrap.className = 'tokens-wrap';
    tokensWrap.id = `tokens-${sq}`;

    cell.append(num, tokensWrap);
    cellMap[row * 10 + col] = cell;
  }

  cellMap.forEach(cell => boardEl.appendChild(cell));
  drawConnectors();
}

function drawConnectors() {
  overlayEl.innerHTML = '';
  const ns = 'http://www.w3.org/2000/svg';

  Object.entries(ladders).forEach(([start, end]) => {
    const p1 = getSvgCenter(Number(start));
    const p2 = getSvgCenter(Number(end));
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    const offsetX = Math.sin(angle) * 6;
    const offsetY = -Math.cos(angle) * 6;

    [-1, 1].forEach(side => {
      const rail = document.createElementNS(ns, 'line');
      rail.setAttribute('x1', p1.x + offsetX * side);
      rail.setAttribute('y1', p1.y + offsetY * side);
      rail.setAttribute('x2', p2.x + offsetX * side);
      rail.setAttribute('y2', p2.y + offsetY * side);
      rail.setAttribute('stroke', '#10b981');
      rail.setAttribute('stroke-width', '3');
      rail.setAttribute('stroke-linecap', 'round');
      overlayEl.appendChild(rail);
    });

    const steps = 6;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const rx = p1.x + (p2.x - p1.x) * t;
      const ry = p1.y + (p2.y - p1.y) * t;
      const rung = document.createElementNS(ns, 'line');
      rung.setAttribute('x1', rx - offsetX);
      rung.setAttribute('y1', ry - offsetY);
      rung.setAttribute('x2', rx + offsetX);
      rung.setAttribute('y2', ry + offsetY);
      rung.setAttribute('stroke', '#34d399');
      rung.setAttribute('stroke-width', '2.2');
      overlayEl.appendChild(rung);
    }
  });

  Object.entries(snakes).forEach(([head, tail]) => {
    const p1 = getSvgCenter(Number(head));
    const p2 = getSvgCenter(Number(tail));
    const midX = (p1.x + p2.x) / 2 + (p1.y - p2.y) * 0.22;
    const midY = (p1.y + p2.y) / 2 + (p2.x - p1.x) * 0.22;

    const body = document.createElementNS(ns, 'path');
    body.setAttribute('d', `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`);
    body.setAttribute('fill', 'none');
    body.setAttribute('stroke', '#f43f5e');
    body.setAttribute('stroke-width', '4.5');
    body.setAttribute('stroke-linecap', 'round');
    overlayEl.appendChild(body);

    const headDot = document.createElementNS(ns, 'circle');
    headDot.setAttribute('cx', p1.x);
    headDot.setAttribute('cy', p1.y);
    headDot.setAttribute('r', '6');
    headDot.setAttribute('fill', '#fb7185');
    overlayEl.appendChild(headDot);
  });
}

function renderTokens() {
  document.querySelectorAll('.tokens-wrap').forEach(wrap => {
    wrap.innerHTML = '';
  });

  positions.forEach((pos, idx) => {
    const container = document.getElementById(`tokens-${pos}`);
    if (!container) return;
    const token = document.createElement('span');
    token.className = `token p${idx + 1}`;
    token.title = `Player ${idx + 1}`;
    container.appendChild(token);
  });

  p1PosText.textContent = `Position: ${positions[0]}`;
  p2PosText.textContent = `Position: ${positions[1]}`;
  p1Card.classList.toggle('active', currentPlayer === 0 && !gameOver);
  p2Card.classList.toggle('active', currentPlayer === 1 && !gameOver);
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function handleTurn() {
  if (isBusy || gameOver) return;
  isBusy = true;
  rollBtn.disabled = true;

  diceEl.classList.remove('rolling');
  void diceEl.offsetWidth;
  diceEl.classList.add('rolling');

  const roll = Math.floor(Math.random() * 6) + 1;
  await wait(260);
  diceEl.textContent = roll;

  const playerLabel = `Player ${currentPlayer + 1}`;
  const startPos = positions[currentPlayer];
  const targetPos = startPos + roll;

  if (targetPos > 100) {
    statusMsg.textContent = `${playerLabel} rolled ${roll} — needs exact roll for 100!`;
    await wait(600);
  } else {
    statusMsg.textContent = `${playerLabel} rolled ${roll}...`;
    for (let step = startPos + 1; step <= targetPos; step++) {
      positions[currentPlayer] = step;
      renderTokens();
      await wait(140);
    }

    if (ladders[targetPos]) {
      const top = ladders[targetPos];
      statusMsg.textContent = `${playerLabel} climbed a ladder (${targetPos} → ${top})!`;
      await wait(350);
      positions[currentPlayer] = top;
      renderTokens();
    } else if (snakes[targetPos]) {
      const tail = snakes[targetPos];
      statusMsg.textContent = `${playerLabel} hit a snake (${targetPos} → ${tail})!`;
      await wait(350);
      positions[currentPlayer] = tail;
      renderTokens();
    }

    if (positions[currentPlayer] === 100) {
      gameOver = true;
      statusMsg.textContent = `${playerLabel} wins the game!`;
      renderTokens();
      isBusy = false;
      return;
    }
  }

  if (roll === 6) {
    statusMsg.textContent = `${playerLabel} rolled a 6 — bonus turn!`;
  } else {
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    statusMsg.textContent = `Player ${currentPlayer + 1}'s turn to roll`;
  }

  renderTokens();
  rollBtn.disabled = false;
  isBusy = false;
}

function resetGame() {
  positions = [1, 1];
  currentPlayer = 0;
  isBusy = false;
  gameOver = false;
  diceEl.textContent = '1';
  rollBtn.disabled = false;
  statusMsg.textContent = "Player 1's turn to roll";
  renderTokens();
}

rollBtn.addEventListener('click', handleTurn);
resetBtn.addEventListener('click', resetGame);

buildBoard();
renderTokens();