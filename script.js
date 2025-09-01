class MillionaireGame {
    constructor() {
        this.currentQuestion = 0;
        this.currentTopic = null;
        this.currentDifficulty = null;
        this.gameOver = false;
        this.usedLifelines = {
            fiftyFifty: false,
            askAudience: false,
            phoneAFriend: false
        };
        this.gameMode = 'individual'; // 'individual' or 'team'
        this.teams = [];
        this.currentTeamIndex = 0;
        this.teamStats = new Map(); // Store team scores and progress
        this.moneyLadder = [
            "1 Ramen Cup", 
            "1 Energy Drink", 
            "1 Pizza Slice", 
            "1 Coffee & Donut", 
            "1 Movie Ticket", 
            "1 Textbook (Used!)", 
            "1 Gaming Headset", 
            "1 Laptop Upgrade", 
            "1 Semester Parking Pass", 
            "1 MILLION DOLLARS!"
        ];
        this.questions = this.initializeQuestions();
        this.currentQuestions = [];
        this.audioEnabled = false;
        this.currentBackgroundMusic = null;
        this.initAudio();
        this.init();
    }

    initAudio() {
        this.sounds = {
            introMusic: new Audio('assets/sounds/intro-music.mp3'),
            questionTension: new Audio('assets/sounds/question-tension.mp3'),
            finalAnswerTension: new Audio('assets/sounds/final-answer-tension.mp3'),
            correctAnswer: new Audio('assets/sounds/correct-answer.mp3'),
            wrongAnswer: new Audio('assets/sounds/wrong-answer.mp3'),
            buttonHover: new Audio('assets/sounds/button-hover.mp3'),
            answerSelect: new Audio('assets/sounds/answer-select.mp3'),
            fiftyFifty: new Audio('assets/sounds/fifty-fifty.mp3'),
            askAudience: new Audio('assets/sounds/ask-audience.mp3'),
            phoneAFriend: new Audio('assets/sounds/phone-friend.mp3'),
            moneyWin: new Audio('assets/sounds/money-win.mp3'),
            jackpotWin: new Audio('assets/sounds/jackpot-win.mp3')
        };

        // Set volume levels
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.6;
            sound.preload = 'auto';
        });

        // Background music should loop and be quieter
        this.sounds.introMusic.loop = true;
        this.sounds.questionTension.loop = true;
        this.sounds.introMusic.volume = 0.3;
        this.sounds.questionTension.volume = 0.2;
    }

    playSound(soundName) {
        if (!this.audioEnabled) return;
        try {
            const sound = this.sounds[soundName];
            if (sound) {
                sound.currentTime = 0;
                sound.play().catch(e => console.log('Audio play failed:', e));
            }
        } catch (e) {
            console.log('Sound not found:', soundName);
        }
    }

    playBackgroundMusic(soundName) {
        if (!this.audioEnabled) return;
        try {
            // Stop current background music
            if (this.currentBackgroundMusic) {
                this.currentBackgroundMusic.pause();
                this.currentBackgroundMusic.currentTime = 0;
            }
            
            // Start new background music
            const sound = this.sounds[soundName];
            if (sound) {
                this.currentBackgroundMusic = sound;
                sound.currentTime = 0;
                sound.play().catch(e => console.log('Background music play failed:', e));
            }
        } catch (e) {
            console.log('Background music not found:', soundName);
        }
    }

    stopBackgroundMusic() {
        if (this.currentBackgroundMusic) {
            this.currentBackgroundMusic.pause();
            this.currentBackgroundMusic.currentTime = 0;
            this.currentBackgroundMusic = null;
        }
    }

    initializeQuestions() {
        return {
            html: {
                easy: [
                    {
                        question: "What will this HTML code render?\n\n```html\n<div>\n  <h2>Welcome</h2>\n  <p>Hello <strong>World</strong>!</p>\n  <ul>\n    <li>Item 1</li>\n    <li>Item 2</li>\n  </ul>\n</div>\n```",
                        answers: [
                            "<h2>Welcome</h2><p>Hello <strong>World</strong>!</p><ul><li>Item 1</li><li>Item 2</li></ul>", 
                            "<h2>Welcome</h2><p>Hello <strong>World</strong>!</p><ol><li>Item 1</li><li>Item 2</li></ol>",
                            "<h2 style='text-transform:uppercase'>Welcome</h2><p>Hello <strong>World</strong>!</p><ul><li>Item 1</li><li>Item 2</li></ul>",
                            "<h2>Welcome</h2><p>Hello <strong style='text-transform:uppercase'>WORLD</strong>!</p><ul><li>Item 1</li><li>Item 2</li></ul>"
                        ],
                        correct: 0,
                        explanation: "The <h2> renders as normal heading, <strong> makes text bold (not caps), and <ul> creates bullet points (not numbers)."
                    },
                    {
                        question: "What will this HTML form render?\n\n```html\n<form>\n  <label for='email'>Email:</label>\n  <input type='email' id='email' required>\n  <input type='submit' value='Send'>\n</form>\n```",
                        answers: [
                            "<label>Email:</label> <input type='text' style='border:1px solid #ccc; padding:2px'> <input type='submit' value='Send' style='padding:2px 8px'>",
                            "<label>Email:</label> <input type='email' required style='border:1px solid #ccc; padding:2px'> <input type='submit' value='Send' style='padding:2px 8px'>", 
                            "<input type='email' required style='border:1px solid #ccc; padding:2px'> <input type='submit' value='Send' style='padding:2px 8px'>",
                            "<span>Email</span> <input type='email' style='border:1px solid #ccc; padding:2px'> <span>Send</span>"
                        ],
                        correct: 1,
                        explanation: "The label creates 'Email:' text, type='email' creates a validated email field, and type='submit' creates a Send button."
                    },
                    {
                        question: "How will this table render?\n\n```html\n<table border='1'>\n  <tr>\n    <th>Name</th>\n    <th>Age</th>\n  </tr>\n  <tr>\n    <td>John</td>\n    <td>25</td>\n  </tr>\n</table>\n```",
                        answers: [
                            "<table border='1' style='border-collapse:collapse'><tr><th style='padding:4px;font-weight:bold'>Name</th><th style='padding:4px;font-weight:bold'>Age</th></tr><tr><td style='padding:4px'>John</td><td style='padding:4px'>25</td></tr></table>",
                            "<div>Name Age</div><div>John 25</div>",
                            "<table border='1' style='border-collapse:collapse'><tr><th style='padding:4px;font-weight:bold;text-transform:uppercase'>Name</th><th style='padding:4px;font-weight:bold;text-transform:uppercase'>Age</th></tr><tr><td style='padding:4px'>John</td><td style='padding:4px'>25</td></tr></table>", 
                            "<div>Name: John</div><div>Age: 25</div>"
                        ],
                        correct: 0,
                        explanation: "<th> creates header cells (bold by default), <td> creates data cells, and border='1' adds table borders."
                    },
                    {
                        question: "What does this HTML structure render?\n\n```html\n<div>\n  <img src='logo.png' alt='Company Logo' width='100'>\n  <a href='#home'>Home</a> |\n  <a href='#about'>About</a>\n</div>\n```",
                        answers: [
                            "<img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjY2NjIi8+Cjx0ZXh0IHg9IjUwIiB5PSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MT0dPPC90ZXh0Pgo8L3N2Zz4K' alt='Company Logo' width='100'> <a href='#home' style='color:blue;text-decoration:underline'>Home</a> | <a href='#about' style='color:blue;text-decoration:underline'>About</a>",
                            "<span>Company Logo</span> <a href='#home' style='color:blue;text-decoration:underline'>Home</a> | <a href='#about' style='color:blue;text-decoration:underline'>About</a>",
                            "<span>logo.png</span> <a href='#home' style='color:blue;text-decoration:underline'>Home</a> | <a href='#about' style='color:blue;text-decoration:underline'>About</a>", 
                            "<img src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMTAwIDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjY2NjIi8+Cjx0ZXh0IHg9IjUwIiB5PSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MT0dPPC90ZXh0Pgo8L3N2Zz4K' alt='Company Logo' width='100'> <span style='text-transform:uppercase'><a href='#home' style='color:blue;text-decoration:underline'>HOME</a> | <a href='#about' style='color:blue;text-decoration:underline'>ABOUT</a></span>"
                        ],
                        correct: 0,
                        explanation: "<img> displays the actual image at 100px width, while <a> tags create clickable links. Alt text only shows if image fails to load."
                    },
                    {
                        question: "What will this nested HTML render?\n\n```html\n<div>\n  <select name='country'>\n    <option value='us'>United States</option>\n    <option value='ca' selected>Canada</option>\n    <option value='mx'>Mexico</option>\n  </select>\n</div>\n```",
                        answers: [
                            "<select><option>United States</option><option selected>Canada</option><option>Mexico</option></select>",
                            "<select><option selected>United States</option><option>Canada</option><option>Mexico</option></select>", 
                            "<div>United States</div><div>Canada</div><div>Mexico</div>",
                            "<input type='radio' name='country'> United States<br><input type='radio' name='country' checked> Canada<br><input type='radio' name='country'> Mexico"
                        ],
                        correct: 0,
                        explanation: "The <select> creates a dropdown, and the 'selected' attribute on the Canada option makes it the default choice."
                    },
                    {
                        question: "How does this HTML render?\n\n```html\n<blockquote>\n  <p>\"To be or not to be\"</p>\n  <cite>Shakespeare</cite>\n</blockquote>\n```",
                        answers: [
                            "<blockquote style='margin-left:40px;font-style:italic'><p>\"To be or not to be\"</p><cite style='font-style:italic'>Shakespeare</cite></blockquote>",
                            "<span>\"To be or not to be\" Shakespeare</span>",
                            "<div style='text-transform:uppercase'>TO BE OR NOT TO BE<br>SHAKESPEARE</div>", 
                            "<span>\"To be or not to be\" - Shakespeare</span>"
                        ],
                        correct: 0,
                        explanation: "<blockquote> indents the content, <p> creates a paragraph, and <cite> typically renders in italics for citations."
                    },
                    {
                        question: "What will this code structure render?\n\n```html\n<dl>\n  <dt>HTML</dt>\n  <dd>Markup Language</dd>\n  <dt>CSS</dt>\n  <dd>Style Sheets</dd>\n</dl>\n```",
                        answers: [
                            "<dl><dt style='font-weight:bold'>HTML</dt><dd style='margin-left:20px'>Markup Language</dd><dt style='font-weight:bold'>CSS</dt><dd style='margin-left:20px'>Style Sheets</dd></dl>",
                            "<div>HTML: Markup Language</div><div>CSS: Style Sheets</div>",
                            "<ul><li>HTML - Markup Language</li><li>CSS - Style Sheets</li></ul>",
                            "<ol><li>HTML Markup Language</li><li>CSS Style Sheets</li></ol>"
                        ],
                        correct: 0,
                        explanation: "<dl> creates a description list, <dt> are terms (bold), and <dd> are descriptions (indented)."
                    },
                    {
                        question: "How will this form section render?\n\n```html\n<fieldset>\n  <legend>Contact Info</legend>\n  <input type='text' placeholder='Name'>\n  <input type='tel' placeholder='Phone'>\n</fieldset>\n```",
                        answers: [
                            "<fieldset style='border:2px groove;padding:10px'><legend style='padding:0 5px'>Contact Info</legend><input type='text' placeholder='Name' style='margin:5px;padding:2px'> <input type='tel' placeholder='Phone' style='margin:5px;padding:2px'></fieldset>",
                            "<div>Contact Info</div><input type='text' placeholder='Name' style='margin:5px;padding:2px'> <input type='tel' placeholder='Phone' style='margin:5px;padding:2px'>",
                            "<input type='text' placeholder='Name' style='margin:5px;padding:2px'> <input type='tel' placeholder='Phone' style='margin:5px;padding:2px'><div>Contact Info</div>", 
                            "<span>Contact Info: </span><input type='text' placeholder='Name' style='margin:5px;padding:2px'> <input type='tel' placeholder='Phone' style='margin:5px;padding:2px'>"
                        ],
                        correct: 0,
                        explanation: "<fieldset> creates a bordered box around form elements, <legend> creates a title in the border, and type='tel' creates a phone input."
                    },
                    {
                        question: "What does this semantic HTML render?\n\n```html\n<article>\n  <header><h1>News Title</h1></header>\n  <p>Article content here.</p>\n  <footer>Published: 2024</footer>\n</article>\n```",
                        answers: [
                            "<article><header><h1 style='font-size:2em;font-weight:bold;margin:0.67em 0'>News Title</h1></header><p>Article content here.</p><footer style='font-size:0.9em;color:#666'>Published: 2024</footer></article>",
                            "<article><header><h1 style='text-transform:uppercase;font-size:2em;font-weight:bold;margin:0.67em 0'>NEWS TITLE</h1></header><p>Article content here.</p><footer style='font-size:0.9em;color:#666'>Published: 2024</footer></article>",
                            "<div><strong>Header:</strong> News Title</div><div>Article content here.</div><div><strong>Footer:</strong> Published: 2024</div>",
                            "<span>News Title | Article content here. | Published: 2024</span>"
                        ],
                        correct: 0,
                        explanation: "Semantic tags don't change visual appearance by default. <h1> is large, <p> is normal text, content flows vertically."
                    }
                ],
                medium: [
                    {
                        question: "How will this HTML5 form validation render and behave?\n\n```html\n<form novalidate>\n  <input type='email' required>\n  <input type='number' min='18' max='99' value='25'>\n  <button type='submit'>Submit</button>\n</form>\n```",
                        answers: [
                            "Email field with built-in validation, number field (18-99), submit works with validation",
                            "Email field without validation, number field (18-99), submit works without validation", 
                            "Both fields validate normally and submit button validates form",
                            "Email field validates, number field doesn't, mixed validation behavior"
                        ],
                        correct: 1,
                        explanation: "The 'novalidate' attribute on the form disables HTML5 validation, so fields won't show validation errors despite having validation attributes."
                    },
                    {
                        question: "What structure will this HTML5 semantic code create?\n\n```html\n<article>\n  <header><h2>Blog Post</h2></header>\n  <section>\n    <p>Content paragraph</p>\n  </section>\n  <aside>Related links</aside>\n  <footer>Posted: 2024</footer>\n</article>\n```",
                        answers: [
                            "Blog Post (heading)\nContent paragraph\nRelated links (sidebar)\nPosted: 2024 (footer)",
                            "All content in a single line", 
                            "Only the heading and paragraph are visible",
                            "Content appears in reverse order"
                        ],
                        correct: 0,
                        explanation: "HTML5 semantic elements structure content logically: header contains title, section holds main content, aside is supplementary, footer has metadata."
                    },
                    {
                        question: "How will this responsive HTML image element behave?\n\n```html\n<img src='small.jpg' \n     srcset='medium.jpg 768w, large.jpg 1200w' \n     sizes='(max-width: 768px) 100vw, 50vw' \n     alt='Responsive image'>\n```",
                        answers: [
                            "Always loads small.jpg regardless of screen size",
                            "Loads medium.jpg on tablets, large.jpg on desktop, adjusts width accordingly", 
                            "Loads all three images simultaneously",
                            "Only works on mobile devices"
                        ],
                        correct: 1,
                        explanation: "The srcset provides different image sources based on viewport width, and sizes controls how much space the image takes up."
                    },
                    {
                        question: "Which HTML5 input type provides built-in email validation?",
                        answers: ["<input type='text' pattern='email'>", "<input type='email'>", "<input type='validation'>", "<input type='mail'>"],
                        correct: 1,
                        explanation: "<input type='email'> provides built-in email validation and shows an appropriate keyboard on mobile devices."
                    },
                    {
                        question: "What is the difference between <div> and <span> elements?",
                        answers: ["No difference", "<div> is block-level, <span> is inline", "<span> is block-level, <div> is inline", "Both are inline"],
                        correct: 1,
                        explanation: "<div> is a block-level element that creates a new line, while <span> is inline and doesn't break the flow of text."
                    },
                    {
                        question: "Which attribute makes a form field required?",
                        answers: ["mandatory", "validate", "required", "needed"],
                        correct: 2,
                        explanation: "The 'required' attribute prevents form submission if the field is empty, providing built-in validation."
                    },
                    {
                        question: "What does the 'alt' attribute do in an img tag?",
                        answers: ["Alters the image", "Provides alternative text for accessibility", "Changes image alignment", "Sets image altitude"],
                        correct: 1,
                        explanation: "The 'alt' attribute provides alternative text for screen readers and displays when images fail to load."
                    },
                    {
                        question: "Which HTML5 element represents a section of content?",
                        answers: ["<div>", "<section>", "<content>", "<part>"],
                        correct: 1,
                        explanation: "<section> is a semantic HTML5 element that represents a distinct section of content with a common theme."
                    },
                    {
                        question: "What is the correct HTML for creating a dropdown list?",
                        answers: ["<select>", "<dropdown>", "<list>", "<input type='dropdown'>"],
                        correct: 0,
                        explanation: "<select> creates a dropdown list, with <option> elements defining the available choices."
                    },
                    {
                        question: "Which HTML element specifies a footer for a document or section?",
                        answers: ["<bottom>", "<end>", "<footer>", "<foot>"],
                        correct: 2,
                        explanation: "<footer> is a semantic HTML5 element that represents footer content for its nearest sectioning element."
                    }
                ],
                hard: [
                    {
                        question: "How will these script loading attributes affect page rendering?\n\n```html\n<head>\n  <script src='blocking.js'></script>\n  <script src='deferred.js' defer></script>\n  <script src='async.js' async></script>\n</head>\n<body>\n  <h1>Page Content</h1>\n  <script>console.log('Inline executed')</script>\n</body>\n```",
                        answers: [
                            "All scripts execute before page content appears",
                            "blocking.js blocks rendering, async.js executes when loaded, deferred.js waits for HTML parsing", 
                            "All scripts execute after page content loads",
                            "Scripts execute in random order"
                        ],
                        correct: 1,
                        explanation: "Regular scripts block HTML parsing, async scripts execute immediately when loaded (possibly out of order), defer scripts execute after HTML parsing in document order."
                    },
                    {
                        question: "What accessibility and semantic structure does this complex HTML create?\n\n```html\n<main role='main'>\n  <article aria-labelledby='post-title'>\n    <header>\n      <h1 id='post-title'>Advanced HTML</h1>\n    </header>\n    <section aria-label='Content'>\n      <p>Post content with <abbr title='HyperText Markup Language'>HTML</abbr></p>\n    </section>\n  </article>\n</main>\n```",
                        answers: [
                            "Basic article structure with no accessibility features",
                            "Semantic structure with ARIA labels, expandable abbreviation, and proper heading hierarchy", 
                            "Only visual formatting with no screen reader support",
                            "Complex structure that confuses assistive technologies"
                        ],
                        correct: 1,
                        explanation: "The structure uses semantic HTML5 elements, ARIA attributes for accessibility, proper heading hierarchy, and expandable abbreviations for screen readers."
                    },
                    {
                        question: "Which HTML5 API allows you to store data locally in the user's browser?",
                        answers: ["SessionStorage only", "LocalStorage only", "Both SessionStorage and LocalStorage", "CookieStorage"],
                        correct: 2,
                        explanation: "Both SessionStorage (temporary) and LocalStorage (persistent) are Web Storage APIs that allow client-side data storage."
                    },
                    {
                        question: "What does the 'contenteditable' attribute do when set to 'true'?",
                        answers: ["Makes text bold", "Allows users to edit the element's content directly", "Makes element clickable", "Enables spell check"],
                        correct: 1,
                        explanation: "The 'contenteditable' attribute makes any HTML element editable by the user, turning it into a rich text editor."
                    },
                    {
                        question: "What is the purpose of the 'role' attribute in HTML?",
                        answers: ["Defines CSS roles", "Provides semantic meaning for assistive technologies", "Sets user permissions", "Defines JavaScript roles"],
                        correct: 1,
                        explanation: "The 'role' attribute provides semantic information about an element's purpose for assistive technologies like screen readers."
                    },
                    {
                        question: "Which HTML5 element should contain the main content of a document?",
                        answers: ["<content>", "<main>", "<primary>", "<body>"],
                        correct: 1,
                        explanation: "<main> represents the dominant content of the document body, excluding headers, footers, and navigation."
                    },
                    {
                        question: "What is the difference between 'async' and 'defer' script attributes?",
                        answers: ["No difference", "'async' executes immediately when loaded, 'defer' waits for HTML parsing", "'defer' executes immediately, 'async' waits", "Both block HTML parsing"],
                        correct: 1,
                        explanation: "'async' executes scripts immediately when downloaded (potentially out of order), while 'defer' maintains order and waits for HTML parsing."
                    },
                    {
                        question: "Which attribute is used for progressive enhancement of form validation?",
                        answers: ["validation", "pattern", "check", "verify"],
                        correct: 1,
                        explanation: "The 'pattern' attribute allows you to specify a regular expression for form field validation, providing client-side validation."
                    },
                    {
                        question: "What is the purpose of the 'srcset' attribute in img tags?",
                        answers: ["Sets image source", "Provides multiple image sources for different screen sizes", "Creates image sets", "Sets source code"],
                        correct: 1,
                        explanation: "'srcset' allows you to specify multiple image sources for different screen densities and sizes, enabling responsive images."
                    },
                    {
                        question: "Which HTML5 input type provides date selection with built-in calendar?",
                        answers: ["<input type='calendar'>", "<input type='date'>", "<input type='datetime'>", "<input type='time'>"],
                        correct: 1,
                        explanation: "<input type='date'> provides a native date picker interface in supporting browsers, improving user experience."
                    }
                ]
            },
            css: {
                easy: [
                    {
                        question: "How will this CSS style the text?\n\n```css\n.title {\n  color: red;\n  font-size: 24px;\n  text-align: center;\n}\n```\n\n```html\n<h1 class='title'>Welcome</h1>\n```",
                        answers: [
                            "Welcome (red, 24px, centered)",
                            "Welcome (black, 24px, left-aligned)", 
                            "WELCOME (red, 24px, centered)",
                            "Welcome (red, normal size, centered)"
                        ],
                        correct: 0,
                        explanation: "The CSS applies red color, 24px font size, and center alignment to the h1 element with class 'title'."
                    },
                    {
                        question: "What layout will this CSS create?\n\n```css\n.container {\n  display: flex;\n  justify-content: space-between;\n}\n```\n\n```html\n<div class='container'>\n  <div>A</div>\n  <div>B</div>\n  <div>C</div>\n</div>\n```",
                        answers: [
                            "```\nA              B              C\n(evenly spaced across container)\n```",
                            "```\nA B C\n(close together)\n```",
                            "```\nA\nB\nC\n(stacked vertically)\n```", 
                            "```\nC B A\n(reversed order)\n```"
                        ],
                        correct: 0,
                        explanation: "Flexbox with justify-content: space-between distributes items with equal space between them, but not around them."
                    },
                    {
                        question: "What will this CSS positioning create?\n\n```css\n.box {\n  position: absolute;\n  top: 50px;\n  right: 20px;\n  width: 100px;\n  height: 100px;\n  background: blue;\n}\n```",
                        answers: [
                            "Blue 100x100px box, 50px from top, 20px from right edge",
                            "Blue 100x100px box, 50px from left, 20px from bottom",
                            "Blue box centered on page",
                            "Blue box in normal document flow"
                        ],
                        correct: 0,
                        explanation: "Absolute positioning removes the element from normal flow and positions it 50px from the top and 20px from the right edge of its positioned ancestor."
                    },
                    {
                        question: "How will this CSS Grid layout render?\n\n```css\n.grid {\n  display: grid;\n  grid-template-columns: 1fr 2fr 1fr;\n  gap: 10px;\n}\n```\n\n```html\n<div class='grid'>\n  <div>A</div>\n  <div>B</div>\n  <div>C</div>\n</div>\n```",
                        answers: [
                            "```\n[A] [    B    ] [C]\n(B twice as wide, 10px gaps)\n```",
                            "```\n[A] [B] [C]\n(equal widths)\n```",
                            "```\n[A]\n[B]\n[C]\n(vertical stack)\n```",
                            "```\n[C] [B] [A]\n(reversed)\n```"
                        ],
                        correct: 0,
                        explanation: "CSS Grid with 1fr 2fr 1fr creates three columns where the middle column (B) is twice as wide as the outer columns, with 10px gaps."
                    },
                    {
                        question: "What visual effect will this CSS create?\n\n```css\n.card {\n  background: white;\n  border-radius: 10px;\n  box-shadow: 0 4px 8px rgba(0,0,0,0.1);\n  padding: 20px;\n}\n```",
                        answers: [
                            "White rounded card with subtle shadow and padding",
                            "White square card with no shadow", 
                            "White card with black border",
                            "Transparent card with shadow"
                        ],
                        correct: 0,
                        explanation: "The CSS creates a white background with rounded corners (border-radius), a subtle drop shadow (box-shadow), and 20px internal spacing (padding)."
                    },
                    {
                        question: "What will this CSS hover effect create?\n\n```css\n.button {\n  background: #3498db;\n  transition: all 0.3s ease;\n}\n\n.button:hover {\n  background: #e74c3c;\n  transform: scale(1.1);\n}\n```",
                        answers: [
                            "```\n[BLUE BUTTON] → (hover) → [RED BUTTON 110% size] (smooth)\n```",
                            "```\n[RED BUTTON] → (hover) → [BLUE BUTTON smaller]\n```",
                            "```\n[BLUE BUTTON] → (hover) → [RED BUTTON] (instant)\n```",
                            "```\n[BLUE BUTTON] → (hover) → [RED BUTTON same size]\n```"
                        ],
                        correct: 0,
                        explanation: "The CSS creates a smooth transition effect where the button changes from blue to red background and scales up 10% when hovered."
                    },
                    {
                        question: "How will this CSS animation behave?\n\n```css\n@keyframes spin {\n  0% { transform: rotate(0deg); }\n  100% { transform: rotate(360deg); }\n}\n\n.loader {\n  animation: spin 2s linear infinite;\n}\n```",
                        answers: [
                            "Element spins 360 degrees once over 2 seconds then stops",
                            "Element spins continuously, completing one full rotation every 2 seconds", 
                            "Element spins back and forth 180 degrees",
                            "Element spins once in 2 seconds with easing effect"
                        ],
                        correct: 1,
                        explanation: "The animation spins the element continuously (infinite) with linear timing, completing one full 360° rotation every 2 seconds."
                    },
                    {
                        question: "What layout will this CSS media query create?\n\n```css\n.container {\n  display: flex;\n  flex-direction: row;\n}\n\n@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n}\n```",
                        answers: [
                            "Always horizontal layout regardless of screen size",
                            "Always vertical layout regardless of screen size",
                            "Horizontal layout on large screens, vertical on screens 768px and smaller",
                            "Vertical layout on large screens, horizontal on small screens"
                        ],
                        correct: 2,
                        explanation: "The media query changes flex-direction from row (horizontal) to column (vertical) when the screen width is 768px or less."
                    },
                    {
                        question: "What visual effect will this CSS gradient create?\n\n```css\n.banner {\n  background: linear-gradient(45deg, \n    #ff6b6b 0%, \n    #4ecdc4 50%, \n    #45b7d1 100%\n  );\n}\n```",
                        answers: [
                            "Solid red background",
                            "Diagonal gradient from red to teal to blue at 45-degree angle", 
                            "Vertical gradient from top to bottom",
                            "Horizontal gradient from left to right"
                        ],
                        correct: 1,
                        explanation: "The linear-gradient creates a diagonal (45deg) color transition from red (#ff6b6b) to teal (#4ecdc4) to blue (#45b7d1)."
                    },
                    {
                        question: "How will this CSS transform affect the element?\n\n```css\n.card {\n  transform: translateX(50px) \n             rotateY(45deg) \n             scale(1.2);\n  transform-origin: center center;\n}\n```",
                        answers: [
                            "Move right 50px, rotate around Y-axis 45°, and scale up 20%",
                            "Move left 50px, rotate around X-axis 45°, and scale down", 
                            "Only move right 50px with no rotation or scaling",
                            "Only rotate 45° with no movement or scaling"
                        ],
                        correct: 0,
                        explanation: "The transform applies three effects: translateX moves it 50px right, rotateY creates 3D Y-axis rotation, and scale enlarges it by 20%."
                    }
                ],
                medium: [
                    {
                        question: "What sizing will this CSS rem/em comparison create?\n\n```css\nhtml { font-size: 16px; }\n.parent { font-size: 20px; }\n.child-em { font-size: 1.5em; }\n.child-rem { font-size: 1.5rem; }\n```\n\n```html\n<div class='parent'>\n  <span class='child-em'>EM Text</span>\n  <span class='child-rem'>REM Text</span>\n</div>\n```",
                        answers: [
                            "Both texts are 24px (same size)",
                            "EM Text: 30px (1.5 × 20px), REM Text: 24px (1.5 × 16px)", 
                            "EM Text: 24px, REM Text: 30px",
                            "Both texts are 16px"
                        ],
                        correct: 1,
                        explanation: "'em' calculates from parent font-size (20px), 'rem' calculates from root font-size (16px), so 1.5em = 30px and 1.5rem = 24px."
                    },
                    {
                        question: "What layout will this CSS flexbox code create?\n\n```css\n.container {\n  display: flex;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-around;\n}\n\n.item {\n  flex: 1 1 200px;\n}\n```",
                        answers: [
                            "Items in single row, no wrapping, centered vertically",
                            "Items wrap to new lines when less than 200px, distributed with space around, vertically centered", 
                            "Items stack vertically only",
                            "Items have fixed 200px width with no flexibility"
                        ],
                        correct: 1,
                        explanation: "Flex items wrap when they can't maintain 200px minimum width, are distributed with equal space around them, and are vertically centered."
                    },
                    {
                        question: "How will this box-sizing comparison affect element dimensions?\n\n```css\n.content-box {\n  box-sizing: content-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n}\n\n.border-box {\n  box-sizing: border-box;\n  width: 200px;\n  padding: 20px;\n  border: 5px solid black;\n}\n```",
                        answers: [
                            "Both elements are exactly 200px wide",
                            "Content-box: 250px total width, Border-box: 200px total width", 
                            "Content-box: 200px, Border-box: 250px",
                            "Both elements are 250px wide"
                        ],
                        correct: 1,
                        explanation: "Content-box adds padding/border to width (200+40+10=250px), border-box includes padding/border within the width (stays 200px total)."
                    },
                    {
                        question: "Which CSS property is used to create rounded corners?",
                        answers: ["border-radius", "corner-radius", "border-round", "corner-round"],
                        correct: 0,
                        explanation: "The 'border-radius' property rounds the corners of an element's outer border edge."
                    },
                    {
                        question: "What is the difference between margin and padding?",
                        answers: ["No difference", "Margin is inside, padding is outside", "Padding is inside, margin is outside", "Both are the same"],
                        correct: 2,
                        explanation: "Padding creates space inside an element (between content and border), while margin creates space outside an element."
                    },
                    {
                        question: "Which CSS selector has higher specificity: class or ID?",
                        answers: ["Class", "ID", "Both are equal", "Depends on position"],
                        correct: 1,
                        explanation: "ID selectors have higher specificity than class selectors, making them more powerful in the cascade."
                    },
                    {
                        question: "What does 'position: relative' do?",
                        answers: ["Removes element from flow", "Positions relative to viewport", "Positions relative to its normal position", "Positions relative to parent"],
                        correct: 2,
                        explanation: "'position: relative' positions an element relative to its normal position, without removing it from document flow."
                    },
                    {
                        question: "Which property controls the stacking order of elements?",
                        answers: ["stack-order", "z-index", "layer", "depth"],
                        correct: 1,
                        explanation: "The 'z-index' property controls the vertical stacking order of positioned elements."
                    },
                    {
                        question: "What does 'display: none' do?",
                        answers: ["Makes element transparent", "Hides element but preserves space", "Removes element from layout completely", "Makes element very small"],
                        correct: 2,
                        explanation: "'display: none' completely removes the element from the document flow, taking up no space."
                    },
                    {
                        question: "Which CSS property is used to create space between the element's border and inner content?",
                        answers: ["margin", "padding", "border-spacing", "spacing"],
                        correct: 1,
                        explanation: "'padding' creates space between an element's border and its inner content."
                    }
                ],
                hard: [
                    {
                        question: "What complex layout will this CSS Grid with named lines create?\n\n```css\n.grid {\n  display: grid;\n  grid-template-columns: [sidebar-start] 200px [content-start] 1fr 2fr [content-end] 100px [sidebar-end];\n  grid-template-rows: [header] 80px [main] 1fr [footer] 60px;\n  gap: 20px;\n}\n\n.header { grid-column: sidebar-start / sidebar-end; grid-row: header; }\n.sidebar { grid-column: sidebar-start; grid-row: main; }\n.content { grid-column: content-start / content-end; grid-row: main; }\n```",
                        answers: [
                            "Simple 2x2 grid layout",
                            "Complex layout: full-width header, 200px sidebar, flexible main content (1fr+2fr), 100px right column", 
                            "Single column layout with no grid areas",
                            "Flexbox-style layout with equal columns"
                        ],
                        correct: 1,
                        explanation: "Named grid lines create a sophisticated layout with precise control: header spans full width, sidebar is 200px, content area uses fractional units (1fr+2fr), plus 100px right area."
                    },
                    {
                        question: "What visual and interactive effects will this advanced CSS create?\n\n```css\n.card {\n  transform-style: preserve-3d;\n  perspective: 1000px;\n  transition: transform 0.6s;\n}\n\n.card:hover {\n  transform: rotateY(180deg);\n}\n\n.card-front, .card-back {\n  backface-visibility: hidden;\n  position: absolute;\n}\n\n.card-back {\n  transform: rotateY(180deg);\n}\n```",
                        answers: [
                            "Card that simply changes color on hover",
                            "3D flip card effect: shows front by default, flips to reveal back on hover with perspective", 
                            "Card that slides left and right",
                            "Card with basic 2D rotation"
                        ],
                        correct: 1,
                        explanation: "Creates a 3D flip card: preserve-3d enables 3D transforms, perspective adds depth, backface-visibility hides the back until flipped, hover rotates 180° on Y-axis."
                    },
                    {
                        question: "How will this modern CSS function combination work?\n\n```css\n.responsive {\n  width: clamp(300px, 50vw, 800px);\n  font-size: clamp(1rem, 2.5vw, 2rem);\n  padding: max(20px, 3vw);\n  margin: min(5vh, 50px) auto;\n  background: hsl(200 50% 50% / 0.8);\n}\n```",
                        answers: [
                            "Fixed dimensions with no responsiveness",
                            "Fully responsive: width 300px-800px based on viewport, scalable font, adaptive padding/margin, semi-transparent blue background", 
                            "Only works on large screens",
                            "Basic responsive design with media queries"
                        ],
                        correct: 1,
                        explanation: "Modern CSS functions create fluid responsiveness: clamp() provides min/preferred/max values, max/min() choose larger/smaller values, HSL with alpha creates color/transparency."
                    },
                    {
                        question: "Which CSS pseudo-element creates content before an element?",
                        answers: ["::before", ":before-content", "::pre", ":first"],
                        correct: 0,
                        explanation: "The '::before' pseudo-element creates a virtual element that is the first child of the selected element, often used for decorative content."
                    },
                    {
                        question: "What is the difference between 'visibility: hidden' and 'display: none'?",
                        answers: ["No difference", "'visibility: hidden' preserves space, 'display: none' removes element from flow", "'display: none' preserves space, 'visibility: hidden' removes element from flow", "Both remove space"],
                        correct: 1,
                        explanation: "'visibility: hidden' hides the element but maintains its space in layout, while 'display: none' completely removes it from the document flow."
                    },
                    {
                        question: "Which CSS property enables hardware acceleration for animations?",
                        answers: ["animation-fill-mode", "will-change", "transform-style", "perspective"],
                        correct: 1,
                        explanation: "The 'will-change' property hints to the browser about upcoming changes, allowing it to optimize performance through hardware acceleration."
                    },
                    {
                        question: "What is the CSS 'contain' property used for?",
                        answers: ["Contains overflowing content", "Optimizes rendering by limiting scope of styles and layout", "Contains animations", "Contains variables"],
                        correct: 1,
                        explanation: "The 'contain' property allows you to indicate that an element's subtree is independent, enabling browser optimizations for rendering performance."
                    },
                    {
                        question: "Which CSS feature allows you to create custom properties?",
                        answers: ["CSS Variables (--custom-property)", "CSS Functions", "CSS Mixins", "CSS Modules"],
                        correct: 0,
                        explanation: "CSS Custom Properties (CSS Variables) use the '--' prefix and allow you to store values that can be reused throughout your stylesheet."
                    },
                    {
                        question: "What does 'transform: translate3d(0,0,0)' do?",
                        answers: ["Moves element in 3D space", "Triggers hardware acceleration for smoother animations", "Creates a 3D effect", "Rotates element in 3D"],
                        correct: 1,
                        explanation: "'translate3d(0,0,0)' is often used as a hack to trigger hardware acceleration, moving rendering to the GPU for better performance."
                    },
                    {
                        question: "Which CSS selector targets elements based on their position among siblings?",
                        answers: [":nth-child()", ":first-of-type", ":nth-of-type()", "All of the above"],
                        correct: 3,
                        explanation: "All these pseudo-selectors target elements based on position: :nth-child() by overall position, :nth-of-type() by position among same-type siblings."
                    }
                ]
            },
            javascript: {
                easy: [
                    {
                        question: "What will this JavaScript code output?\n\n```javascript\nlet x = 5;\nlet y = 10;\nconsole.log(x + y);\nconsole.log('x + y');\n```",
                        answers: [
                            "```\n15\nx + y\n```",
                            "```\n5 + 10\nx + y\n```",
                            "```\n15\n15\n```", 
                            "```\nx + y\nx + y\n```"
                        ],
                        correct: 0,
                        explanation: "The first console.log performs mathematical addition (5 + 10 = 15), while the second prints the literal string 'x + y'."
                    },
                    {
                        question: "What does this function return?\n\n```javascript\nfunction greet(name) {\n  return 'Hello ' + name + '!';\n}\n\nconsole.log(greet('Alice'));\n```",
                        answers: [
                            "```\nHello Alice!\n```",
                            "```\ngreet Alice\n```",
                            "```\nHello + Alice + !\n```", 
                            "```\nundefined\n```"
                        ],
                        correct: 0,
                        explanation: "The function concatenates strings: 'Hello ' + 'Alice' + '!' = 'Hello Alice!' and returns this value."
                    },
                    {
                        question: "What will this array code output?\n\n```javascript\nlet fruits = ['apple', 'banana', 'cherry'];\nconsole.log(fruits[1]);\nconsole.log(fruits.length);\n```",
                        answers: [
                            "```\nbanana\n3\n```",
                            "```\napple\n3\n```",
                            "```\nbanana\n2\n```",
                            "```\ncherry\n3\n```"
                        ],
                        correct: 0,
                        explanation: "Arrays are zero-indexed: fruits[1] is 'banana' (second element), and the array has 3 elements total."
                    },
                    {
                        question: "What does this conditional code output?\n\n```javascript\nlet score = 85;\nif (score >= 90) {\n  console.log('A');\n} else if (score >= 80) {\n  console.log('B');\n} else {\n  console.log('C');\n}\n```",
                        answers: [
                            "```\nA\n```",
                            "```\nB\n```", 
                            "```\nC\n```",
                            "```\n85\n```"
                        ],
                        correct: 1,
                        explanation: "Score is 85, which is not >= 90, but is >= 80, so the else if condition executes and prints 'B'."
                    },
                    {
                        question: "What will this object destructuring code output?\n\n```javascript\nconst person = { name: 'Alice', age: 25, city: 'NYC' };\nconst { name, city } = person;\nconsole.log(name);\nconsole.log(city);\n```",
                        answers: [
                            "```\nAlice\nNYC\n```",
                            "```\nname\ncity\n```", 
                            "```\nundefined\nundefined\n```",
                            "```\n{ name: 'Alice', city: 'NYC' }\n```"
                        ],
                        correct: 0,
                        explanation: "Destructuring assignment extracts the values of 'name' and 'city' properties from the person object into separate variables."
                    },
                    {
                        question: "What does this DOM manipulation code produce?\n\n```javascript\nconst div = document.createElement('div');\ndiv.innerHTML = '<p>Hello <strong>World</strong></p>';\ndiv.classList.add('container');\nconsole.log(div.outerHTML);\n```",
                        answers: [
                            "```html\n<div class='container'><p>Hello <strong>World</strong></p></div>\n```",
                            "```html\n<p>Hello <strong>World</strong></p>\n```", 
                            "```html\n<div><p>Hello World</p></div>\n```",
                            "```\nHello World\n```"
                        ],
                        correct: 0,
                        explanation: "The code creates a div element, adds HTML content inside, applies a CSS class, and outerHTML returns the complete element string."
                    },
                    {
                        question: "What will this event handling code do?\n\n```javascript\ndocument.addEventListener('click', function(e) {\n  if (e.target.classList.contains('button')) {\n    e.target.style.backgroundColor = 'red';\n  }\n});\n```",
                        answers: [
                            "Changes all elements to red background when clicked",
                            "Only elements with 'button' class turn red when clicked", 
                            "Creates a red button on the page",
                            "Removes the button class from clicked elements"
                        ],
                        correct: 1,
                        explanation: "Event delegation - the click handler checks if the clicked element has 'button' class, and if so, changes its background to red."
                    },
                    {
                        question: "What will this Promise chain output?\n\n```javascript\nPromise.resolve(10)\n  .then(x => x * 2)\n  .then(x => x + 5)\n  .then(x => console.log(x))\n  .catch(err => console.log('Error:', err));\n```",
                        answers: [
                            "```\n25\n```",
                            "```\nError: something went wrong\n```", 
                            "```\n10\n```",
                            "```\n20\n```"
                        ],
                        correct: 0,
                        explanation: "The Promise chain: 10 → (10*2=20) → (20+5=25), so console.log outputs 25. No errors occur, so catch is not executed."
                    },
                    {
                        question: "What does this template literal with expressions output?\n\n```javascript\nconst name = 'Sarah';\nconst age = 30;\nconst message = `Hello ${name.toUpperCase()}, \n  you will be ${age + 1} next year!`;\nconsole.log(message);\n```",
                        answers: [
                            "```\nHello SARAH,\n  you will be 31 next year!\n```",
                            "```\nHello Sarah, you will be 30 next year!\n```", 
                            "```\nHello ${name.toUpperCase()}, you will be ${age + 1} next year!\n```",
                            "```\nHello sarah, you will be 31 next year!\n```"
                        ],
                        correct: 0,
                        explanation: "Template literals (backticks) evaluate expressions: name.toUpperCase() becomes 'SARAH', age + 1 becomes 31, and \\n creates a line break."
                    },
                    {
                        question: "What will this array method chaining output?\n\n```javascript\nconst numbers = [1, 2, 3, 4, 5];\nconst result = numbers\n  .filter(n => n > 2)\n  .map(n => n * 2)\n  .reduce((sum, n) => sum + n, 0);\nconsole.log(result);\n```",
                        answers: [
                            "24",
                            "30", 
                            "[6, 8, 10]",
                            "15"
                        ],
                        correct: 0,
                        explanation: "Filter gets [3,4,5], map doubles to [6,8,10], reduce sums them: 6+8+10=24."
                    }
                ],
                medium: [
                    {
                        question: "What will this comparison code output?\n\n```javascript\nconsole.log(5 == '5');\nconsole.log(5 === '5');\nconsole.log(0 == false);\nconsole.log(0 === false);\n```",
                        answers: [
                            "true\ntrue\ntrue\ntrue",
                            "true\nfalse\ntrue\nfalse", 
                            "false\nfalse\nfalse\nfalse",
                            "true\nfalse\nfalse\ntrue"
                        ],
                        correct: 1,
                        explanation: "'==' performs type coercion (5=='5' and 0==false are true), while '===' requires same type and value (5==='5' and 0===false are false)."
                    },
                    {
                        question: "What does this hoisting example output?\n\n```javascript\nconsole.log(x);\nconsole.log(y);\nvar x = 5;\nlet y = 10;\n```",
                        answers: [
                            "5\n10",
                            "undefined\nReferenceError: Cannot access 'y' before initialization", 
                            "ReferenceError for both",
                            "undefined\nundefined"
                        ],
                        correct: 1,
                        explanation: "'var x' is hoisted and initialized as undefined, but 'let y' is hoisted but not initialized, causing a ReferenceError in the temporal dead zone."
                    },
                    {
                        question: "What will this scope demonstration output?\n\n```javascript\nvar a = 1;\nlet b = 2;\nconst c = 3;\n\nif (true) {\n  var a = 4;\n  let b = 5;\n  const c = 6;\n}\n\nconsole.log(a, b, c);\n```",
                        answers: [
                            "1 2 3",
                            "4 2 3", 
                            "4 5 6",
                            "1 5 6"
                        ],
                        correct: 1,
                        explanation: "'var' has function scope so inner 'a' overwrites outer 'a', but 'let' and 'const' are block-scoped so inner variables don't affect outer ones."
                    },
                    {
                        question: "What is the purpose of the 'this' keyword in JavaScript?",
                        answers: ["References the current function", "References the global object", "References the object that owns the method", "References the previous object"],
                        correct: 2,
                        explanation: "'this' refers to the object that is executing the current function, providing context for method calls."
                    },
                    {
                        question: "Which array method creates a new array with all elements that pass a test?",
                        answers: ["map()", "filter()", "reduce()", "forEach()"],
                        correct: 1,
                        explanation: "The filter() method creates a new array with all elements that pass the test implemented by the provided function."
                    },
                    {
                        question: "What does the 'typeof' operator return for an array?",
                        answers: ["'array'", "'object'", "'list'", "'undefined'"],
                        correct: 1,
                        explanation: "Arrays are objects in JavaScript, so typeof returns 'object'. Use Array.isArray() to check if something is an array."
                    },
                    {
                        question: "What is the difference between 'null' and 'undefined'?",
                        answers: ["No difference", "'null' is assigned, 'undefined' means not declared", "'undefined' is assigned, 'null' means not declared", "Both mean the same thing"],
                        correct: 1,
                        explanation: "'null' is an assigned value representing no value, while 'undefined' means a variable has been declared but not assigned."
                    },
                    {
                        question: "Which method is used to remove the last element from an array?",
                        answers: ["pop()", "shift()", "splice()", "delete()"],
                        correct: 0,
                        explanation: "The pop() method removes and returns the last element of an array."
                    },
                    {
                        question: "What is a callback function?",
                        answers: ["A function that calls back", "A function passed as argument to another function", "A function that returns a function", "A recursive function"],
                        correct: 1,
                        explanation: "A callback function is passed as an argument to another function and is executed after some operation has completed."
                    },
                    {
                        question: "What does the 'return' statement do in a function?",
                        answers: ["Restarts the function", "Exits the function and returns a value", "Continues to next line", "Creates a loop"],
                        correct: 1,
                        explanation: "The 'return' statement stops function execution and returns a value to the caller."
                    }
                ],
                hard: [
                    {
                        question: "What will this complex async/await error handling output?\n\n```javascript\nasync function complexAsync() {\n  try {\n    const result = await Promise.reject('Error 1');\n    return result;\n  } catch (error) {\n    console.log('Caught:', error);\n    throw new Error('Error 2');\n  }\n}\n\ncomplexAsync()\n  .then(data => console.log('Success:', data))\n  .catch(err => console.log('Final:', err.message));\n```",
                        answers: [
                            "Success: undefined",
                            "Caught: Error 1\nFinal: Error 2", 
                            "Final: Error 1",
                            "No output - code fails silently"
                        ],
                        correct: 1,
                        explanation: "Promise.reject triggers catch block (logs 'Caught: Error 1'), then throw creates new error that's caught by .catch() (logs 'Final: Error 2')."
                    },
                    {
                        question: "What does this closure with lexical scoping output?\n\n```javascript\nfunction createCounter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getValue: () => count\n  };\n}\n\nconst counter1 = createCounter();\nconst counter2 = createCounter();\ncounter1.increment();\ncounter1.increment();\ncounter2.increment();\nconsole.log(counter1.getValue(), counter2.getValue());\n```",
                        answers: [
                            "2 2",
                            "2 1", 
                            "3 1",
                            "1 1"
                        ],
                        correct: 1,
                        explanation: "Each createCounter() call creates a separate closure with its own 'count' variable. counter1 increments twice (2), counter2 increments once (1)."
                    },
                    {
                        question: "What will this bind/call/apply comparison output?\n\n```javascript\nconst obj = { name: 'Alice', value: 42 };\n\nfunction test(a, b) {\n  return `${this.name}: ${this.value + a + b}`;\n}\n\nconst boundTest = test.bind(obj, 10);\nconsole.log(test.call(obj, 5, 3));\nconsole.log(test.apply(obj, [7, 2]));\nconsole.log(boundTest(20));\n```",
                        answers: [
                            "Alice: 50\nAlice: 51\nAlice: 72",
                            "Alice: 50\nAlice: 51\nAlice: 62", 
                            "Alice: 47\nAlice: 49\nAlice: 62",
                            "undefined: NaN (all three)"
                        ],
                        correct: 0,
                        explanation: "call(obj, 5, 3): 42+5+3=50; apply(obj, [7, 2]): 42+7+2=51; boundTest(20) with pre-bound 10: 42+10+20=72."
                    },
                    {
                        question: "What is event bubbling in JavaScript?",
                        answers: ["Creating animated bubbles", "Events propagating from target element up through ancestors", "Events propagating from document down to target", "Memory leaks in events"],
                        correct: 1,
                        explanation: "Event bubbling is when events propagate from the target element up through its ancestors in the DOM tree."
                    },
                    {
                        question: "What is the difference between 'call()', 'apply()', and 'bind()' methods?",
                        answers: ["No difference", "'call()' and 'apply()' invoke immediately, 'bind()' returns new function", "'bind()' and 'apply()' invoke immediately, 'call()' returns new function", "All return new functions"],
                        correct: 1,
                        explanation: "'call()' and 'apply()' invoke the function immediately with a specified 'this' value, while 'bind()' returns a new function."
                    },
                    {
                        question: "What is a JavaScript Promise and what are its three states?",
                        answers: ["A guarantee; pending, fulfilled, rejected", "A variable type; true, false, null", "A loop structure; start, middle, end", "An object method; get, set, delete"],
                        correct: 0,
                        explanation: "A Promise represents eventual completion of an asynchronous operation. Its states are: pending, fulfilled (resolved), and rejected."
                    },
                    {
                        question: "What is the JavaScript Event Loop?",
                        answers: ["A for loop that handles events", "A mechanism that handles callback queue and call stack for non-blocking operations", "A method to prevent infinite loops", "A way to create event listeners"],
                        correct: 1,
                        explanation: "The Event Loop enables non-blocking asynchronous operations by managing the call stack and callback queue."
                    },
                    {
                        question: "What is destructuring assignment in JavaScript?",
                        answers: ["Destroying variables", "A syntax to extract values from arrays or objects into variables", "A way to delete properties", "A method to break loops"],
                        correct: 1,
                        explanation: "Destructuring assignment allows you to extract values from arrays or properties from objects into distinct variables using a concise syntax."
                    },
                    {
                        question: "What is the difference between 'map()' and 'forEach()' array methods?",
                        answers: ["No difference", "'map()' returns new array, 'forEach()' returns undefined", "'forEach()' returns new array, 'map()' returns undefined", "Both return new arrays"],
                        correct: 1,
                        explanation: "'map()' creates and returns a new array with transformed elements, while 'forEach()' executes a function for each element and returns undefined."
                    },
                    {
                        question: "What are JavaScript Prototypes?",
                        answers: ["First versions of functions", "Objects from which other objects inherit properties and methods", "Function templates", "Variable declarations"],
                        correct: 1,
                        explanation: "Prototypes are the mechanism by which JavaScript objects inherit features from one another, forming the prototype chain."
                    }
                ]
            }
        };
    }

    init() {
        this.bindEvents();
        this.initAudioUI();
        this.showScreen('start-screen');
    }

    initAudioUI() {
        const toggleBtn = document.getElementById('audio-toggle');
        if (!this.audioEnabled) {
            toggleBtn.classList.add('muted');
        }
    }

    bindEvents() {
        // Game mode selection
        const individualBtn = document.getElementById('individual-mode-btn');
        const teamBtn = document.getElementById('team-mode-btn');
        
        if (individualBtn && teamBtn) {
            individualBtn.addEventListener('click', () => this.selectGameMode('individual'));
            teamBtn.addEventListener('click', () => this.selectGameMode('team'));
        } else {
            console.error('Game mode buttons not found:', { individualBtn, teamBtn });
        }

        // Team setup (defensive binding)
        const addTeamBtn = document.getElementById('add-team-btn');
        const teamNameInput = document.getElementById('team-name-input');
        const startTournamentBtn = document.getElementById('start-tournament-btn');
        const backToMenuBtn = document.getElementById('back-to-menu-btn');
        
        if (addTeamBtn) addTeamBtn.addEventListener('click', () => this.addTeam());
        if (teamNameInput) {
            teamNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addTeam();
            });
        }
        document.querySelectorAll('.quick-team-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.addQuickTeam(e.target.textContent));
        });
        if (startTournamentBtn) startTournamentBtn.addEventListener('click', () => this.startTournament());
        if (backToMenuBtn) backToMenuBtn.addEventListener('click', () => this.showScreen('start-screen'));

        // Topic selection
        document.querySelectorAll('.topic-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectTopic(e.target.dataset.topic));
        });

        // Difficulty selection
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectDifficulty(e.target.dataset.difficulty));
        });

        // Answer selection
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Make sure we're always getting the button element, not a child element
                const button = e.target.closest('.answer-btn');
                console.log('Button clicked:', { target: e.target, button: button, dataset: button?.dataset });
                this.selectAnswer(button);
            });
        });

        // Lifelines
        document.getElementById('fifty-fifty').addEventListener('click', () => this.useFiftyFifty());
        document.getElementById('ask-audience').addEventListener('click', () => this.askAudience());
        document.getElementById('phone-friend').addEventListener('click', () => this.phoneAFriend());

        // Walk away
        document.getElementById('walk-away').addEventListener('click', () => this.walkAway());

        // Play again (individual mode)
        document.getElementById('play-again').addEventListener('click', () => this.resetGame());
        
        // Team end game options
        const resetReplayBtn = document.getElementById('reset-and-replay');
        const newQuizKeepScoresBtn = document.getElementById('new-quiz-keep-scores');
        const backToModeBtn = document.getElementById('back-to-mode-selection');
        
        if (resetReplayBtn) resetReplayBtn.addEventListener('click', () => this.resetAndReplay());
        if (newQuizKeepScoresBtn) newQuizKeepScoresBtn.addEventListener('click', () => this.newQuizKeepScores());
        if (backToModeBtn) backToModeBtn.addEventListener('click', () => this.backToModeSelection());

        // Team controls (defensive binding)
        const nextTeamBtn = document.getElementById('next-team-btn');
        const showLeaderboardBtn = document.getElementById('show-leaderboard-btn');
        const continueTournamentBtn = document.getElementById('continue-tournament-btn');
        const endTournamentBtn = document.getElementById('end-tournament-btn');
        
        if (nextTeamBtn) nextTeamBtn.addEventListener('click', () => this.nextTeam());
        if (showLeaderboardBtn) showLeaderboardBtn.addEventListener('click', () => this.showLeaderboard());
        if (continueTournamentBtn) continueTournamentBtn.addEventListener('click', () => this.continueTournament());
        if (endTournamentBtn) endTournamentBtn.addEventListener('click', () => this.endTournament());

        // Team decision buttons
        const continueRiskBtn = document.getElementById('continue-risk-btn');
        const passSafeBtn = document.getElementById('pass-safe-btn');
        const nextTeamBtnWrong = document.getElementById('next-team-btn-wrong');
        
        if (continueRiskBtn) continueRiskBtn.addEventListener('click', () => this.teamContinueRisk());
        if (passSafeBtn) passSafeBtn.addEventListener('click', () => this.teamPassSafe());
        if (nextTeamBtnWrong) nextTeamBtnWrong.addEventListener('click', () => this.teamWrongNext());

        // Modal closes
        document.getElementById('close-poll').addEventListener('click', () => this.closeModal('audience-poll'));
        document.getElementById('close-phone').addEventListener('click', () => this.closeModal('phone-friend-modal'));

        // Audio toggle
        document.getElementById('audio-toggle').addEventListener('click', () => this.toggleAudio());

        // Next question button
        document.getElementById('next-question-btn').addEventListener('click', () => this.proceedToNext());

        // Add hover sounds to buttons
        this.addHoverSounds();
    }

    addHoverSounds() {
        const buttons = document.querySelectorAll('button:not(#audio-toggle)');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (this.audioEnabled) {
                    this.playSound('buttonHover');
                }
            });
        });
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const toggleBtn = document.getElementById('audio-toggle');
        
        if (this.audioEnabled) {
            toggleBtn.classList.remove('muted');
        } else {
            toggleBtn.classList.add('muted');
            this.stopBackgroundMusic();
        }
    }

    selectTopic(topic) {
        this.currentTopic = topic;
        document.getElementById('selected-topic').textContent = topic.toUpperCase();
        this.showScreen('difficulty-screen');
    }

    selectDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        this.currentQuestions = [...this.questions[this.currentTopic][difficulty]].sort(() => Math.random() - 0.5);
        this.showScreen('game-screen');
        this.loadQuestion();
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        
        // Play appropriate background music for each screen
        if (screenId === 'start-screen' || screenId === 'difficulty-screen') {
            this.playBackgroundMusic('introMusic');
        } else if (screenId === 'game-screen') {
            this.playBackgroundMusic('questionTension');
        } else if (screenId === 'result-screen') {
            this.stopBackgroundMusic();
        }
    }

    loadQuestion() {
        if (this.currentQuestion >= 10) {
            this.endGame(true);
            return;
        }

        const question = this.currentQuestions[this.currentQuestion];
        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        document.getElementById('current-money').textContent = this.moneyLadder[this.currentQuestion];
        
        // Parse markdown and apply syntax highlighting
        const questionElement = document.getElementById('question-text');
        if (typeof marked !== 'undefined') {
            // Configure marked options
            marked.setOptions({
                highlight: function(code, lang) {
                    if (typeof Prism !== 'undefined' && Prism.languages[lang]) {
                        return Prism.highlight(code, Prism.languages[lang], lang);
                    }
                    return code;
                }
            });
            questionElement.innerHTML = marked.parse(question.question);
        } else {
            // Fallback if marked is not loaded
            questionElement.textContent = question.question;
        }
        
        // Update team UI if in team mode
        if (this.gameMode === 'team') {
            this.updateTeamUI();
        }

        // Load answers with markdown parsing and HTML rendering
        const answerBtns = document.querySelectorAll('.answer-btn');
        answerBtns.forEach((btn, index) => {
            const answerTextElement = btn.querySelector('.answer-text');
            const answerText = question.answers[index];
            
            if (typeof marked !== 'undefined' && answerText.includes('```')) {
                // Code block answers
                answerTextElement.innerHTML = marked.parse(answerText);
            } else if (answerText.includes('<') && answerText.includes('>')) {
                // HTML rendering answers - render as actual HTML
                answerTextElement.innerHTML = answerText;
            } else {
                // Regular text answers
                answerTextElement.textContent = answerText;
            }
            
            btn.classList.remove('selected', 'correct', 'incorrect', 'disabled', 'waiting');
            btn.disabled = false;
            btn.style.pointerEvents = 'auto';
        });

        // Hide explanation from previous question
        document.getElementById('explanation').classList.add('hidden');

        // Update money ladder
        this.updateMoneyLadder();
    }

    updateMoneyLadder() {
        const steps = document.querySelectorAll('.ladder-step');
        steps.forEach((step) => {
            const level = parseInt(step.dataset.level);
            step.classList.remove('current', 'completed');
            if (level < this.currentQuestion + 1) {
                step.classList.add('completed');
            } else if (level === this.currentQuestion + 1) {
                step.classList.add('current');
            }
        });
    }

    selectAnswer(button) {
        if (this.gameOver) return;

        // Immediately disable all buttons to prevent double-clicks
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.pointerEvents = 'none';
            btn.classList.remove('selected', 'waiting');
        });

        // Play answer selection sound
        this.playSound('answerSelect');
        
        // Add selected class immediately for clear feedback
        button.classList.add('selected');

        // Play final answer tension music
        this.playBackgroundMusic('finalAnswerTension');

        // Add waiting state after showing selection for a moment
        setTimeout(() => {
            button.classList.add('waiting');
        }, 500);
        
        // Store the selected answer for processing
        let selectedAnswer = button.dataset.answer;
        console.log('Answer selected:', selectedAnswer, 'Button:', button, 'Dataset:', button.dataset);
        
        // Safety check for selectedAnswer
        if (!selectedAnswer) {
            console.error('selectedAnswer is undefined! Button:', button);
            // Fallback: try to get answer from button structure
            const answerButtons = document.querySelectorAll('.answer-btn');
            const buttonIndex = Array.from(answerButtons).indexOf(button);
            selectedAnswer = String.fromCharCode(65 + buttonIndex); // A, B, C, D
            console.log('Using fallback answer:', selectedAnswer);
        }

        // Show the answer after total delay
        setTimeout(() => {
            button.classList.remove('waiting');
            this.revealAnswer(button, selectedAnswer);
        }, 2500);
    }

    revealAnswer(selectedButton, selectedAnswer) {
        const question = this.currentQuestions[this.currentQuestion];
        const correctButton = document.querySelectorAll('.answer-btn')[question.correct];
        
        // Safety check for selectedAnswer
        if (!selectedAnswer || typeof selectedAnswer !== 'string') {
            console.error('Invalid selectedAnswer in revealAnswer:', selectedAnswer);
            // Emergency fallback - find button index
            const answerButtons = document.querySelectorAll('.answer-btn');
            const buttonIndex = Array.from(answerButtons).indexOf(selectedButton);
            selectedAnswer = String.fromCharCode(65 + buttonIndex); // A, B, C, D
            console.log('Emergency fallback answer:', selectedAnswer);
        }
        
        // Convert letter to index for comparison
        const selectedIndex = selectedAnswer.charCodeAt(0) - 'A'.charCodeAt(0);
        const isCorrect = selectedIndex === question.correct;
        
        console.log('Revealing answer:', {
            selected: selectedAnswer,
            selectedIndex: selectedIndex,
            correctIndex: question.correct,
            isCorrect: isCorrect
        });

        // In team mode, only show correct answer if the team got it right
        // This prevents the next team from seeing the answer
        if (this.gameMode !== 'team' || isCorrect) {
            correctButton.classList.add('correct');
        }

        // Show explanation (but not in team mode when answer is wrong)
        if (this.gameMode !== 'team' || isCorrect) {
            document.getElementById('explanation-text').textContent = question.explanation;
            document.getElementById('explanation').classList.remove('hidden');
        }

        if (this.gameMode === 'team') {
            // Update team stats first
            const currentTeam = this.getCurrentTeam();
            const teamStats = this.teamStats.get(currentTeam);
            teamStats.questionsAnswered++;
            
            if (isCorrect) {
                // Award point for correct answer
                teamStats.correctAnswers++;
                teamStats.score += 1; // 1 point per correct answer
                
                this.playSound('correctAnswer');
                setTimeout(() => this.playSound('moneyWin'), 1000);
                
                // Show risk/reward decision
                this.showTeamDecision();
            } else {
                // Wrong answer - lose all points if team was continuing/risking
                teamStats.score = 0; // Reset score to 0 for wrong answers
                
                this.playSound('wrongAnswer');
                selectedButton.classList.add('incorrect');
                
                // Show team wrong section instead of explanation
                document.getElementById('team-decision').classList.add('hidden');
                document.getElementById('team-wrong').classList.remove('hidden');
                
                // Update wrong message based on points lost
                const lostPoints = teamStats.score === 0 ? 0 : teamStats.score + 1; // +1 because we added the point before resetting
                if (lostPoints > 0) {
                    document.getElementById('team-wrong-message').textContent = 
                        `Lost ${lostPoints} point${lostPoints > 1 ? 's' : ''}! Next team's turn.`;
                } else {
                    document.getElementById('team-wrong-message').textContent = 'Wrong answer! Next team\'s turn.';
                }
            }
            
            // Update UI immediately after stats are updated
            this.updateTeamUI();
        } else {
            // Individual mode logic (original)
            if (isCorrect) {
                this.playSound('correctAnswer');
                this.currentQuestion++;
                
                if (this.currentQuestion < 10) {
                    setTimeout(() => this.playSound('moneyWin'), 1000);
                }
                
                if (this.currentQuestion >= 10) {
                    document.getElementById('next-question-btn').textContent = 'Finish Game';
                    setTimeout(() => this.playSound('jackpotWin'), 1000);
                } else {
                    document.getElementById('next-question-btn').textContent = 'Next Question';
                }
            } else {
                this.playSound('wrongAnswer');
                selectedButton.classList.add('incorrect');
                document.getElementById('next-question-btn').textContent = 'See Results';
            }
        }
    }

    proceedToNext() {
        const buttonText = document.getElementById('next-question-btn').textContent;
        
        if (this.gameMode === 'team') {
            // Team mode logic
            if (buttonText === 'Continue with Same Team') {
                // Correct answer - advance to next question with same team
                this.currentQuestion++;
                this.prepareNextQuestion();
            } else if (buttonText === 'Next Team' || buttonText === 'Next Team - All Points Lost!') {
                // Wrong answer - move to next team, same question
                this.moveToNextTeam();
                this.prepareNextQuestion();
            }
        } else {
            // Individual mode logic (original)
            if (buttonText === 'Finish Game') {
                this.endGame(true);
            } else if (buttonText === 'See Results') {
                this.endGame(false);
            } else {
                this.loadQuestion();
            }
        }
    }

    prepareNextQuestion() {
        // Reset visual states and re-enable buttons
        document.querySelectorAll('.answer-btn').forEach(btn => {
            btn.classList.remove('selected', 'correct', 'incorrect', 'disabled', 'waiting');
            btn.style.display = 'flex';
            btn.disabled = false;
            btn.style.pointerEvents = 'auto';
        });
        
        // Hide explanation, team decision, and team wrong sections
        document.getElementById('explanation').classList.add('hidden');
        document.getElementById('team-decision').classList.add('hidden');
        document.getElementById('team-wrong').classList.add('hidden');
        
        // Update team UI to reflect current state
        if (this.gameMode === 'team') {
            this.updateTeamUI();
        }
        
        // Load the question (current question index is already updated)
        this.loadQuestion();
    }

    moveToNextTeam() {
        // Move to next team in rotation
        this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
        
        // Reset lifelines for the new team (each team gets fresh lifelines per question)
        this.usedLifelines = {
            fiftyFifty: false,
            askAudience: false,
            phoneAFriend: false
        };
        
        // Reset lifeline buttons
        document.querySelectorAll('.lifeline-btn').forEach(btn => {
            btn.classList.remove('used');
            btn.disabled = false;
        });
    }

    useFiftyFifty() {
        if (this.usedLifelines.fiftyFifty) return;

        this.playSound('fiftyFifty');

        const question = this.currentQuestions[this.currentQuestion];
        const answerBtns = document.querySelectorAll('.answer-btn');
        const correctIndex = question.correct;
        
        // Get two random wrong answers to disable
        const wrongIndices = [];
        for (let i = 0; i < answerBtns.length; i++) {
            if (i !== correctIndex) wrongIndices.push(i);
        }
        
        // Randomly remove 2 wrong answers
        const toDisable = wrongIndices.sort(() => Math.random() - 0.5).slice(0, 2);
        
        toDisable.forEach(index => {
            answerBtns[index].classList.add('disabled');
            answerBtns[index].disabled = true;
        });

        this.usedLifelines.fiftyFifty = true;
        document.getElementById('fifty-fifty').classList.add('used');
    }

    askAudience() {
        if (this.usedLifelines.askAudience) return;

        this.playSound('askAudience');

        // Clear previous poll results and show classroom instruction
        const pollBars = document.querySelectorAll('.poll-bar');
        pollBars.forEach((bar) => {
            const fill = bar.querySelector('.bar-fill');
            const percentage = bar.querySelector('.poll-percentage');
            fill.style.width = '0%';
            percentage.textContent = '0%';
        });

        // Show modal with classroom instructions
        this.showModal('audience-poll');

        // Update modal content for classroom use
        const modalContent = document.querySelector('#audience-poll .modal-content');
        const originalTitle = modalContent.querySelector('h3');
        originalTitle.textContent = 'Ask the Class';
        
        // Add instruction text if not already there
        let instructionText = modalContent.querySelector('.classroom-instruction');
        if (!instructionText) {
            instructionText = document.createElement('p');
            instructionText.className = 'classroom-instruction';
            instructionText.style.cssText = 'text-align: center; margin: 20px 0; font-size: 18px; color: #fff; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 10px;';
            originalTitle.after(instructionText);
        }
        instructionText.textContent = '📊 Time for your classmates to vote! Show them your options and let them decide what they think the answer is.';

        this.usedLifelines.askAudience = true;
        document.getElementById('ask-audience').classList.add('used');
    }

    phoneAFriend() {
        if (this.usedLifelines.phoneAFriend) return;

        this.playSound('phoneAFriend');

        // Show modal and update content for classroom use
        this.showModal('phone-friend-modal');

        // Update modal title for classroom use
        const modalTitle = document.querySelector('#phone-friend-modal .modal-content h3');
        modalTitle.textContent = 'Phone the Professor';
        
        // Show classroom instruction message
        document.getElementById('friend-message').textContent = "📞 Time to call your professor! Ask them for their expert advice on this question.";

        this.usedLifelines.phoneAFriend = true;
        document.getElementById('phone-friend').classList.add('used');
    }

    walkAway() {
        const currentWinnings = this.currentQuestion > 0 ? this.moneyLadder[this.currentQuestion - 1] : 0;
        this.endGame(false, currentWinnings, "You decided to walk away!");
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }

    endGame(won, customAmount = null, customMessage = null) {
        this.gameOver = true;
        
        if (this.gameMode === 'team') {
            // Team mode - show tournament results
            this.showTeamTournamentResults();
        } else {
            // Individual mode - show traditional results
            const finalAmount = customAmount !== null ? customAmount : (won ? this.moneyLadder[9] : (this.currentQuestion > 0 ? this.moneyLadder[this.currentQuestion - 1] : this.moneyLadder[0]));
            
            let title, message;
            if (customMessage) {
                title = "Game Over";
                message = customMessage;
            } else if (won) {
                title = "Congratulations!";
                message = "You've mastered " + this.currentTopic.toUpperCase() + "!";
            } else {
                title = "Game Over";
                message = "Better luck next time!";
            }
            
            document.getElementById('result-title').textContent = title;
            document.getElementById('final-amount').textContent = `You won ${finalAmount}!`;
            document.getElementById('result-message').textContent = message;
            
            // Show individual options
            document.getElementById('individual-end-options').classList.remove('hidden');
            document.getElementById('team-end-options').classList.add('hidden');
            
            setTimeout(() => {
                this.showScreen('result-screen');
            }, 1000);
        }
    }

    resetGame() {
        this.currentQuestion = 0;
        this.currentTopic = null;
        this.currentDifficulty = null;
        this.gameOver = false;
        this.usedLifelines = {
            fiftyFifty: false,
            askAudience: false,
            phoneAFriend: false
        };
        this.currentQuestions = [];
        
        // Reset lifeline buttons
        document.querySelectorAll('.lifeline-btn').forEach(btn => btn.classList.remove('used'));
        
        // Reset money ladder
        document.querySelectorAll('.ladder-step').forEach(step => {
            step.classList.remove('current', 'completed');
        });
        document.querySelector('.ladder-step[data-level="1"]').classList.add('current');
        
        // Hide explanation
        document.getElementById('explanation').classList.add('hidden');
        
        this.showScreen('start-screen');
    }

    // Team Tournament Methods
    selectGameMode(mode) {
        this.gameMode = mode;
        if (mode === 'individual') {
            this.showScreen('topic-screen');
            document.getElementById('topic-subtitle').textContent = 'Test your knowledge of HTML, CSS, and JavaScript!';
        } else {
            this.showScreen('team-setup-screen');
        }
    }

    addTeam() {
        const input = document.getElementById('team-name-input');
        const teamName = input.value.trim();
        
        if (teamName && !this.teams.includes(teamName)) {
            this.teams.push(teamName);
            this.teamStats.set(teamName, { score: 0, questionsAnswered: 0, correctAnswers: 0 });
            this.updateTeamsList();
            input.value = '';
            this.updateStartTournamentButton();
        }
    }

    addQuickTeam(teamName) {
        if (!this.teams.includes(teamName)) {
            this.teams.push(teamName);
            this.teamStats.set(teamName, { score: 0, questionsAnswered: 0, correctAnswers: 0 });
            this.updateTeamsList();
            this.updateStartTournamentButton();
        }
    }

    updateTeamsList() {
        const teamsList = document.getElementById('teams-list');
        teamsList.innerHTML = '';
        
        this.teams.forEach((team, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="team-name">${team}</span>
                <button class="remove-team-btn" data-team="${team}">Remove</button>
            `;
            teamsList.appendChild(li);
        });

        // Add remove event listeners
        document.querySelectorAll('.remove-team-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.removeTeam(e.target.dataset.team));
        });
    }

    removeTeam(teamName) {
        this.teams = this.teams.filter(team => team !== teamName);
        this.teamStats.delete(teamName);
        this.updateTeamsList();
        this.updateStartTournamentButton();
    }

    updateStartTournamentButton() {
        const btn = document.getElementById('start-tournament-btn');
        btn.disabled = this.teams.length < 2;
        btn.textContent = this.teams.length < 2 ? 'Add at least 2 teams' : 'Start Tournament';
    }

    startTournament() {
        if (this.teams.length >= 2) {
            this.currentTeamIndex = 0;
            this.showScreen('topic-screen');
            document.getElementById('topic-subtitle').textContent = `Team tournament with ${this.teams.length} teams!`;
        }
    }

    getCurrentTeam() {
        return this.teams[this.currentTeamIndex];
    }

    updateTeamUI() {
        if (this.gameMode === 'team') {
            const teamInfo = document.getElementById('team-info');
            const currentTeam = this.getCurrentTeam();
            const teamStats = this.teamStats.get(currentTeam);
            
            teamInfo.classList.remove('hidden');
            document.getElementById('current-team-name').textContent = currentTeam;
            document.getElementById('team-question-num').textContent = this.currentQuestion + 1;
            document.getElementById('team-score').textContent = teamStats.score;
            
            console.log('Team UI Updated:', { 
                team: currentTeam, 
                score: teamStats.score, 
                questionsAnswered: teamStats.questionsAnswered,
                currentQuestion: this.currentQuestion
            });
        }
    }

    nextTeam() {
        if (this.gameMode === 'team') {
            this.currentTeamIndex = (this.currentTeamIndex + 1) % this.teams.length;
            this.resetForNewTeam();
            this.updateTeamUI();
            this.loadQuestion();
        }
    }

    resetForNewTeam() {
        this.currentQuestion = 0;
        this.gameOver = false;
        this.usedLifelines = {
            fiftyFifty: false,
            askAudience: false,
            phoneAFriend: false
        };
        
        // Reset lifeline buttons
        document.querySelectorAll('.lifeline-btn').forEach(btn => {
            btn.classList.remove('used');
            btn.disabled = false;
        });

        // Reset money ladder
        document.querySelectorAll('.ladder-step').forEach(step => {
            step.classList.remove('current', 'completed');
        });
        document.querySelector('.ladder-step[data-level="1"]').classList.add('current');
    }

    showLeaderboard() {
        this.updateLeaderboardDisplay();
        this.showScreen('leaderboard-screen');
    }

    updateLeaderboardDisplay() {
        const rows = document.getElementById('leaderboard-rows');
        rows.innerHTML = '';
        
        // Sort teams by score (descending)
        const sortedTeams = [...this.teams].sort((a, b) => {
            const scoreA = this.teamStats.get(a).score;
            const scoreB = this.teamStats.get(b).score;
            return scoreB - scoreA;
        });

        sortedTeams.forEach((team, index) => {
            const stats = this.teamStats.get(team);
            const row = document.createElement('div');
            row.className = 'leaderboard-row';
            row.innerHTML = `
                <span class="rank">${index + 1}</span>
                <span class="team-name">${team}</span>
                <span class="score">${stats.score}</span>
                <span class="questions">${stats.questionsAnswered}</span>
            `;
            rows.appendChild(row);
        });
    }

    continueTournament() {
        this.showScreen('game-screen');
    }

    endTournament() {
        this.showFinalResults();
    }

    showFinalResults() {
        const winner = [...this.teams].sort((a, b) => {
            return this.teamStats.get(b).score - this.teamStats.get(a).score;
        })[0];
        
        const winnerStats = this.teamStats.get(winner);
        
        document.getElementById('result-title').textContent = 'Tournament Complete!';
        document.getElementById('final-amount').textContent = `Winner: ${winner}`;
        document.getElementById('result-message').textContent = `Final Score: ${winnerStats.score} points!`;
        
        this.showScreen('result-screen');
    }

    // Team Decision Methods
    showTeamDecision() {
        const currentTeam = this.getCurrentTeam();
        const teamStats = this.teamStats.get(currentTeam);
        
        // Hide explanation and show decision
        document.getElementById('explanation').classList.add('hidden');
        document.getElementById('team-decision').classList.remove('hidden');
        
        // Update button text to show current points at risk
        const pointText = teamStats.score === 1 ? 'point' : 'points';
        document.querySelector('#continue-risk-btn .btn-description').textContent = 
            `Try next question - lose ALL ${teamStats.score} ${pointText} if wrong`;
        document.querySelector('#pass-safe-btn .btn-description').textContent = 
            `Keep ${teamStats.score} ${pointText} safe - next team plays`;
    }

    teamContinueRisk() {
        // Team chooses to continue and risk all points
        document.getElementById('team-decision').classList.add('hidden');
        this.currentQuestion++;
        this.prepareNextQuestion();
        
        console.log(`${this.getCurrentTeam()} chose to continue and risk ${this.teamStats.get(this.getCurrentTeam()).score} points`);
    }

    teamPassSafe() {
        // Team chooses to pass and keep points safe
        document.getElementById('team-decision').classList.add('hidden');
        this.currentQuestion++; // Move to next question
        this.moveToNextTeam();  // Move to next team
        this.prepareNextQuestion();
        
        console.log(`${this.getCurrentTeam()} chose to pass and keep points safe - moving to next question`);
    }

    teamWrongNext() {
        // Team got wrong answer - move to next team, same question
        document.getElementById('team-wrong').classList.add('hidden');
        this.moveToNextTeam();
        this.prepareNextQuestion();
        
        console.log('Moving to next team after wrong answer');
    }

    // Team Tournament End Game Methods
    showTeamTournamentResults() {
        // Find winner (highest score)
        const winner = [...this.teams].sort((a, b) => {
            return this.teamStats.get(b).score - this.teamStats.get(a).score;
        })[0];
        
        const winnerStats = this.teamStats.get(winner);
        
        // Update main result display
        document.getElementById('result-title').textContent = 'Tournament Complete!';
        document.getElementById('final-amount').textContent = `🏆 ${winner} Wins!`;
        document.getElementById('result-message').textContent = `Congratulations on an amazing tournament!`;
        
        // Update winner display
        document.getElementById('winning-team').textContent = winner;
        document.getElementById('winning-score').textContent = `Final Score: ${winnerStats.score} point${winnerStats.score !== 1 ? 's' : ''}`;
        
        // Update final standings
        this.updateFinalStandings();
        
        // Show team options
        document.getElementById('individual-end-options').classList.add('hidden');
        document.getElementById('team-end-options').classList.remove('hidden');
        
        setTimeout(() => {
            this.showScreen('result-screen');
        }, 1000);
    }

    updateFinalStandings() {
        const standings = document.getElementById('final-standings');
        standings.innerHTML = '';
        
        // Sort teams by score (descending)
        const sortedTeams = [...this.teams].sort((a, b) => {
            return this.teamStats.get(b).score - this.teamStats.get(a).score;
        });

        sortedTeams.forEach((team, index) => {
            const stats = this.teamStats.get(team);
            const standing = document.createElement('div');
            standing.className = 'standing-row';
            standing.innerHTML = `
                <span class="standing-rank">${index + 1}.</span>
                <span class="standing-team">${team}</span>
                <span class="standing-score">${stats.score} pt${stats.score !== 1 ? 's' : ''}</span>
            `;
            standings.appendChild(standing);
        });
    }

    // End Game Options
    resetAndReplay() {
        // Reset all team scores to 0
        this.teams.forEach(team => {
            this.teamStats.set(team, { score: 0, questionsAnswered: 0, correctAnswers: 0 });
        });
        this.currentTeamIndex = 0;
        this.currentQuestion = 0;
        this.gameOver = false;
        this.usedLifelines = {
            fiftyFifty: false,
            askAudience: false,
            phoneAFriend: false
        };
        
        this.showScreen('topic-screen');
        document.getElementById('topic-subtitle').textContent = `Team tournament with ${this.teams.length} teams!`;
    }

    newQuizKeepScores() {
        // Keep current scores, just reset game state
        this.currentTeamIndex = 0;
        this.currentQuestion = 0;
        this.gameOver = false;
        this.usedLifelines = {
            fiftyFifty: false,
            askAudience: false,
            phoneAFriend: false
        };
        
        this.showScreen('topic-screen');
        document.getElementById('topic-subtitle').textContent = `Continue tournament with current scores!`;
    }

    backToModeSelection() {
        // Complete reset - back to individual vs team choice
        this.gameMode = 'individual';
        this.teams = [];
        this.currentTeamIndex = 0;
        this.teamStats = new Map();
        this.currentQuestion = 0;
        this.currentTopic = null;
        this.currentDifficulty = null;
        this.gameOver = false;
        this.usedLifelines = {
            fiftyFifty: false,
            askAudience: false,
            phoneAFriend: false
        };
        
        this.stopBackgroundMusic();
        this.playBackgroundMusic('introMusic');
        this.showScreen('start-screen');
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MillionaireGame();
});