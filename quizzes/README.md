# Custom Quizzes

This folder contains the quiz questions for the "Who Wants to be a Web Developer?" game.

## Default Quizzes

The game comes with three default quizzes:
- `html.json` - HTML markup and structure questions
- `css.json` - CSS styling and layout questions  
- `javascript.json` - JavaScript programming questions

## Adding Your Own Quiz

To create a custom quiz, follow these steps:

### 1. Create a new JSON file
Create a new `.json` file in the `quizzes` folder (e.g., `my-quiz.json`)

### 2. Follow the quiz format
Your quiz file should follow this structure:

```json
{
  "name": "My Custom Quiz",
  "description": "Description of what this quiz covers",
  "easy": [
    {
      "question": "Your question here?",
      "answers": [
        "Option A",
        "Option B", 
        "Option C",
        "Option D"
      ],
      "correct": 0,
      "explanation": "Explanation of the correct answer."
    }
  ],
  "medium": [
    // Medium difficulty questions...
  ],
  "hard": [
    // Hard difficulty questions...
  ]
}
```

### 3. Update the quiz manifest
Add your quiz to `quizzes.json`:

```json
{
  "default": ["html", "css", "javascript"],
  "available": [
    // ... existing quizzes ...
    {
      "id": "my-quiz",
      "name": "My Custom Quiz", 
      "description": "Description of what this quiz covers",
      "file": "my-quiz.json"
    }
  ]
}
```

### 4. Question Format Guidelines

#### Basic Questions
- Use plain text for simple questions
- Provide 4 answer options
- Set `correct` to the index (0-3) of the correct answer
- Include an `explanation` for the correct answer

#### Code Questions  
Use markdown code blocks for code examples:

```json
{
  "question": "What will this code output?\n\n```javascript\nconsole.log('Hello World');\n```",
  "answers": [
    "```\nHello World\n```",
    "```\nundefined\n```",
    "// ... more options
  ]
}
```

#### Visual HTML/CSS Answers
For HTML/CSS questions, you can use actual HTML in answers to show visual results:

```json
{
  "question": "How will this CSS style the text?\n\n```css\n.title { color: red; }\n```",
  "answers": [
    "<span style='color: red;'>Red Text</span>",
    "<span style='color: blue;'>Blue Text</span>",
    // ... more options
  ]
}
```

## Example
See `sample-custom.json` for a complete example of a custom quiz.

## Tips
- Include questions of varying difficulty
- Write clear, concise questions
- Provide helpful explanations
- Test your quiz by playing the game
- Use visual examples for HTML/CSS questions when possible