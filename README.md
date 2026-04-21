Got you bro 😄🔥 — here’s a **clean, professional, portfolio-ready README** updated for your **multiplayer Socket.IO version + deployment**

You can directly copy-paste this into your GitHub `README.md` 👇

---

# 🏏 Hand Cricket — Multiplayer

A real-time multiplayer implementation of the classic **Hand Cricket** game built using **Node.js, Socket.IO, and Vanilla JavaScript**. Play with your friends online with smooth animations, live score updates, and an interactive UI.

---

## 🚀 Live Demo

🌐 [https://your-render-link.onrender.com](https://your-render-link.onrender.com)
*(replace with your actual Render link)*

---

## 🎮 Features

* 🔗 **Real-time Multiplayer** using Socket.IO
* 🧠 **Smart Game Logic** (Batting & Bowling phases)
* 🎲 **Toss System** (Even/Odd logic with fair winner selection)
* 📊 **Live Scoreboard** with target chasing
* 🎬 **Smooth Animations** (hand gestures + transitions)
* 📱 **Responsive UI** (works on mobile & desktop)
* 🔄 **Rematch System**
* ⚡ **Fast & Lightweight Frontend (Vanilla JS)**

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend:** Node.js, Express
* **Realtime Engine:** Socket.IO
* **Deployment:** Render

---

## 📁 Project Structure

```text
hand-cricket/
│
├── index.html        # UI structure
├── style.css         # Styling & animations
├── script.js         # Frontend logic + socket handling
├── server.js         # Backend server + game logic
├── package.json      # Dependencies & scripts
├── package-lock.json # Dependency lock
├── .gitignore        # Ignored files
```

---

## 🧠 How the Game Works

1. **Toss Phase**

   * Both players choose a number (0–6)
   * Sum decides winner:

     * Even → Player 1 wins
     * Odd → Player 2 wins

2. **Game Phase**

   * One player bats, other bowls
   * Same number → OUT ❌
   * Different → runs added ✅

3. **Second Innings**

   * Target is set
   * Opponent tries to chase

4. **Winning**

   * Higher score wins 🏆

---

## ▶️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Hand-Cricket-Game.git
cd Hand-Cricket-Game
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Start server

```bash
npm start
```

---

### 4. Open in browser

```text
http://localhost:3000
```

---

## 🌍 Deployment

This project is deployed using **Render**:

* Build Command: `npm install`
* Start Command: `npm start`

---

## 🔧 Important Configuration

### Socket Connection (Frontend)

```javascript
const socket = io(window.location.origin);
```

---

### Server Setup (CORS + Port)

```javascript
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const PORT = process.env.PORT || 3000;
```

---

## 🌟 Future Improvements

* 🤖 Single-player (Bot mode)
* 🔊 Sound effects (bat hit, crowd, out)
* 🏆 Leaderboard system
* 🎯 Match history
* 🎨 Advanced UI (game-style animations)

---

## 👨‍💻 Author

**Nikhil Raj**
B.Tech Computer Science Student

---

## ⭐ Show Your Support

If you like this project:

* ⭐ Star this repo
* 🍴 Fork it
* 🛠️ Contribute

---

# 💯 FINAL NOTE

This project demonstrates:

* Real-time communication (Socket.IO)
* Full-stack development
* Game logic design
* Deployment skills





