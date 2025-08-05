// //your JS code here.

// // Do not change code below this line
// // This code will just display the questions to the screen
// const questions = [
//   {
//     question: "What is the capital of France?",
//     choices: ["Paris", "London", "Berlin", "Madrid"],
//     answer: "Paris",
//   },
//   {
//     question: "What is the highest mountain in the world?",
//     choices: ["Everest", "Kilimanjaro", "Denali", "Matterhorn"],
//     answer: "Everest",
//   },
//   {
//     question: "What is the largest country by area?",
//     choices: ["Russia", "China", "Canada", "United States"],
//     answer: "Russia",
//   },
//   {
//     question: "Which is the largest planet in our solar system?",
//     choices: ["Earth", "Jupiter", "Mars"],
//     answer: "Jupiter",
//   },
//   {
//     question: "What is the capital of Canada?",
//     choices: ["Toronto", "Montreal", "Vancouver", "Ottawa"],
//     answer: "Ottawa",
//   },
// ];

// // Display the quiz questions and choices
// function renderQuestions() {
//   for (let i = 0; i < questions.length; i++) {
//     const question = questions[i];
//     const questionElement = document.createElement("div");
//     const questionText = document.createTextNode(question.question);
//     questionElement.appendChild(questionText);
//     for (let j = 0; j < question.choices.length; j++) {
//       const choice = question.choices[j];
//       const choiceElement = document.createElement("input");
//       choiceElement.setAttribute("type", "radio");
//       choiceElement.setAttribute("name", `question-${i}`);
//       choiceElement.setAttribute("value", choice);
//       if (userAnswers[i] === choice) {
//         choiceElement.setAttribute("checked", true);
//       }
//       const choiceText = document.createTextNode(choice);
//       questionElement.appendChild(choiceElement);
//       questionElement.appendChild(choiceText);
//     }
//     questionsElement.appendChild(questionElement);
//   }
// }
// renderQuestions();


/*  script.js – Quiz with session & local storage  */

// --- Provided questions list (unchanged) ---
const questions = [
  {
    question: "What is the capital of France?",
    choices: ["Paris", "London", "Berlin", "Madrid"],
    answer: "Paris",
  },
  {
    question: "What is the highest mountain in the world?",
    choices: ["Everest", "Kilimanjaro", "Denali", "Matterhorn"],
    answer: "Everest",
  },
  {
    question: "What is the largest country by area?",
    choices: ["Russia", "China", "Canada", "United States"],
    answer: "Russia",
  },
  {
    question: "Which is the largest planet in our solar system?",
    choices: ["Earth", "Jupiter", "Mars"],
    answer: "Jupiter",
  },
  {
    question: "What is the capital of Canada?",
    choices: ["Toronto", "Montreal", "Vancouver", "Ottawa"],
    answer: "Ottawa",
  },
];

// --- DOM shortcuts ---
const questionsContainer = document.getElementById("questions");
const submitBtn = document.getElementById("submit");
const scoreDisplay = document.getElementById("score");

// --- Helper: save current selections to session storage ---
function saveProgress() {
  const progress = {};
  questions.forEach((_, idx) => {
    const selected = document.querySelector(`input[name="question-${idx}"]:checked`);
    if (selected) progress[idx] = selected.value;
  });
  sessionStorage.setItem("progress", JSON.stringify(progress));
}

// --- Helper: restore selections from session storage ---
function restoreProgress() {
  const saved = JSON.parse(sessionStorage.getItem("progress") || "{}");
  Object.entries(saved).forEach(([idx, val]) => {
    const radio = document.querySelector(`input[name="question-${idx}"][value="${val}"]`);
    if (radio) {
      radio.setAttribute("checked", "true");   // <- attribute, not property
    }
  });
}

// --- Render questions & choices ---
function renderQuestions() {
  questionsContainer.innerHTML = ""; // clear
  questions.forEach((q, qIdx) => {
    const div = document.createElement("div");

    const prompt = document.createElement("h3");
    prompt.textContent = `${qIdx + 1}. ${q.question}`;
    div.appendChild(prompt);

    q.choices.forEach((choice) => {
      const label = document.createElement("label");
      label.style.display = "block";
      label.innerHTML = `
        <input type="radio" name="question-${qIdx}" value="${choice}">
        ${choice}
      `;
      div.appendChild(label);
    });
    questionsContainer.appendChild(div);
  });
  restoreProgress(); // tick saved answers after render
}

// --- Submit handler ---
function submitQuiz() {
  let score = 0;
  questions.forEach((q, idx) => {
    const selected = document.querySelector(`input[name="question-${idx}"]:checked`);
    if (selected && selected.value === q.answer) score++;
  });

  scoreDisplay.textContent = `Your score is ${score} out of ${questions.length}.`;
  localStorage.setItem("score", score);
  sessionStorage.removeItem("progress"); // quiz finished
}

// --- Show last score after page refresh ---
window.addEventListener("load", () => {
  const lastScore = localStorage.getItem("score");
  if (lastScore !== null) {
    scoreDisplay.textContent = `Your score is ${lastScore} out of ${questions.length}.`;
  }
});

// --- Wire-up events ---
renderQuestions();
questionsContainer.addEventListener("change", saveProgress);
submitBtn.addEventListener("click", submitQuiz);
