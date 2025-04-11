//Variables
let score = 0;
let lastCard;
let oldCardsIndexs = [];
// let gameStill = true;

const numberOfCards = 13;
const numberOfSymbols = 4;
const scoreToWin = 10;
const hearthSymbol = "fa-solid fa-heart symbol red-tx";
const diamondSymbol = "fa-solid fa-diamond symbol red-tx";
const cloverSymbol = "fa-solid fa-clover symbol";
const spadeSymbol = "fa-solid fa-trowel symbol";
let playerName = "";
let cardRotatingState = false;
//queries
const hearthIcon = '<i class="fa-solid fa-heart" </i>;';
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
const cardRecord = document.querySelector("#card-record");
const card = document.querySelector("#card");
const instructionsButton = document.querySelector("#instructions-button");

//Functions

//this funcion make a number to symbol

const putSymbol = (symbol) => {
  if (symbol == "Hearth") {
    cardSymbol.className = hearthSymbol;
    cardNumber.classList.add("red-tx");
  } else if (symbol == "Diamond") {
    cardSymbol.className = diamondSymbol;
    cardNumber.classList.add("red-tx");
  } else if (symbol == "Clover") {
    cardSymbol.className = cloverSymbol;
    cardNumber.classList.remove("red-tx");
  } else if (symbol == "Spade") {
    cardSymbol.className = spadeSymbol;
    cardNumber.classList.remove("red-tx");
  }
};
function MakeSymbol(symbol) {
  if (symbol == "1") {
    return "Hearth";
  } else if (symbol == "2") {
    return "Diamond";
  } else if (symbol == "3") {
    return "Clover";
  } else if (symbol == "4") {
    return "Spade";
  }
}

let createMiniCard = (number, symbol) => {
  let miniCard = document.createElement("div");
  miniCard.classList.add("mini-card");
  miniCard.classList.add("fade-in");

  let miniCardParraf = document.createElement("p");
  miniCardParraf.textContent = number;
  cardRecord.appendChild(miniCard);
  miniCard.appendChild(miniCardParraf);
  if (symbol == "Hearth" || symbol == "Diamond") {
    miniCardParraf.classList.add("red-tx");
  }
};

function VerifyCard(newCard) {
  if (oldCardsIndexs.length >= 52) {
    scoreFinalText.textContent = `your score: ${score}`;
    finishScreen.classList.remove("dp-none");
  } else {
    return oldCardsIndexs.includes(newCard);
  }
}

function RegisterCard(card) {
  oldCardsIndexs.unshift(card);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const showCardContent = () => {
  cardInfo.classList.remove("dp-none");
};
const showCardBackface = () => {
  cardInfo.classList.add("dp-none");
};

let flipCard = async (cardState) => {
  cardRotatingState = true;
  card.classList.add("flip");
  await delay(250);
  cardState();
  await delay(250);
  cardRotatingState = false;
  card.classList.remove("flip");
};

async function GetARandomCard() {
  const newNumber = Math.floor(Math.random() * numberOfCards + 1);
  const newSymbol = MakeSymbol(Math.floor(Math.random() * numberOfSymbols + 1));
  const newCard = newNumber + " " + newSymbol;
  lastCard = newCard;
  if (VerifyCard(newCard)) {
    console.log("se repitio");
    return GetARandomCard();
  } else {
    cardNumber.textContent = newNumber;
    putSymbol(newSymbol);
    await flipCard(showCardContent);
    createMiniCard(newNumber, newSymbol);
    RegisterCard(newCard);
    return newCard;
  }
}

//this function valide the answer and increment the score or finish the game
async function ValidateCard(state) {
  if (cardRotatingState) {
    return;
  }
  const beforeCard = lastCard;
  await flipCard(showCardBackface);
  const newCard = await GetARandomCard();
  newCardSplitted = newCard.split(" ");
  beforeCardSplitted = beforeCard.split(" ");
  let newState = parseInt(newCardSplitted[0]) - parseInt(beforeCardSplitted[0]);
  if (newState > 0 && state == "Higher") {
    score += 1;
    scoreText.textContent = `score: ${score}`;
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

function SavaLocalData(nameData, numberData) {
  localStorage.setItem(nameData, numberData);
}

async function RestartGame() {
  playButton.className = "dp-none";
  cardInfo.classList.remove("dp-none");
  gameButtons.classList.remove("dp-none");
  finishScreen.classList.add("dp-none");
  score = 0;
  gameEnd = false;
  scoreText.textContent = `score: 0`;
  nameTextInput.value = "";
  oldCardsIndexs = [];
  cardRecord.innerHTML = "";
  await flipCard(showCardBackface);
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

playButton.addEventListener("click", async () => {
  playButton.className = "dp-none";
  cardInfo.classList.remove("dp-none");
  gameButtons.classList.remove("dp-none");
  await flipCard(showCardBackface);
  GetARandomCard();
  console.log("empezamos");
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
