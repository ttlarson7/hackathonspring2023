document.getElementById("startQuizButton").addEventListener("click", function() {
  makeQuizSet(document.getElementById('setValue').value, document.getElementById('number-of-values').value)
})

document.getElementById("submitButton").addEventListener("click", function() {
  submitQuiz()
})

var cardContainer = document.getElementById("cardContainer");
var submitButton = document.getElementById("submitButton");
var quizSet;

function makeQuizSet(setNumber, numberOfValues) {
  fetch("/createQuiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }, 
    body: JSON.stringify({number: setNumber, quizSize: numberOfValues})
  }).then(function(res) {
    return res.json()
  }).then(function(data) {
    quizSet = createSet(data)
  }).catch(function(err) {
    console.log("Error ", err)
  }).then(function() {
    startQuiz()
  })
}  

function createSet(setJson) {
  outputSet = {name: setJson["setName"], questions: []}
  keys = Object.keys(setJson)
  
  for (i = 1; i < keys.length; i++) {
    outputSet["questions"].push({question: keys[i], answer: setJson[keys[i]]})
  }

  return outputSet

}

  
// Function to populate the quiz based on the selected set
function populateQuiz() {
  var selectedSet = quizSet
  console.log(quizSet)
  // Clear previous quiz cards
  cardContainer.innerHTML = "";

  // Create quiz cards
  selectedSet.questions.forEach(function(question) {
    var card = document.createElement("div");
    card.classList.add("card");
 
    var questionElement = document.createElement("h2");
    questionElement.classList.add("question");
    questionElement.textContent = question.question;
  
    var answerInput = document.createElement("input");
    answerInput.classList.add("answer-input");
    answerInput.placeholder = "Enter your answer";
  
    card.appendChild(questionElement);
    card.appendChild(answerInput);
  
    cardContainer.appendChild(card);
  });
}
  
// Start Quiz
function startQuiz() {
  document.getElementById("setContainer").style.display = "none";
  document.getElementById("cardContainer").style.display = "block";
  populateQuiz();
}
  
// Submit quiz
function submitQuiz() {
  var cards = document.querySelectorAll(".card");
  var cardData =  []

  cards.forEach(function(card) {
    cardData.push(card.querySelector(".answer-input").value.trim())
  })

  fetch("/verifyAnswers", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({"cards":cardData, "quizSet":quizSet})
  }).then(function(res) {
    return res.text()
  }).then(function(data) {
    printScore(parseInt(data))
  }).catch(function(err) {
    console.log("Error: ", err)
  })
}

function printScore(score) {
  alert("Your score: " + score + "/" + quizSet.questions.length)

  window.location.href = "/home"
}

function goToView(){
  window.location.href = '/view'
}
  