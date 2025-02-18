const API_URL = "https://opentdb.com/api.php?amount=50&category=18&type=multiple";

let questions = [];
let currentRound = 1;
let currentQuestionIndex = 0;
let score = 0;
let correctAnswers = 0;
const totalQuestions = [3, 10, 50];

async function fetchQuestions() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        questions = data.results.map(item => ({
            question: item.question,
            answers: [...item.incorrect_answers, item.correct_answer].sort(() => Math.random() - 0.5),
            correct: item.correct_answer
        }));

        startGame();
    } catch (error) {
        console.error("Error fetching questions:", error);
    }
}

function startGame() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("quiz-container").classList.remove("hidden");
    currentRound = 1;
    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    loadQuestion();
}

function getRandomQuestions(count) {
    return questions.sort(() => Math.random() - 0.5).slice(0, count);
}

function loadQuestion() {
    let currentQuestions = getRandomQuestions(totalQuestions[currentRound - 1]);
    let questionData = currentQuestions[currentQuestionIndex];

    document.getElementById("round-title").innerText = `Round ${currentRound}`;
    document.getElementById("question").innerHTML = questionData.question;
    document.getElementById("answer-buttons").innerHTML = "";

    questionData.answers.forEach(answer => {
        let button = document.createElement("button");
        button.innerText = answer;
        button.onclick = () => selectAnswer(button, answer, questionData.correct);
        document.getElementById("answer-buttons").appendChild(button);
    });
}

function selectAnswer(button, answer, correctAnswer) {
    let buttons = document.querySelectorAll("#answer-buttons button");

    // Disable all buttons after selection
    buttons.forEach(btn => btn.disabled = true);

    if (answer === correctAnswer) {
        button.classList.add("correct");
        correctAnswers++;
        if (currentRound === 3) {
            score += 10;
        }
    } else {
        button.classList.add("wrong");
        
        // Highlight the correct answer in green
        buttons.forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.classList.add("correct");
            }
        });
    }

    setTimeout(() => {
        if (currentQuestionIndex < totalQuestions[currentRound - 1] - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            nextRound();
        }
    }, 1000); // Wait 1 second before moving to the next question
}

function nextRound() {
    if (currentRound === 1 && correctAnswers >= 2) {
        currentRound = 2;
    } else if (currentRound === 2 && correctAnswers >= 8) {
        currentRound = 3;
    } else if (currentRound === 3) {
        alert(`Game Over! Your Final Score: ${score}`);
        goBack();
        return;
    } else {
        alert("You didn't qualify for the next round!");
        goBack();
        return;
    }

    correctAnswers = 0;
    currentQuestionIndex = 0;
    loadQuestion();
}

function quitGame() {
    if (confirm("Are you sure you want to quit?")) {
        goBack();
    }
}

function showRules() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("rules-screen").classList.remove("hidden");
}

function showTeam() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("team-screen").classList.remove("hidden");
}

function goBack() {
    document.getElementById("start-screen").classList.remove("hidden");
    document.getElementById("rules-screen").classList.add("hidden");
    document.getElementById("team-screen").classList.add("hidden");
    document.getElementById("quiz-container").classList.add("hidden");
}

// Start fetching questions when the page loads
fetchQuestions();
