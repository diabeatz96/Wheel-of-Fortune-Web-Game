# Who Wants to be a Web Developer? 🎮

An interactive quiz game testing knowledge of HTML, CSS, and JavaScript, with support for custom quizzes!

## 🚀 Quick Start

**Requires a web server** - The application must be served over HTTP (not file://) to load quiz JSON files.

### Option 1: VS Code Live Server (Recommended)
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. Game opens automatically at `http://127.0.0.1:5500`

### Option 2: Node.js Server
```bash
npx serve .
# Opens at http://localhost:3000
```

### Option 3: Other Web Servers
```bash
# Python (if you have it)
python -m http.server 8000

# Any other HTTP server pointing to the project directory
```

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
- **Web server** (VS Code Live Server, Node.js, or any HTTP server)
- **Local files** must be served via web server for full functionality

## 🎨 Game Assets

- **Visual CSS demonstrations** - See your code in action
- **Syntax highlighting** - Pretty code formatting
- **Responsive design** - Works on desktop and mobile
- **Audio effects** - Immersive game sounds

## 🐛 Troubleshooting

### "Failed to fetch" errors:
- **Cause**: Opening `index.html` directly (file:// protocol)
- **Solution**: Use VS Code Live Server, `npx serve .`, or any web server

### Custom quizzes not appearing:
- Ensure `quizzes.json` manifest includes your quiz
- Check JSON syntax is valid
- Restart the server after adding quizzes

## 📁 Project Structure

```
Wheel of Fortune Web Game/
├── index.html              # Main game page
├── script.js               # Game logic (MillionaireGame class)
├── styles.css              # Game styling and themes
├── README.md              # This file
├── assets/                # Game assets
│   └── sounds/           # Audio files (optional)
└── quizzes/               # Quiz data directory
    ├── quizzes.json       # Quiz manifest (required)
    ├── html.json          # HTML questions
    ├── css.json           # CSS questions  
    ├── javascript.json    # JavaScript questions
    ├── sample-custom.json # Example custom quiz
    └── README.md          # Quiz creation guide
```

## 💻 JavaScript Architecture

### Core Game Class
The entire game is built around the `MillionaireGame` class in `script.js`:

```javascript
class MillionaireGame {
    constructor() {
        // Initialize game state, audio, and load questions
    }
}
```

### Key Components

#### 🎮 Game State Management
- **`currentQuestion`** - Tracks progress (0-9)
- **`currentTopic`** - Selected quiz topic 
- **`gameMode`** - 'individual' or 'team'
- **`teams`** - Array of team names (team mode)
- **`teamStats`** - Map storing team scores and progress
- **`usedLifelines`** - Object tracking which lifelines are used

#### 💾 Data Persistence
- **`saveGameState()`** - Saves progress to localStorage
- **`loadGameState()`** - Restores saved games
- **`hasSavedGame()`** - Checks for existing saves
- **`clearSavedGame()`** - Removes save data

#### 📚 Question Management
- **`initializeQuestions()`** - Loads quiz data from JSON files
- **`generateTopicButtons()`** - Creates dynamic topic selection
- **`loadQuestion()`** - Displays current question with markdown support
- **`selectAnswer()`** - Handles answer selection and validation

#### 👥 Team Tournament System
- **`addTeam()` / `removeTeam()`** - Manage team roster
- **`getCurrentTeam()`** - Get active team
- **`moveToNextTeam()`** - Rotate through teams
- **`updateTeamUI()`** - Update team display
- **`showTeamDecision()`** - Risk/reward choices

#### 🎯 Game Flow Methods
- **`selectTopic()` → `selectDifficulty()` → `loadQuestion()` → `selectAnswer()` → `revealAnswer()`**
- **`proceedToNext()`** - Advances game or ends
- **`endGame()`** - Shows results and options

#### 🔊 Audio System
- **`initAudio()`** - Loads sound effects
- **`playSound()` / `playBackgroundMusic()`** - Audio control
- **`toggleAudio()`** - Mute/unmute functionality

### Data Flow

1. **Initialization**: `constructor()` → `initAudio()` → `init()`
2. **Question Loading**: `initializeQuestions()` fetches JSON quiz data
3. **Game Start**: User selects mode → topic → difficulty → questions loaded
4. **Gameplay Loop**: Question display → answer selection → validation → next question
5. **Persistence**: Auto-save after each correct answer or team progression

### Event Handling
All user interactions are bound in `bindEvents()`:
- Button clicks for navigation and answers
- Lifeline activations
- Team management actions
- Modal controls

## 🍴 How to Fork This Project

### 1. Fork the Repository
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/wheel-of-fortune-web-game.git
cd wheel-of-fortune-web-game
```

### 2. Set Up Development Environment
```bash
# No dependencies needed! Just start a web server
npx serve .
# OR use VS Code Live Server extension
```

### 3. Project Customization Ideas

#### 🎨 Visual Themes
- Modify `styles.css` for different color schemes
- Update the money ladder values in `script.js`
- Change audio files in `assets/sounds/`

#### 📝 Quiz Content
- Add new topics by creating `.json` files in `quizzes/`
- Update `quizzes/quizzes.json` to include new topics
- Follow the structure in `sample-custom.json`

#### 🎮 Game Mechanics
- Modify lifeline behaviors in `useFiftyFifty()`, `askAudience()`, `phoneAFriend()`
- Add new lifelines by extending the `usedLifelines` object
- Change difficulty levels or question counts

#### 👥 Team Features
- Modify team scoring in `updateTeamUI()`
- Add team statistics tracking
- Implement different tournament formats

### 4. Common Customizations

#### Adding a New Quiz Topic
```bash
# 1. Create quiz file
echo '{"name":"My Topic","easy":[...],"medium":[...],"hard":[...]}' > quizzes/my-topic.json

# 2. Update manifest
# Edit quizzes/quizzes.json to include:
{
  "id": "my-topic",
  "name": "My Topic Name", 
  "description": "Description here",
  "file": "my-topic.json"
}
```

#### Modifying Game Settings
```javascript
// In script.js constructor, change:
this.moneyLadder = ["$1", "$5", "$10", ...]; // Custom prizes
this.currentQuestion = 0; // Starting question
// Add new properties for your features
```

#### Styling Changes
```css
/* In styles.css, modify: */
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
}
```

### 5. Development Tips

#### Testing Your Changes
- Always test both individual and team modes
- Verify save/load functionality works
- Check all lifelines function properly
- Test with different quiz topics

#### Code Structure Best Practices
- Keep game state methods together
- Separate UI updates from game logic
- Use consistent naming conventions
- Add comments for complex functionality

#### Debugging
- Use browser dev tools console
- Enable verbose logging in `initializeQuestions()`
- Test with malformed JSON to handle errors gracefully

## 🤝 Contributing

Feel free to:
- Add new quiz topics
- Improve question quality
- Enhance visual representations
- Fix bugs and add features
- Submit pull requests with improvements

## 📜 License

This project is open source. Feel free to use, modify, and share!

---

**🎮 Happy Quizzing!** Test your web development knowledge and challenge your friends!