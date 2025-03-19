//Variables
let score = 0;
let lastCard;
let oldCardsIndexs = [];

const numberOfCards = 13;
const numberOfSymbols = 4;
const scoreToWin = 10;
const hearthSymbol = "fa-solid fa-heart symbol";
const diamondSymbol = "fa-solid fa-diamond symbol";
const cloverSymbol = "fa-solid fa-clover symbol";
const spadeSymbol = "fa-solid fa-trowel symbol";
let playerName = "";
//queries
const hearthIcon = '<i class="fa-solid fa-heart" style="color: #ff0000;"></i>;';
const playButton = document.querySelector("#play-button");
const gameButtons = document.querySelector("#game-buttons");
const cardInfo = document.querySelector("#card-info");
const cardNumber = document.querySelector("#card-number");
const cardSymbol = document.querySelector("#symbol");
const higherButton = document.querySelector("#higher-button");
const equalButton = document.querySelector("#equal-button");
const lowerButton = document.querySelector("#lower-button");
const finishScreen = document.querySelector("#finish-screen");
const scoreText = document.querySelector("#score");
const scoreFinalText = document.querySelector("#score-final");
const tryAgainButton = document.querySelector("#try-again");
const submmitButton = document.querySelector("#submit");
const nameTextInput = document.querySelector("#text-input");
const usernamePlayers = document.querySelector("#username-players");
const scorePlayers = document.querySelector("#score-players");

//Functions

//this funcion make a number to symbol
function MakeSymbol(symbol) {
  if (symbol == "1") {
    cardSymbol.className = hearthSymbol;
    return "Hearth";
  } else if (symbol == "2") {
    cardSymbol.className = diamondSymbol;
    return "Diamond";
  } else if (symbol == "3") {
    cardSymbol.className = cloverSymbol;
    return "Clover";
  } else if (symbol == "4") {
    cardSymbol.className = spadeSymbol;
    return "Spade";
  }
}

// function VerifyCard(newCard) {
//     return oldCardsIndexs.includes(newCard)
// }

// function RegisterCard(card) {
//     oldCardsIndexs.unshift(card)
// }

function GetARandomCard() {
  const newNumber = Math.floor(Math.random() * numberOfCards + 1);
  cardNumber.textContent = newNumber;
  const newSymbol = Math.floor(Math.random() * numberOfSymbols + 1);
  const newCard = newNumber + " " + MakeSymbol(newSymbol);
  lastCard = newCard;
  return newCard;
}

//this function valide the answer and increment the score or finish the game
function ValidateCard(state) {
  const beforeCard = lastCard;
  const newCard = GetARandomCard();
  newCardSplitted = newCard.split(" ");
  beforeCardSplitted = beforeCard.split(" ");
  let newState = parseInt(newCardSplitted[0]) - parseInt(beforeCardSplitted[0]);
  if (newState > 0 && state == "Higher") {
    score += 1;
    scoreText.textContent = `score: ${score}`;
    console.log(score);
  } else if (newState < 0 && state == "Lower") {
    score += 1;
    scoreText.textContent = `score: ${score}`;
  } else if (newState == 0 && state == "Equal") {
    score += 5;
    scoreText.textContent = `score: ${score}`;
  } else {
    scoreFinalText.textContent = `your score: ${score}`;
    finishScreen.classList.remove("dp-none");
  }
}

function GetLocalData() {}

function SavaLocalData(nameData, numberData) {
  localStorage.setItem(nameData, numberData);
}

function RestartGame() {
  finishScreen.classList.add("dp-none");
  score = 0;
  gameEnd = false;
  scoreText.textContent = `score: 0`;
  nameTextInput.value = "";
  GetARandomCard();
}
function UpdateLeaderboard() {
  usernamePlayers.innerHTML = "";
  scorePlayers.innerHTML = "";
  Object.keys(localStorage).forEach((item) => {
    let newNameData = document.createElement("p");
    newNameData.textContent = item;
    usernamePlayers.appendChild(newNameData);
    let newScoreData = document.createElement("p");
    newScoreData.textContent = localStorage.getItem(item);
    scorePlayers.appendChild(newScoreData);
  });
}

playButton.addEventListener("click", () => {
  GetARandomCard();
  console.log("empezamos");
  playButton.className = "dp-none";
  cardInfo.classList.remove("dp-none");
  gameButtons.classList.remove("dp-none");
});

lowerButton.addEventListener("click", () => ValidateCard("Lower"));
equalButton.addEventListener("click", () => ValidateCard("Equal"));
higherButton.addEventListener("click", () => ValidateCard("Higher"));
tryAgainButton.addEventListener("click", () => RestartGame());

nameTextInput.addEventListener("input", (event) => {
  playerName = event.target.value;
});

submmitButton.addEventListener("click", () => {
  if (nameTextInput.value != "") {
    SavaLocalData(playerName, score);
    UpdateLeaderboard();
    RestartGame();
  }
});

UpdateLeaderboard();
