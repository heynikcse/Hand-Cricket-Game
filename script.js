// ═══════════════════════════════════════════
//  Hand Cricket — Multiplayer Client (Fixed)
// ═══════════════════════════════════════════

const socket = io(window.location.origin);

const emojis = ["✊", "☝️", "✌️", "🤟", "🖖", "✋", "🤙"];

// ── State ──
let myName = "";
let roomCode = "";
let myMove = null;
let myTossMove = null;
let isBatting = false;
let myScore = 0;
let oppScore = 0;
let target = null;
let ballLog = [];
let stats = { mySixes: 0, myFours: 0, oppSixes: 0, oppFours: 0, myBalls: 0, oppBalls: 0 };

// ── Helpers ──
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function setStatus(id, msg, isError = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = "status-msg" + (isError ? " error" : "");
}

function disableControls(id = "game-controls") {
  const el = document.getElementById(id);
  if (el) el.querySelectorAll("button").forEach(b => b.disabled = true);
}

function enableControls(id = "game-controls") {
  const el = document.getElementById(id);
  if (el) el.querySelectorAll("button").forEach(b => {
    b.disabled = false;
    b.classList.remove("selected");
  });
}

function resetTossUI() {
  myTossMove = null;
  document.getElementById("toss-waiting-msg").style.display = "none";
  document.getElementById("toss-result").style.display = "none";
  document.getElementById("toss-choice").style.display = "none";
  document.getElementById("toss-wait-choice").style.display = "none";
  document.getElementById("toss-result-text").textContent = "";
  enableControls("toss-controls");
}

function updateNameLabels(names) {
  const oppName = names.find(n => n !== myName) || "Opponent";
  document.getElementById("opp-name-label").textContent = oppName;
  document.getElementById("score-label-opp").textContent = oppName;
  document.getElementById("score-label-you").textContent = myName;
}

// ═══════════════════════════════════════════
//  LOBBY
// ═══════════════════════════════════════════
function createRoom() {
  const nameVal = document.getElementById("player-name").value.trim();
  if (!nameVal) { setStatus("lobby-status", "Please enter your name first.", true); return; }
  myName = nameVal;
  setStatus("lobby-status", "Creating room...");
  socket.emit("createRoom", { name: myName });
}

function joinRoom() {
  const nameVal = document.getElementById("player-name").value.trim();
  const codeVal = document.getElementById("room-code-input").value.trim().toUpperCase();
  if (!nameVal) { setStatus("lobby-status", "Please enter your name first.", true); return; }
  if (!codeVal) { setStatus("lobby-status", "Please enter a room code.", true); return; }
  myName = nameVal;
  roomCode = codeVal;
  setStatus("lobby-status", "Joining room...");
  socket.emit("joinRoom", { name: myName, roomCode });
}

function copyCode() {
  navigator.clipboard.writeText(roomCode).then(() => {
    setStatus("waiting-status", "Copied!");
    setTimeout(() => setStatus("waiting-status", "Share this code with your friend"), 1500);
  });
}

// ═══════════════════════════════════════════
//  TOSS
// ═══════════════════════════════════════════
function tossPick(v) {
  if (myTossMove !== null) return;
  myTossMove = v;
  disableControls("toss-controls");
  document.getElementById("toss-waiting-msg").style.display = "block";
  socket.emit("tossPick", { roomCode, move: v });
}

function tossChoice(choice) {
  document.getElementById("toss-choice").style.display = "none";
  document.getElementById("toss-wait-choice").style.display = "block";
  document.getElementById("toss-wait-choice").textContent = "Starting game...";
  socket.emit("tossChoice", { roomCode, choice });
}

// ═══════════════════════════════════════════
//  GAME
// ═══════════════════════════════════════════
function playRound(userMove) {
  if (myMove !== null) return;
  myMove = userMove;
  disableControls();
  document.querySelectorAll("#game-controls button").forEach((b, i) => {
    if (i === userMove) b.classList.add("selected");
  });
  document.getElementById("waiting-move-msg").style.display = "block";
  socket.emit("playerMove", { roomCode, move: userMove });
}

function addBallLog(val) {
  const log = document.getElementById("ball-log");
  const d = document.createElement("div");
  d.className = "ball";
  if (val === "W")    { d.classList.add("w");    d.textContent = "W"; }
  else if (val === 6) { d.classList.add("six");  d.textContent = "6"; }
  else if (val === 4) { d.classList.add("four"); d.textContent = "4"; }
  else if (val === 0) { d.classList.add("dot");  d.textContent = "0"; }
  else                { d.classList.add("run");  d.textContent = val; }
  log.appendChild(d);
}

function updateChaseBar() {
  if (target === null) return;
  const chaser = isBatting ? myScore : oppScore;
  const pct = Math.min(100, Math.round(chaser / target * 100));
  const needed = Math.max(0, target - chaser);
  document.getElementById("chase-bar-wrap").style.display = "flex";
  document.getElementById("chase-bar-fill").style.width = pct + "%";
  document.getElementById("chase-bar-label").textContent = `Need ${needed} more`;
}

// ═══════════════════════════════════════════
//  NAVIGATION
// ═══════════════════════════════════════════
function playAgain() {
  socket.emit("requestRematch", { roomCode });
  setStatus("rematch-status", "Waiting for opponent...");
  const btn = document.querySelector("#screen-result .btn-primary");
  if (btn) btn.disabled = true;
}

function goLobby() {
  socket.emit("leaveRoom", { roomCode });
  resetClientState();
  document.getElementById("player-name").value = "";
  document.getElementById("room-code-input").value = "";
  setStatus("lobby-status", "");
  showScreen("screen-lobby");
}

function resetClientState() {
  myMove = null; myTossMove = null;
  myScore = 0; oppScore = 0; target = null;
  isBatting = false; ballLog = [];
  stats = { mySixes: 0, myFours: 0, oppSixes: 0, oppFours: 0, myBalls: 0, oppBalls: 0 };
}

// ═══════════════════════════════════════════
//  SOCKET EVENTS
// ═══════════════════════════════════════════

socket.on("roomCreated", ({ code }) => {
  roomCode = code;
  document.getElementById("room-code-display").textContent = code;
  setStatus("waiting-status", "Share this code with your friend");
  showScreen("screen-waiting");
});

socket.on("roomError", ({ message }) => {
  setStatus("lobby-status", message, true);
});

// Player 1 (creator) — opponent joined, go to toss
socket.on("playerJoined", ({ names }) => {
  updateNameLabels(names);
  setTimeout(() => {
    resetTossUI();
    showScreen("screen-toss");
  }, 500);
});

// Player 2 (joiner) — joined successfully, go to toss
socket.on("joinedRoom", ({ code, names }) => {
  roomCode = code;
  updateNameLabels(names);
  setStatus("lobby-status", "");
  setTimeout(() => {
    resetTossUI();
    showScreen("screen-toss");
  }, 300);
});

// KEY FIX: server sends "iWon" boolean per player instead of raw socket ID
socket.on("tossResult", ({ you, opp, sum, winner, iWon }) => {
  document.getElementById("toss-waiting-msg").style.display = "none";
  document.getElementById("toss-result").style.display = "block";

  const even = sum % 2 === 0;
  document.getElementById("toss-result-text").textContent =
    `You: ${you}  •  Opponent: ${opp}  •  Sum: ${sum} (${even ? "Even" : "Odd"})  →  ${winner} wins the toss!`;

  if (iWon) {
    document.getElementById("toss-choice").style.display = "block";
    document.getElementById("toss-wait-choice").style.display = "none";
  } else {
    document.getElementById("toss-choice").style.display = "none";
    document.getElementById("toss-wait-choice").style.display = "block";
    document.getElementById("toss-wait-choice").textContent = "Opponent is choosing...";
  }
});

socket.on("gameStart", ({ battingId, innings, names }) => {
  isBatting = battingId === socket.id;
  myScore = 0; oppScore = 0; target = null; ballLog = [];

  document.getElementById("ball-log").innerHTML = "";
  document.getElementById("user-score").textContent = "0";
  document.getElementById("opp-score").textContent = "0";
  document.getElementById("target").textContent = "—";
  document.getElementById("chase-bar-wrap").style.display = "none";
  document.getElementById("round-result").textContent = "";
  document.getElementById("round-result").className = "round-result";
  document.getElementById("game-innings-label").textContent = innings === 1 ? "1st Innings" : "2nd Innings";
  document.getElementById("user-score").className = "score-value";
  document.getElementById("opp-score").className = "score-value";

  const statusEl = document.getElementById("game-status");
  statusEl.textContent = isBatting ? "You are Batting 🏏" : "You are Bowling ⚾";
  statusEl.className = isBatting ? "status-inline" : "status-inline bowling";

  if (names) updateNameLabels(names);

  myMove = null;
  enableControls();
  document.getElementById("waiting-move-msg").style.display = "none";
  showScreen("screen-game");
});

socket.on("roundResult", ({ moves, batter, runs, isOut, scores, targetVal }) => {
  myMove = null;
  document.getElementById("waiting-move-msg").style.display = "none";

  const myMoveVal = moves[socket.id];
  const oppKey = Object.keys(moves).find(k => k !== socket.id);
  const oppMoveVal = oppKey ? moves[oppKey] : undefined;

  const userHand = document.getElementById("user-hand");
  const botHand = document.getElementById("bot-hand");
  userHand.classList.add("shake");
  botHand.classList.add("shake");

  setTimeout(() => {
    userHand.classList.remove("shake");
    botHand.classList.remove("shake");
    userHand.textContent = emojis[myMoveVal] ?? "✊";
    botHand.textContent = emojis[oppMoveVal ?? 0] ?? "✊";
    document.getElementById("user-move").textContent = myMoveVal ?? "?";
    document.getElementById("bot-move").textContent = oppMoveVal ?? "?";
  }, 400);

  myScore = scores[socket.id] || 0;
  const oppScoreKey = Object.keys(scores).find(k => k !== socket.id);
  oppScore = oppScoreKey ? scores[oppScoreKey] : 0;

  document.getElementById("user-score").textContent = myScore;
  document.getElementById("opp-score").textContent = oppScore;

  if (targetVal !== null && targetVal !== undefined) {
    target = targetVal;
    document.getElementById("target").textContent = target;
    updateChaseBar();
    document.getElementById(isBatting ? "user-score" : "opp-score").className = "score-value chasing";
  }

  const resultEl = document.getElementById("round-result");
  if (isOut) {
    addBallLog("W");
    resultEl.className = "round-result out";
    resultEl.textContent = batter === socket.id ? "❌ OUT! You're dismissed." : "✅ Wicket! Opponent is out.";
  } else {
    addBallLog(runs);
    if (runs === 0) {
      resultEl.className = "round-result dot";
      resultEl.textContent = "• Dot ball";
    } else {
      resultEl.className = "round-result scored";
      const label = runs === 6 ? "SIX! 🚀" : runs === 4 ? "FOUR! 💥" : `+${runs} run${runs !== 1 ? "s" : ""}`;
      resultEl.textContent = batter === socket.id ? `🏏 ${label}` : `⚾ Opponent scored ${label}`;
    }
    if (batter === socket.id) {
      stats.myBalls++; if (runs === 6) stats.mySixes++; if (runs === 4) stats.myFours++;
    } else {
      stats.oppBalls++; if (runs === 6) stats.oppSixes++; if (runs === 4) stats.oppFours++;
    }
    setTimeout(() => enableControls(), 600);
  }
});

socket.on("inningsEnd", ({ target: newTarget }) => {
  target = newTarget;
  document.getElementById("target").textContent = newTarget;
  document.getElementById("user-score").className = "score-value";
  document.getElementById("opp-score").className = "score-value";
});

socket.on("gameOver", ({ winnerId, scores, reason }) => {
  showScreen("screen-result");

  const myFinal = scores[socket.id] || 0;
  const oppKey = Object.keys(scores).find(k => k !== socket.id);
  const oppFinal = oppKey ? scores[oppKey] : 0;

  document.getElementById("final-you").textContent = myFinal;
  document.getElementById("final-opp").textContent = oppFinal;

  const icon = document.getElementById("result-icon");
  const title = document.getElementById("result-title");
  const sub = document.getElementById("result-subtitle");
  const rematch = document.querySelector("#screen-result .btn-primary");
  if (rematch) rematch.disabled = false;

  if (winnerId === socket.id) {
    icon.textContent = "🏆"; title.textContent = "You Win!"; title.style.color = "#95d5b2";
    sub.textContent = `Won by ${Math.abs(myFinal - oppFinal)} runs!`;
  } else if (!winnerId) {
    icon.textContent = "🤝"; title.textContent = "It's a Tie!"; title.style.color = "#f4c542";
    sub.textContent = "Perfectly matched!";
  } else {
    icon.textContent = "😔"; title.textContent = "You Lost"; title.style.color = "#ff6b6b";
    sub.textContent = `Lost by ${Math.abs(myFinal - oppFinal)} runs. ${reason || ""}`;
  }

  document.getElementById("final-stats").innerHTML =
    `<b>Your innings:</b> ${stats.myBalls} balls · ${stats.mySixes} sixes · ${stats.myFours} fours<br>` +
    `<b>Opponent:</b> ${stats.oppBalls} balls · ${stats.oppSixes} sixes · ${stats.oppFours} fours`;
  setStatus("rematch-status", "");
});

socket.on("waitingForRematch", () => {
  setStatus("rematch-status", "Waiting for opponent...");
});

socket.on("rematchReady", () => {
  resetClientState();
  resetTossUI();
  showScreen("screen-toss");
});

socket.on("opponentLeft", () => {
  alert("Opponent disconnected. Returning to lobby.");
  resetClientState();
  showScreen("screen-lobby");
});

socket.on("connect_error", () => {
  setStatus("lobby-status", "Cannot connect to server. Is it running?", true);
});