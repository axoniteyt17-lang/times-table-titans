let questions = [];

// Generate one question for each table from 2–12
function generateInitialQuestions() {
  const qs = [];

  for (let table = 2; table <= 12; table++) {
    for (let multiplier = 2; multiplier <= 12; multiplier++) {
      qs.push({
        table,
        multiplier,
        answer: table * multiplier,
      });
    }
  }

  // Shuffle the questions so they appear in a random order
  for (let i = qs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [qs[i], qs[j]] = [qs[j], qs[i]];
  }

  return qs;
}

function loadQuestions() {
  try {
    const saved = localStorage.getItem("incorrectQuestions");

    if (saved) {
      questions = JSON.parse(saved);

      if (!Array.isArray(questions) || questions.length === 0) {
        questions = generateInitialQuestions();
      }
    } else {
      questions = generateInitialQuestions();
    }
  } catch (error) {
    console.error("Error loading saved questions:", error);
    questions = generateInitialQuestions();
  }

  renderQuiz();
}

function renderQuiz() {
  const quizDiv = document.getElementById("quiz");

  quizDiv.innerHTML = "";
  document.getElementById("results").innerHTML = "";

  questions.forEach((q, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "question";

    questionDiv.innerHTML = `
            ${q.table} × ${q.multiplier} =
            <input type="number" id="q${index}">
        `;

    quizDiv.appendChild(questionDiv);
  });
}

function submitQuiz() {
  let score = 0;
  const incorrect = [];

  questions.forEach((q, index) => {
    const input = document.getElementById(`q${index}`).value.trim();

    if (input !== "" && Number(input) === q.answer) {
      score++;
    } else {
      incorrect.push(q);
    }
  });

  const total = questions.length;

  document.getElementById("results").innerHTML = `
        Score: ${score}/${total}<br>
        ${score === total ? "Perfect score! 🎉" : "Keep practising!"}
    `;

  localStorage.setItem("incorrectQuestions", JSON.stringify(incorrect));

  if (incorrect.length === 0) {
    localStorage.removeItem("incorrectQuestions");
    document.getElementById("congratsModal").style.display = "block";
  } else {
    questions = incorrect;

    setTimeout(() => {
      alert(
        `Next round contains ${incorrect.length} question(s) that need more practice.`,
      );

      renderQuiz();
    }, 500);
  }
}

function closeModal() {
  document.getElementById("congratsModal").style.display = "none";

  localStorage.removeItem("incorrectQuestions");

  questions = generateInitialQuestions();
  renderQuiz();
}

document.getElementById("submitBtn").addEventListener("click", submitQuiz);

loadQuestions();
