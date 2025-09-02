# Who Wants to be a Web Developer? 🎮

An interactive quiz game testing knowledge of HTML, CSS, and JavaScript, with support for custom quizzes!

## 🚀 Quick Start

### Option 1: Full Functionality (Recommended)
For **dynamic custom quiz loading** and all features:

**Windows:**
```bash
# Double-click start-server.bat
# OR run in terminal:
python start-server.py
```

**Mac/Linux:**
```bash
python3 start-server.py
# OR
python start-server.py
```

Then open: **http://localhost:8000**

### Option 2: Basic Functionality
For **basic gameplay** (no custom quiz loading):

- Double-click `index.html` to open directly in browser
- Will use built-in HTML, CSS, and JavaScript questions only

## 📝 Features

### ✅ Game Modes
- **Individual Player** - Single player quiz
- **Team Tournament** - Multiple teams compete

### ✅ Built-in Quiz Topics
- **HTML Questions** - Markup and structure
- **CSS Questions** - Styling and layout (with visual answers!)
- **JavaScript Questions** - Programming and logic
- **Sample Custom Quiz** - Example for creating your own

### ✅ Visual CSS Answers
CSS questions show **actual visual representations**:
- Text styling with real colors and fonts
- Layout demonstrations with flexbox/grid
- Visual effects like shadows and gradients
- Responsive examples

### ✅ Game Features
- **Progressive difficulty** (Easy → Medium → Hard)
- **Lifelines** (50:50, Ask Audience, Phone a Friend)
- **Auto-save progress** - Resume anytime
- **Team scoring** - Track multiple teams
- **Audio effects** - Toggle sound on/off

## 🎯 Custom Quizzes

### Creating Your Own Quiz
1. Create a new `.json` file in the `quizzes/` folder
2. Follow the format in `quizzes/sample-custom.json`
3. Add your quiz to `quizzes/quizzes.json` manifest
4. Restart the server to see your quiz

### Quiz Format
```json
{
  "name": "My Quiz",
  "description": "Quiz about my topic",
  "easy": [
    {
      "question": "Your question here?",
      "answers": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why this answer is correct."
    }
  ],
  "medium": [ /* ... */ ],
  "hard": [ /* ... */ ]
}
```

See `quizzes/README.md` for detailed instructions.

## 🎮 How to Play

1. **Choose Game Mode** - Individual or Team Tournament
2. **Select Topic** - Pick your quiz subject  
3. **Choose Difficulty** - Easy, Medium, or Hard
4. **Answer Questions** - Select from 4 options
5. **Use Lifelines** - Get help when stuck
6. **Win Big!** - Reach the million-dollar question

## 🔧 Technical Requirements

- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Python 3.x** (for dynamic quiz loading)
- **Local files** must be served via web server for full functionality

## 🎨 Game Assets

- **Visual CSS demonstrations** - See your code in action
- **Syntax highlighting** - Pretty code formatting
- **Responsive design** - Works on desktop and mobile
- **Audio effects** - Immersive game sounds

## 🐛 Troubleshooting

### "Failed to fetch" errors:
- **Cause**: Opening `index.html` directly (file:// protocol)
- **Solution**: Use `start-server.py` or `start-server.bat`

### Custom quizzes not appearing:
- Ensure `quizzes.json` manifest includes your quiz
- Check JSON syntax is valid
- Restart the server after adding quizzes

### Python not found:
- Install Python from [python.org](https://www.python.org/)
- Ensure Python is added to system PATH

## 📁 Project Structure

```
Wheel of Fortune Web Game/
├── index.html              # Main game page
├── script.js               # Game logic
├── styles.css              # Game styling
├── start-server.py         # Local server (Python)
├── start-server.bat        # Server launcher (Windows)
├── README.md              # This file
└── quizzes/               # Quiz data
    ├── quizzes.json       # Quiz manifest
    ├── html.json          # HTML questions
    ├── css.json           # CSS questions
    ├── javascript.json    # JavaScript questions
    ├── sample-custom.json # Example custom quiz
    └── README.md          # Quiz creation guide
```

## 🤝 Contributing

Feel free to:
- Add new quiz topics
- Improve question quality
- Enhance visual representations
- Fix bugs and add features

## 📜 License

This project is open source. Feel free to use, modify, and share!

---

**🎮 Happy Quizzing!** Test your web development knowledge and challenge your friends!