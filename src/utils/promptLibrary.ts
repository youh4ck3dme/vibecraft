export interface PromptItem {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  mockCode: string;
}

export const promptCategories = [
  { id: 'portfolios', name: 'Portfolios & Resumes', icon: 'User' },
  { id: 'landing', name: 'Landing Pages', icon: 'Globe' },
  { id: 'tools', name: 'Utility Tools', icon: 'Wrench' },
  { id: 'games', name: 'Interactive Games', icon: 'Gamepad2' },
  { id: 'dashboards', name: 'Dashboards', icon: 'LayoutDashboard' }
];

export const promptLibrary: PromptItem[] = [
  // --- GAMES ---
  {
    id: 'snake-game',
    title: 'Retro Snake Game',
    description: 'Fully playable classic Snake game with retro canvas aesthetics, score tracker, and mobile controls.',
    category: 'games',
    prompt: 'Create a retro arcade Snake game with a dark grid container, neon green snake, purple food, score counter, start/restart screen, and virtual D-pad buttons for mobile users.',
    mockCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Retro Neon Snake</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Share+Tech+Mono&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #09090e;
      --card: rgba(255, 255, 255, 0.03);
      --border: rgba(255, 255, 255, 0.08);
      --neon-green: #39ff14;
      --neon-purple: #bd00ff;
      --neon-blue: #00f0ff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: #fff;
      font-family: 'Outfit', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
      background-image: radial-gradient(circle at 50% 50%, #15102a 0%, var(--bg) 70%);
    }
    .container {
      background: var(--card);
      border: 1px solid var(--border);
      backdrop-filter: blur(12px);
      border-radius: 20px;
      padding: 24px;
      width: 90%;
      max-width: 440px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 1px;
    }
    .score-container {
      font-family: 'Share Tech Mono', monospace;
      font-size: 18px;
      color: var(--neon-blue);
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 16px;
      padding: 8px 16px;
      background: rgba(0,0,0,0.2);
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    canvas {
      background: #000;
      border: 2px solid var(--border);
      border-radius: 12px;
      box-shadow: 0 0 15px rgba(189, 0, 255, 0.15);
      display: block;
    }
    .overlay {
      position: absolute;
      background: rgba(9, 9, 14, 0.85);
      top: 0; left: 0; width: 100%; height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      opacity: 1;
      transition: opacity 0.3s;
    }
    .overlay.hidden { display: none; }
    .btn {
      background: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));
      color: white;
      border: none;
      padding: 12px 24px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      box-shadow: 0 4px 15px rgba(0, 240, 255, 0.3);
      transition: all 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(189, 0, 255, 0.4);
    }
    .controls {
      display: grid;
      grid-template-columns: repeat(3, 50px);
      grid-template-rows: repeat(3, 50px);
      gap: 8px;
      margin-top: 16px;
    }
    .dpad-btn {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      color: white;
      font-size: 20px;
      font-weight: bold;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
    }
    .dpad-btn:active {
      background: var(--neon-blue);
      box-shadow: 0 0 10px var(--neon-blue);
    }
    #up { grid-column: 2; }
    #left { grid-column: 1; grid-row: 2; }
    #right { grid-column: 3; grid-row: 2; }
    #down { grid-column: 2; grid-row: 3; }
  </style>
</head>
<body>
  <div class="container">
    <h1>NEON SNAKE GAME</h1>
    <div class="score-container">
      <span>SCORE: <span id="score">0</span></span>
      <span>HIGH: <span id="highScore">0</span></span>
    </div>
    <div style="position: relative; width: 300px; height: 300px;">
      <canvas id="gameCanvas" width="300" height="300"></canvas>
      <div id="startOverlay" class="overlay">
        <h2 style="margin-bottom:16px; font-family:'Share Tech Mono'; color:var(--neon-green)">READY TO PLAY?</h2>
        <button class="btn" id="startBtn">START GAME</button>
      </div>
      <div id="gameOverOverlay" class="overlay hidden">
        <h2 style="margin-bottom:8px; color:#ff4a4a; font-family:'Share Tech Mono'">GAME OVER</h2>
        <p style="margin-bottom:16px; font-size:14px; color:#aaa">Score was <span id="finalScore">0</span></p>
        <button class="btn" id="restartBtn">PLAY AGAIN</button>
      </div>
    </div>
    
    <!-- Mobile Controls -->
    <div class="controls">
      <button class="dpad-btn" id="up">▲</button>
      <button class="dpad-btn" id="left">◀</button>
      <button class="dpad-btn" id="right">▶</button>
      <button class="dpad-btn" id="down">▼</button>
    </div>
  </div>

  <script>
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');
    const highScoreEl = document.getElementById('highScore');
    const startOverlay = document.getElementById('startOverlay');
    const gameOverOverlay = document.getElementById('gameOverOverlay');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    const finalScoreEl = document.getElementById('finalScore');

    const grid = 15;
    let snake = [];
    let food = { x: 0, y: 0 };
    let dx = grid;
    let dy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snake_high') || 0;
    highScoreEl.innerText = highScore;
    let gameInterval = null;
    let isPlaying = false;

    function resetGame() {
      snake = [
        { x: grid * 5, y: grid * 5 },
        { x: grid * 4, y: grid * 5 },
        { x: grid * 3, y: grid * 5 }
      ];
      dx = grid;
      dy = 0;
      score = 0;
      scoreEl.innerText = score;
      spawnFood();
    }

    function spawnFood() {
      const maxGridX = canvas.width / grid - 1;
      const maxGridY = canvas.height / grid - 1;
      food.x = Math.floor(Math.random() * maxGridX) * grid;
      food.y = Math.floor(Math.random() * maxGridY) * grid;
      
      // Make sure food is not on snake
      for (let cell of snake) {
        if (cell.x === food.x && cell.y === food.y) {
          spawnFood();
          break;
        }
      }
    }

    function draw() {
      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines subtly
      ctx.strokeStyle = 'rgba(255,255,255,0.02)';
      for(let i=0; i<canvas.width; i+=grid) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#bd00ff';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#bd00ff';
      ctx.beginPath();
      ctx.arc(food.x + grid/2, food.y + grid/2, grid/2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Snake
      snake.forEach((part, index) => {
        ctx.fillStyle = index === 0 ? '#39ff14' : '#22b809';
        ctx.shadowBlur = index === 0 ? 6 : 0;
        ctx.shadowColor = '#39ff14';
        ctx.fillRect(part.x + 1, part.y + 1, grid - 2, grid - 2);
      });
      ctx.shadowBlur = 0;
    }

    function update() {
      // Move snake head
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };

      // Check wall collision
      if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame();
        return;
      }

      // Check self collision
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
          endGame();
          return;
        }
      }

      // Add new head
      snake.unshift(head);

      // Check food eating
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.innerText = score;
        if (score > highScore) {
          highScore = score;
          highScoreEl.innerText = highScore;
          localStorage.setItem('snake_high', highScore);
        }
        spawnFood();
      } else {
        // Remove tail
        snake.pop();
      }
    }

    function gameLoop() {
      update();
      draw();
    }

    function startGame() {
      resetGame();
      isPlaying = true;
      startOverlay.classList.add('hidden');
      gameOverOverlay.classList.add('hidden');
      if(gameInterval) clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, 120);
    }

    function endGame() {
      isPlaying = false;
      clearInterval(gameInterval);
      finalScoreEl.innerText = score;
      gameOverOverlay.classList.remove('hidden');
    }

    // Direction handlers
    function changeDirection(dir) {
      if (!isPlaying) return;
      if (dir === 'UP' && dy === 0) { dx = 0; dy = -grid; }
      else if (dir === 'DOWN' && dy === 0) { dx = 0; dy = grid; }
      else if (dir === 'LEFT' && dx === 0) { dx = -grid; dy = 0; }
      else if (dir === 'RIGHT' && dx === 0) { dx = grid; dy = 0; }
    }

    window.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp' || e.key === 'w') changeDirection('UP');
      else if (e.key === 'ArrowDown' || e.key === 's') changeDirection('DOWN');
      else if (e.key === 'ArrowLeft' || e.key === 'a') changeDirection('LEFT');
      else if (e.key === 'ArrowRight' || e.key === 'd') changeDirection('RIGHT');
    });

    // Mobile controls setup
    document.getElementById('up').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection('UP') });
    document.getElementById('down').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection('DOWN') });
    document.getElementById('left').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection('LEFT') });
    document.getElementById('right').addEventListener('touchstart', (e) => { e.preventDefault(); changeDirection('RIGHT') });

    document.getElementById('up').addEventListener('click', () => changeDirection('UP'));
    document.getElementById('down').addEventListener('click', () => changeDirection('DOWN'));
    document.getElementById('left').addEventListener('click', () => changeDirection('LEFT'));
    document.getElementById('right').addEventListener('click', () => changeDirection('RIGHT'));

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);

    // Initial clear
    draw();
  </script>
</body>
</html>`
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe vs Smart AI',
    description: 'Play Tic-Tac-Toe against an AI opponent featuring smooth scaling grid items and winning animation.',
    category: 'games',
    prompt: 'Create a Tic-Tac-Toe game where the player plays as X against an intelligent AI (O). Make the grid responsive, glassmorphic, and add score tracking plus win streak counts.',
    mockCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber Tic Tac Toe</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0d0d12;
      --card: rgba(255, 255, 255, 0.03);
      --border: rgba(255, 255, 255, 0.08);
      --color-x: #ff007f;
      --color-o: #00f0ff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: #fff;
      font-family: 'Outfit', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-image: radial-gradient(circle at 50% 50%, #1e1335 0%, var(--bg) 80%);
    }
    .wrapper {
      background: var(--card);
      border: 1px solid var(--border);
      backdrop-filter: blur(15px);
      border-radius: 24px;
      padding: 30px;
      width: 90%;
      max-width: 380px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
      text-align: center;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 20px;
      background: linear-gradient(135deg, var(--color-x), var(--color-o));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .scores {
      display: flex;
      justify-content: space-around;
      margin-bottom: 20px;
      background: rgba(0,0,0,0.3);
      padding: 12px;
      border-radius: 12px;
      border: 1px solid var(--border);
      font-size: 14px;
    }
    .score-block span { display: block; font-weight: 600; margin-top: 4px; font-size: 18px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .cell {
      aspect-ratio: 1;
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 800;
      transition: all 0.2s;
      user-select: none;
    }
    .cell:hover {
      background: rgba(255,255,255,0.05);
    }
    .cell.x { color: var(--color-x); text-shadow: 0 0 10px rgba(255,0,127,0.5); }
    .cell.o { color: var(--color-o); text-shadow: 0 0 10px rgba(0,240,255,0.5); }
    .status {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 20px;
      min-height: 24px;
      color: #aaa;
    }
    .status.highlight { color: #fff; text-shadow: 0 0 8px rgba(255,255,255,0.5); }
    .btn {
      background: linear-gradient(135deg, var(--color-x), var(--color-o));
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0, 240, 255, 0.3);
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <h1>CYBER TIC-TAC-TOE</h1>
    <div class="scores">
      <div class="score-block" style="color: var(--color-x)">YOU (X) <span id="playerScore">0</span></div>
      <div class="score-block" style="color: #aaa">TIES <span id="tiesScore">0</span></div>
      <div class="score-block" style="color: var(--color-o)">CPU (O) <span id="cpuScore">0</span></div>
    </div>
    
    <div class="grid" id="grid">
      <div class="cell" data-index="0"></div>
      <div class="cell" data-index="1"></div>
      <div class="cell" data-index="2"></div>
      <div class="cell" data-index="3"></div>
      <div class="cell" data-index="4"></div>
      <div class="cell" data-index="5"></div>
      <div class="cell" data-index="6"></div>
      <div class="cell" data-index="7"></div>
      <div class="cell" data-index="8"></div>
    </div>

    <div class="status" id="status">Your Turn (X)</div>
    <button class="btn" id="resetBtn">RESET BOARD</button>
  </div>

  <script>
    const gridEl = document.getElementById('grid');
    const cells = document.querySelectorAll('.cell');
    const statusEl = document.getElementById('status');
    const resetBtn = document.getElementById('resetBtn');
    
    let board = Array(9).fill('');
    let isGameActive = true;
    let scores = { player: 0, cpu: 0, ties: 0 };

    const winConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    function handleCellClick(e) {
      const index = e.target.getAttribute('data-index');
      if (board[index] !== '' || !isGameActive) return;

      makeMove(index, 'X');
      if (checkWin('X')) {
        endGame('X');
        return;
      }
      if (board.every(cell => cell !== '')) {
        endGame('Tie');
        return;
      }

      // CPU Turn
      isGameActive = false;
      statusEl.innerText = "CPU thinking...";
      setTimeout(cpuMove, 500);
    }

    function makeMove(index, player) {
      board[index] = player;
      cells[index].innerText = player;
      cells[index].classList.add(player.toLowerCase());
    }

    function cpuMove() {
      // Basic AI: Try to win, block player, or take center/random
      const bestMove = getBestMove();
      makeMove(bestMove, 'O');

      if (checkWin('O')) {
        endGame('O');
        return;
      }
      if (board.every(cell => cell !== '')) {
        endGame('Tie');
        return;
      }

      isGameActive = true;
      statusEl.innerText = "Your Turn (X)";
    }

    function getBestMove() {
      // 1. Check if AI can win
      for (let cond of winConditions) {
        let count = 0, emptyIdx = -1;
        for (let idx of cond) {
          if (board[idx] === 'O') count++;
          else if (board[idx] === '') emptyIdx = idx;
        }
        if (count === 2 && emptyIdx !== -1) return emptyIdx;
      }

      // 2. Check if player can be blocked
      for (let cond of winConditions) {
        let count = 0, emptyIdx = -1;
        for (let idx of cond) {
          if (board[idx] === 'X') count++;
          else if (board[idx] === '') emptyIdx = idx;
        }
        if (count === 2 && emptyIdx !== -1) return emptyIdx;
      }

      // 3. Take center if free
      if (board[4] === '') return 4;

      // 4. Random move
      const empties = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
      return empties[Math.floor(Math.random() * empties.length)];
    }

    function checkWin(player) {
      return winConditions.some(cond => cond.every(idx => board[idx] === player));
    }

    function endGame(winner) {
      isGameActive = false;
      if (winner === 'X') {
        statusEl.innerText = "You Win! 🎉";
        statusEl.classList.add('highlight');
        scores.player++;
        document.getElementById('playerScore').innerText = scores.player;
      } else if (winner === 'O') {
        statusEl.innerText = "CPU Wins! 🤖";
        statusEl.classList.add('highlight');
        scores.cpu++;
        document.getElementById('cpuScore').innerText = scores.cpu;
      } else {
        statusEl.innerText = "It's a Tie! 🤝";
        scores.ties++;
        document.getElementById('tiesScore').innerText = scores.ties;
      }
    }

    function resetBoard() {
      board = Array(9).fill('');
      isGameActive = true;
      statusEl.innerText = "Your Turn (X)";
      statusEl.classList.remove('highlight');
      cells.forEach(cell => {
        cell.innerText = '';
        cell.className = 'cell';
      });
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetBoard);
  </script>
</body>
</html>`
  },
  {
    id: 'memory-game',
    title: 'Neon Card Memory Match',
    description: 'A flip-and-match cards game featuring cyberpunk-themed symbols, animations, and matching streaks.',
    category: 'games',
    prompt: 'Build a matching card game on a dark screen with retro symbols. Include flip animations, move counting, matched cards persistent highlight, and win notification.',
    mockCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber Memory</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Share+Tech+Mono&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #09090d;
      --card-back: linear-gradient(135deg, #1b0a2a, #05162a);
      --border: rgba(255,255,255,0.08);
      --glow-blue: #00f0ff;
      --glow-purple: #bd00ff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: #fff;
      font-family: 'Outfit', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-image: radial-gradient(circle at 50% 50%, #15102c 0%, var(--bg) 80%);
    }
    .container {
      width: 90%;
      max-width: 400px;
      text-align: center;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      margin-bottom: 8px;
      background: linear-gradient(135deg, var(--glow-blue), var(--glow-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .stats {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 10px 20px;
      background: rgba(255,255,255,0.02);
      border-radius: 12px;
      border: 1px solid var(--border);
      font-family: 'Share Tech Mono', monospace;
      color: var(--glow-blue);
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    .card {
      aspect-ratio: 3/4;
      perspective: 1000px;
      cursor: pointer;
    }
    .card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 0.5s;
      border-radius: 8px;
    }
    .card.flipped .card-inner {
      transform: rotateY(180deg);
    }
    .card-front, .card-back {
      position: absolute;
      width: 100%; height: 100%;
      backface-visibility: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      border: 1px solid var(--border);
    }
    .card-back {
      background: var(--card-back);
      color: var(--glow-blue);
      font-size: 20px;
    }
    .card-front {
      background: rgba(255,255,255,0.05);
      transform: rotateY(180deg);
      font-size: 28px;
      color: #fff;
    }
    .card.matched .card-inner {
      box-shadow: 0 0 10px var(--glow-purple);
      border-color: var(--glow-purple);
    }
    .btn {
      background: linear-gradient(135deg, var(--glow-blue), var(--glow-purple));
      color: white;
      border: none;
      padding: 12px 24px;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      box-shadow: 0 4px 15px rgba(0, 240, 255, 0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>NEON MEMORY MATCH</h1>
    <div class="stats">
      <span>MOVES: <span id="moves">0</span></span>
      <span>TIME: <span id="time">00:00</span></span>
    </div>
    
    <div class="grid" id="grid"></div>

    <button class="btn" id="resetBtn">RESET GAME</button>
  </div>

  <script>
    const gridEl = document.getElementById('grid');
    const movesEl = document.getElementById('moves');
    const timeEl = document.getElementById('time');
    const resetBtn = document.getElementById('resetBtn');

    const icons = ['👾', '🚀', '💿', '💾', '💎', '🔑', '💡', '🔋'];
    let deck = [...icons, ...icons];
    let flippedCards = [];
    let moves = 0;
    let seconds = 0;
    let timer = null;
    let matchedCount = 0;

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[array.length - 1]] = [array[array.length - 1], array[i]]; // wait, simpler:
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }

    function startTimer() {
      clearInterval(timer);
      seconds = 0;
      timer = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timeEl.innerText = \`\${mins}:\${secs}\`;
      }, 1000);
    }

    function createBoard() {
      gridEl.innerHTML = '';
      shuffle(deck);
      deck.forEach((icon, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.name = icon;
        card.dataset.index = index;
        card.innerHTML = \`
          <div class="card-inner">
            <div class="card-back">?</div>
            <div class="card-front">\${icon}</div>
          </div>
        \`;
        card.addEventListener('click', flipCard);
        gridEl.appendChild(card);
      });
      moves = 0;
      movesEl.innerText = moves;
      matchedCount = 0;
      flippedCards = [];
      startTimer();
    }

    function flipCard() {
      if (this.classList.contains('flipped') || this.classList.contains('matched') || flippedCards.length >= 2) return;

      this.classList.add('flipped');
      flippedCards.push(this);

      if (flippedCards.length === 2) {
        moves++;
        movesEl.innerText = moves;
        checkMatch();
      }
    }

    function checkMatch() {
      const [card1, card2] = flippedCards;
      if (card1.dataset.name === card2.dataset.name) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCount += 2;
        flippedCards = [];
        if (matchedCount === deck.length) {
          clearInterval(timer);
          setTimeout(() => alert(\`Winner! Completed in \${moves} moves.\`), 500);
        }
      } else {
        setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          flippedCards = [];
        }, 1000);
      }
    }

    resetBtn.addEventListener('click', createBoard);
    createBoard();
  </script>
</body>
</html>`
  },

  // --- TOOLS ---
  {
    id: 'pomodoro-timer',
    title: 'Circular Pomodoro Hub',
    description: 'Sleek dark glassmorphism layout with custom session intervals, circular SVG countdown, and audio alerts.',
    category: 'tools',
    prompt: 'Design a glassmorphic circular Pomodoro countdown timer with modern settings, adjustable work/break lengths, sound alerts, and a history log of completed sessions.',
    mockCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Minimal Pomodoro</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Share+Tech+Mono&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #09090b;
      --accent: #ff007f;
      --card: rgba(255, 255, 255, 0.03);
      --border: rgba(255, 255, 255, 0.08);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: #fff;
      font-family: 'Outfit', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-image: radial-gradient(circle at 50% 50%, #20132c 0%, var(--bg) 80%);
    }
    .timer-card {
      background: var(--card);
      border: 1px solid var(--border);
      backdrop-filter: blur(15px);
      border-radius: 24px;
      padding: 32px;
      width: 90%;
      max-width: 360px;
      box-shadow: 0 30px 60px rgba(0,0,0,0.6);
      text-align: center;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      margin-bottom: 20px;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #ff007f, #bd00ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .progress-box {
      position: relative;
      width: 200px;
      height: 200px;
      margin: 0 auto 24px;
    }
    .progress-circle {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }
    .progress-circle circle {
      fill: none;
      stroke-width: 8;
    }
    .circle-bg { stroke: rgba(255,255,255,0.03); }
    .circle-progress {
      stroke: var(--accent);
      stroke-linecap: round;
      transition: stroke-dashoffset 0.3s;
      filter: drop-shadow(0 0 6px var(--accent));
    }
    .time-display {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      font-family: 'Share Tech Mono', monospace;
      font-size: 36px;
      font-weight: 600;
      color: #fff;
    }
    .controls {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .btn {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      color: white;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn.primary {
      background: var(--accent);
      border-color: var(--accent);
      box-shadow: 0 0 10px rgba(255,0,127,0.3);
    }
    .btn:hover {
      transform: translateY(-1px);
      background: rgba(255,255,255,0.1);
    }
    .btn.primary:hover {
      background: #ff2a93;
    }
    .settings {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid var(--border);
      padding-top: 16px;
      font-size: 13px;
      color: #888;
    }
    .setting-block input {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      color: white;
      width: 45px;
      padding: 4px;
      border-radius: 4px;
      text-align: center;
      margin-left: 4px;
    }
  </style>
</head>
<body>
  <div class="timer-card">
    <h1>POMODORO SPACE</h1>
    <div class="progress-box">
      <svg class="progress-circle" viewBox="0 0 100 100">
        <circle class="circle-bg" cx="50" cy="50" r="45"></circle>
        <circle class="circle-progress" cx="50" cy="50" r="45" stroke-dasharray="282.7" stroke-dashoffset="0"></circle>
      </svg>
      <div class="time-display" id="timerText">25:00</div>
    </div>
    
    <div class="controls">
      <button class="btn primary" id="playBtn">START</button>
      <button class="btn" id="resetBtn">RESET</button>
    </div>

    <div class="settings">
      <div class="setting-block">
        Work: <input type="number" id="workTime" value="25" min="1">
      </div>
      <div class="setting-block">
        Break: <input type="number" id="breakTime" value="5" min="1">
      </div>
    </div>
  </div>

  <script>
    const playBtn = document.getElementById('playBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timerText = document.getElementById('timerText');
    const workInput = document.getElementById('workTime');
    const breakInput = document.getElementById('breakTime');
    const circleProgress = document.querySelector('.circle-progress');

    let totalSeconds = 25 * 60;
    let secondsLeft = totalSeconds;
    let timerId = null;
    let isWorking = true;
    const perimeter = 282.7;

    function updateCircle(offset) {
      circleProgress.style.strokeDashoffset = offset;
    }

    function displayTime() {
      const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
      const seconds = (secondsLeft % 60).toString().padStart(2, '0');
      timerText.innerText = \`\${minutes}:\${seconds}\`;
    }

    function toggleTimer() {
      if (timerId) {
        // Pause
        clearInterval(timerId);
        timerId = null;
        playBtn.innerText = "START";
      } else {
        // Start
        timerId = setInterval(tick, 1000);
        playBtn.innerText = "PAUSE";
      }
    }

    function tick() {
      if (secondsLeft <= 0) {
        // Alert Sound Simulation
        alert(isWorking ? "Time for a break! ☕" : "Back to work! 💪");
        isWorking = !isWorking;
        document.documentElement.style.setProperty('--accent', isWorking ? '#ff007f' : '#00f0ff');
        secondsLeft = (isWorking ? workInput.value : breakInput.value) * 60;
        totalSeconds = secondsLeft;
      } else {
        secondsLeft--;
      }
      
      const progress = secondsLeft / totalSeconds;
      const offset = perimeter * (1 - progress);
      updateCircle(offset);
      displayTime();
    }

    function resetTimer() {
      clearInterval(timerId);
      timerId = null;
      isWorking = true;
      document.documentElement.style.setProperty('--accent', '#ff007f');
      secondsLeft = workInput.value * 60;
      totalSeconds = secondsLeft;
      updateCircle(0);
      displayTime();
      playBtn.innerText = "START";
    }

    workInput.addEventListener('change', resetTimer);
    breakInput.addEventListener('change', resetTimer);
    playBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Initial setup
    displayTime();
  </script>
</body>
</html>`
  },

  // --- PORTFOLIOS ---
  {
    id: 'photo-portfolio',
    title: 'Photographer Lightbox Showcase',
    description: 'Minimal gallery featuring high contrast grid layout, dynamic photo categories, and responsive image viewer overlay.',
    category: 'portfolios',
    prompt: 'Design a luxury minimalist photographer portfolio with grid filtering (Nature, Studio, Street), fluid image hovers, and a lightbox viewer when clicking photos.',
    mockCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aura Photography</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #050505;
      --card: rgba(255, 255, 255, 0.02);
      --border: rgba(255, 255, 255, 0.06);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: #fff;
      font-family: 'Outfit', sans-serif;
      overflow-x: hidden;
    }
    header {
      padding: 40px 24px;
      text-align: center;
      max-width: 1000px;
      margin: 0 auto;
    }
    h1 {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: 4px;
      margin-bottom: 8px;
    }
    p.subtitle {
      font-size: 14px;
      letter-spacing: 2px;
      color: #666;
      text-transform: uppercase;
    }
    .filters {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin: 30px 0;
    }
    .filter-btn {
      background: transparent;
      border: 1px solid var(--border);
      color: #888;
      padding: 8px 16px;
      border-radius: 30px;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.3s;
    }
    .filter-btn.active, .filter-btn:hover {
      color: #fff;
      border-color: #fff;
      background: rgba(255,255,255,0.05);
    }
    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 14px;
      max-width: 960px;
      margin: 0 auto;
      padding: 0 24px 60px;
    }
    .gallery-item {
      position: relative;
      aspect-ratio: 4/3;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.3s;
    }
    .gallery-item:hover {
      transform: scale(1.02);
      border-color: rgba(255,255,255,0.2);
    }
    .image-frame {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      transition: transform 0.45s ease, filter 0.45s ease;
    }
    .gallery-item:hover .image-frame {
      transform: scale(1.06);
      filter: saturate(1.08) contrast(1.05);
    }
    .image-frame::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.72));
    }
    .nature-1 {
      background-image:
        radial-gradient(circle at 30% 18%, rgba(198,255,190,.55), transparent 16%),
        radial-gradient(circle at 70% 70%, rgba(26,117,74,.65), transparent 28%),
        linear-gradient(135deg, #0f2f24, #06110e 58%, #1f3d2f);
    }
    .nature-2 {
      background-image:
        radial-gradient(circle at 20% 72%, rgba(255,180,92,.55), transparent 18%),
        radial-gradient(circle at 75% 25%, rgba(58,128,82,.5), transparent 24%),
        linear-gradient(145deg, #2f2515, #08120e 60%, #6f4421);
    }
    .studio-1 {
      background-image:
        radial-gradient(ellipse at 55% 28%, rgba(255,255,255,.72), transparent 20%),
        radial-gradient(circle at 50% 52%, rgba(180,190,205,.32), transparent 25%),
        linear-gradient(160deg, #17191f, #050507 64%, #40392f);
    }
    .studio-2 {
      background-image:
        radial-gradient(circle at 35% 34%, rgba(185,138,255,.52), transparent 20%),
        radial-gradient(circle at 68% 64%, rgba(255,112,178,.28), transparent 26%),
        linear-gradient(135deg, #160f24, #070609 62%, #2b1b3c);
    }
    .street-1 {
      background-image:
        linear-gradient(90deg, rgba(255,255,255,.12) 0 1px, transparent 1px 24%),
        radial-gradient(circle at 28% 64%, rgba(0,219,255,.42), transparent 18%),
        linear-gradient(135deg, #08151f, #030405 58%, #182b36);
    }
    .street-2 {
      background-image:
        radial-gradient(circle at 64% 25%, rgba(255,204,94,.46), transparent 16%),
        radial-gradient(circle at 30% 76%, rgba(255,77,109,.32), transparent 22%),
        linear-gradient(150deg, #20110b, #070505 64%, #3f2815);
    }
    .caption {
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 16px;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: end;
    }
    .gallery-item span.tag {
      background: rgba(0,0,0,0.7);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      border: 1px solid var(--border);
    }
    .caption strong {
      font-size: 15px;
      letter-spacing: 0.4px;
    }
    /* Lightbox */
    .lightbox {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.95);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s;
    }
    .lightbox.active {
      opacity: 1; pointer-events: auto;
    }
    .lightbox-content {
      width: min(82vw, 860px);
      height: min(66vh, 620px);
      background-size: cover;
      background-position: center;
      border-radius: 18px;
      border: 1px solid rgba(255,255,255,.16);
      box-shadow: 0 30px 80px rgba(0,0,0,.65);
      margin-bottom: 20px;
    }
    .lightbox-close {
      position: absolute;
      top: 30px; right: 30px;
      font-size: 24px;
      cursor: pointer;
      color: #888;
    }
  </style>
</head>
<body>
  <header>
    <h1>AURA PORTRAIT</h1>
    <p class="subtitle">VISUAL STORIES BY AURA</p>
    <div class="filters">
      <button class="filter-btn active" data-filter="all">ALL</button>
      <button class="filter-btn" data-filter="nature">NATURE</button>
      <button class="filter-btn" data-filter="studio">STUDIO</button>
      <button class="filter-btn" data-filter="street">STREET</button>
    </div>
  </header>

  <div class="gallery" id="gallery">
    <div class="gallery-item" data-category="nature">
      <div class="image-frame nature-1"></div>
      <div class="caption"><strong>Moss Valley</strong><span class="tag">NATURE</span></div>
    </div>
    <div class="gallery-item" data-category="studio">
      <div class="image-frame studio-1"></div>
      <div class="caption"><strong>Soft Profile</strong><span class="tag">STUDIO</span></div>
    </div>
    <div class="gallery-item" data-category="street">
      <div class="image-frame street-1"></div>
      <div class="caption"><strong>Blue Block</strong><span class="tag">STREET</span></div>
    </div>
    <div class="gallery-item" data-category="nature">
      <div class="image-frame nature-2"></div>
      <div class="caption"><strong>Pine Walk</strong><span class="tag">NATURE</span></div>
    </div>
    <div class="gallery-item" data-category="studio">
      <div class="image-frame studio-2"></div>
      <div class="caption"><strong>Glass Hour</strong><span class="tag">STUDIO</span></div>
    </div>
    <div class="gallery-item" data-category="street">
      <div class="image-frame street-2"></div>
      <div class="caption"><strong>Night Crossing</strong><span class="tag">STREET</span></div>
    </div>
  </div>

  <div class="lightbox" id="lightbox">
    <span class="lightbox-close" id="closeBtn">✕</span>
    <div class="lightbox-content" id="lightboxImage"></div>
    <h2 id="lightboxTitle">STREET</h2>
  </div>

  <script>
    const filterBtns = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const closeBtn = document.getElementById('closeBtn');

    // Filtering
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        items.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'flex';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });

    // Lightbox
    items.forEach(item => {
      item.addEventListener('click', () => {
        const image = item.querySelector('.image-frame');
        const tag = item.querySelector('.tag').innerText;
        lightboxImage.style.backgroundImage = getComputedStyle(image).backgroundImage;
        lightboxTitle.innerText = tag;
        lightbox.classList.add('active');
      });
    });

    closeBtn.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
      if(e.target === lightbox) lightbox.classList.remove('active');
    });
  </script>
</body>
</html>`
  },

  // --- DASHBOARDS ---
  {
    id: 'kanban-board',
    title: 'Flow Kanban Task Board',
    description: 'A workspace tracker with drag-like button moves, dynamic task creation, and responsive layout.',
    category: 'dashboards',
    prompt: 'Create a responsive glassmorphic Kanban Board with columns for "To Do", "In Progress", and "Done". Users should be able to create tasks, delete them, and move them between lists.',
    mockCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flow Kanban</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #08080c;
      --card: rgba(255, 255, 255, 0.02);
      --border: rgba(255, 255, 255, 0.06);
      --todo: #00f0ff;
      --progress: #bd00ff;
      --done: #39ff14;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: #fff;
      font-family: 'Outfit', sans-serif;
      min-height: 100vh;
      background-image: radial-gradient(circle at 50% 50%, #151128 0%, var(--bg) 80%);
      padding: 40px 24px;
    }
    .wrapper {
      max-width: 900px;
      margin: 0 auto;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 1px;
    }
    .input-box {
      display: flex;
      gap: 8px;
    }
    input {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 16px;
      color: white;
      font-family: 'Outfit', sans-serif;
    }
    .btn {
      background: #bd00ff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    .board {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    .column {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 20px;
      backdrop-filter: blur(10px);
    }
    .col-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .col-indicator {
      width: 8px; height: 8px; border-radius: 50%;
    }
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-height: 200px;
    }
    .task-card {
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .task-card:hover {
      border-color: rgba(255,255,255,0.15);
    }
    .task-desc { font-size: 14px; color: #ddd; }
    .task-actions {
      display: flex;
      justify-content: flex-end;
      gap: 6px;
    }
    .action-btn {
      background: rgba(255,255,255,0.05);
      border: 1px solid var(--border);
      color: white;
      padding: 4px 8px;
      font-size: 11px;
      border-radius: 4px;
      cursor: pointer;
    }
    .action-btn.delete { color: #ff5555; }
  </style>
</head>
<body>
  <div class="wrapper">
    <header>
      <h1>FLOW KANBAN</h1>
      <div class="input-box">
        <input type="text" id="taskInput" placeholder="Enter task details...">
        <button class="btn" id="addBtn">ADD TASK</button>
      </div>
    </header>

    <div class="board">
      <div class="column" id="col-todo">
        <div class="col-header" style="color: var(--todo)">
          <span>To Do</span>
          <div class="col-indicator" style="background: var(--todo)"></div>
        </div>
        <div class="task-list" id="todo-list"></div>
      </div>
      <div class="column" id="col-progress">
        <div class="col-header" style="color: var(--progress)">
          <span>In Progress</span>
          <div class="col-indicator" style="background: var(--progress)"></div>
        </div>
        <div class="task-list" id="progress-list"></div>
      </div>
      <div class="column" id="col-done">
        <div class="col-header" style="color: var(--done)">
          <span>Done</span>
          <div class="col-indicator" style="background: var(--done)"></div>
        </div>
        <div class="task-list" id="done-list"></div>
      </div>
    </div>
  </div>

  <script>
    const addBtn = document.getElementById('addBtn');
    const taskInput = document.getElementById('taskInput');
    
    let tasks = [
      { id: 1, text: 'Design branding concepts', status: 'todo' },
      { id: 2, text: 'Configure local project environment', status: 'progress' },
      { id: 3, text: 'Refine layout components', status: 'done' }
    ];

    function renderTasks() {
      const todoList = document.getElementById('todo-list');
      const progressList = document.getElementById('progress-list');
      const doneList = document.getElementById('done-list');
      
      todoList.innerHTML = '';
      progressList.innerHTML = '';
      doneList.innerHTML = '';

      tasks.forEach(task => {
        const card = document.createElement('div');
        card.classList.add('task-card');
        
        let moveBtnHtml = '';
        if (task.status === 'todo') {
          moveBtnHtml = '<button class="action-btn" onclick="moveTask(' + task.id + ', \\'progress\\')">▶</button>';
        } else if (task.status === 'progress') {
          moveBtnHtml = '<button class="action-btn" onclick="moveTask(' + task.id + ', \\'todo\\')">◀</button>' +
                        '<button class="action-btn" onclick="moveTask(' + task.id + ', \\'done\\')">▶</button>';
        } else if (task.status === 'done') {
          moveBtnHtml = '<button class="action-btn" onclick="moveTask(' + task.id + ', \\'progress\\')">◀</button>';
        }

        card.innerHTML = \`
          <p class="task-desc">\${task.text}</p>
          <div class="task-actions">
            <button class="action-btn delete" onclick="deleteTask(\${task.id})">✕</button>
            \${moveBtnHtml}
          </div>
        \`;

        if (task.status === 'todo') todoList.appendChild(card);
        if (task.status === 'progress') progressList.appendChild(card);
        if (task.status === 'done') doneList.appendChild(card);
      });
    }

    window.moveTask = function(id, nextStatus) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.status = nextStatus;
        renderTasks();
      }
    };

    window.deleteTask = function(id) {
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
    };

    addBtn.addEventListener('click', () => {
      const text = taskInput.value.trim();
      if (text !== '') {
        tasks.push({
          id: Date.now(),
          text: text,
          status: 'todo'
        });
        taskInput.value = '';
        renderTasks();
      }
    });

    renderTasks();
  </script>
</body>
</html>`
  }
];

// Fallback logic to get prompts when matching
export const getPromptMock = (promptText: string): string => {
  const norm = promptText.toLowerCase();
  if (norm.includes('snake')) return promptLibrary.find(p => p.id === 'snake-game')?.mockCode || '';
  if (norm.includes('tic') || norm.includes('board')) return promptLibrary.find(p => p.id === 'tic-tac-toe')?.mockCode || '';
  if (norm.includes('memory') || norm.includes('card')) return promptLibrary.find(p => p.id === 'memory-game')?.mockCode || '';
  if (norm.includes('pomodoro') || norm.includes('timer')) return promptLibrary.find(p => p.id === 'pomodoro-timer')?.mockCode || '';
  if (norm.includes('photo') || norm.includes('gallery')) return promptLibrary.find(p => p.id === 'photo-portfolio')?.mockCode || '';
  if (norm.includes('kanban') || norm.includes('task')) return promptLibrary.find(p => p.id === 'kanban-board')?.mockCode || '';

  // Default fallback is a nice starter web app
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VibeCraft Preview</title>
  <style>
    body {
      background: #09090b;
      color: #fff;
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
    }
    .card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 30px;
      border-radius: 16px;
      max-width: 400px;
      text-align: center;
    }
    h1 { color: #3b82f6; }
    p { color: #aaa; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Custom Generation</h1>
    <p>We received your custom prompt: <strong>"${promptText}"</strong></p>
    <p>Please enter your Gemini API key in the settings to generate live bespoke versions using AI.</p>
  </div>
</body>
</html>`;
};
