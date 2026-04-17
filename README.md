# 🏏 Hand Cricket Game

A web-based implementation of the classic Hand Cricket game, built with a focus on clean logic, smooth animations, and a responsive user interface. This project features a **Human vs Bot gameplay loop** with two distinct phases: **Batting and Bowling**.

---

## 🚀 Features

* 🎮 **Interactive Gameplay:** User vs Bot logic where moves are compared to determine runs or an "OUT" state
* 🔄 **Two-Phase System:** Seamless transition from batting to bowling after an OUT
* 📊 **Dynamic UI:** Real-time scoreboard updates and target chasing
* 🎬 **Smooth Animations:** CSS-based "shake" effect for realistic hand movement
* 📱 **Responsive Design:** Clean layout using Flexbox for multiple screen sizes

---

## 🛠️ Tech Stack

* **HTML5** → Structure and layout
* **CSS3** → Styling and animations (`@keyframes`)
* **JavaScript (Vanilla)** → Game logic, state handling, DOM manipulation

---

## 📁 Project Structure

```text
hand-cricket/
│
├── index.html     # Main UI structure
├── style.css      # Styling and animations
├── script.js      # Game logic
```

---

## 🧠 Core Game Logic

The game works on a simple comparison system:

1. **User Input:** Select a number (0–6)

2. **Bot Move:** Random number generated using:

   ```javascript
   Math.floor(Math.random() * 7)
   ```

3. **Comparison:**

   * If numbers match → **OUT ❌**
   * If numbers differ → **Runs added ✅**

4. **Game State:**

   * Controlled using:

     ```javascript
     isUserBatting
     ```
   * Switches between batting and bowling phases

---

## 🏁 How to Run

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/hand-cricket-game.git
   ```

2. Navigate to the project folder:

   ```bash
   cd hand-cricket-game
   ```

3. Open the game:

   * Double click `index.html`
     **OR**
   * Use VS Code Live Server extension

---

## 🌟 Future Improvements

* 🔊 Sound effects (crowd, batting, out)
* 🎯 Toss system
* ⏱️ Over-based gameplay
* 🤖 Smart AI bot
* 🌐 Online multiplayer mode
* ⚛️ React version

---

## 📌 Author

**Nikhil Raj**

---

## ⭐ Show Your Support

If you like this project:

* ⭐ Star this repo
* 🍴 Fork it
* 🛠️ Contribute


