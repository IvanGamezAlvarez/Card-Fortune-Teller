// Variables
let score = 0;
let lastCard;
let oldCardsIndexs = [];
let playerName = "";
let cardRotatingState = false;

const numberOfCards = 13;
const numberOfSymbols = 4;
const hearthSymbol = "fa-solid fa-heart symbol red-tx";
const diamondSymbol = "fa-solid fa-diamond symbol red-tx";
const cloverSymbol = "fa-solid fa-clover symbol";
const spadeSymbol = "fa-solid fa-trowel symbol";
const strikeMesagge = 3;
const maxLeaderboardPlayers = 10;

// Queries
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
const loseMessage = document.querySelector("#lose-message");

// Functions
const sendStrikeMessage = () => {
  Toastify({
    text: `Strike of ${score}`,
    duration: 2000,
    gravity: "bottom",
    position: "right",
    style: { background: "#ffd900", color: "black" },
  }).showToast();
};

const changeLoseMessage = async () => {
  const urlLoseMessage = "./Data/loseMessages.json";
  try {
    const loseMessages = await fetch(urlLoseMessage);
    const messages = await loseMessages.json();
    let randomValue = Math.floor(Math.random() * messages.length);
    loseMessage.textContent = messages[randomValue].message;
  } catch (error) {
    console.error(error);
    loseMessage.textContent = "THE GAME IS OVER";
  }
};

const putSymbol = (symbol) => {
  if (symbol === "Hearth") {
    cardSymbol.className = hearthSymbol;
    cardNumber.classList.add("red-tx");
  } else if (symbol === "Diamond") {
    cardSymbol.className = diamondSymbol;
    cardNumber.classList.add("red-tx");
  } else if (symbol === "Clover") {
    cardSymbol.className = cloverSymbol;
    cardNumber.classList.remove("red-tx");
  } else if (symbol === "Spade") {
    cardSymbol.className = spadeSymbol;
    cardNumber.classList.remove("red-tx");
  }
};

const makeSymbol = (symbol) => {
  if (symbol == "1") return "Hearth";
  if (symbol == "2") return "Diamond";
  if (symbol == "3") return "Clover";
  if (symbol == "4") return "Spade";
};

const createMiniCard = (number, symbol) => {
  let miniCard = document.createElement("div");
  let miniCardParraf = document.createElement("p");
  miniCard.classList.add("mini-card", "fade-in");
  miniCardParraf.textContent = number;
  cardRecord.appendChild(miniCard);
  miniCard.appendChild(miniCardParraf);
  if (symbol === "Hearth" || symbol === "Diamond") {
    miniCardParraf.classList.add("red-tx");
  }
};

const verifyCard = (newCard) => {
  if (oldCardsIndexs.length >= 52) {
    changeLoseMessage();
    scoreFinalText.textContent = `your score: ${score}`;
    finishScreen.classList.remove("dp-none");
    finishScreen.classList.add("fade-in");
    gameButtons.classList.add("dp-none");
  } else {
    return oldCardsIndexs.includes(newCard);
  }
};

const registerCard = (card) => oldCardsIndexs.unshift(card);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const showCardContent = () => cardInfo.classList.remove("dp-none");

const showCardBackface = () => cardInfo.classList.add("dp-none");

const flipCard = async (cardState) => {
  cardRotatingState = true;
  card.classList.add("flip");
  await delay(250);
  cardState();
  await delay(250);
  cardRotatingState = false;
  card.classList.remove("flip");
};

const getRandomCard = async () => {
  const newNumber = Math.floor(Math.random() * numberOfCards + 1);
  const newSymbol = makeSymbol(Math.floor(Math.random() * numberOfSymbols + 1));
  const newCard = newNumber + " " + newSymbol;
  lastCard = newCard;
  if (verifyCard(newCard)) {
    return getRandomCard();
  } else {
    cardNumber.textContent = newNumber;
    putSymbol(newSymbol);
    await flipCard(showCardContent);
    createMiniCard(newNumber, newSymbol);
    registerCard(newCard);
    return newCard;
  }
};

const verifyStrike = () => {
  if (score % strikeMesagge === 0) {
    sendStrikeMessage();
  }
};

const validateCard = async (state) => {
  if (cardRotatingState) return;
  const beforeCard = lastCard;
  await flipCard(showCardBackface);
  const newCard = await getRandomCard();
  const [newNumber] = newCard.split(" ");
  const [oldNumber] = beforeCard.split(" ");
  let newState = parseInt(newNumber) - parseInt(oldNumber);

  if (newState > 0 && state === "Higher") {
    score++;
    verifyStrike();
  } else if (newState < 0 && state === "Lower") {
    score++;
    verifyStrike();
  } else if (newState === 0 && state === "Equal") {
    score += 5;
    verifyStrike();
  } else {
    scoreFinalText.textContent = `your score: ${score}`;
    changeLoseMessage();
    finishScreen.classList.add("fade-in");
    finishScreen.classList.remove("dp-none");
    gameButtons.classList.add("dp-none");
    return;
  }

  scoreText.textContent = `score: ${score}`;
};

const saveLocalData = (nameData, numberData) => {
  localStorage.setItem(nameData, numberData);
};

const restartGame = async () => {
  playButton.className = "dp-none";
  cardInfo.classList.remove("dp-none");
  gameButtons.classList.remove("dp-none");
  finishScreen.classList.add("dp-none");
  finishScreen.classList.remove("fade-in");
  score = 0;
  scoreText.textContent = `score: 0`;
  nameTextInput.value = "";
  oldCardsIndexs = [];
  cardRecord.innerHTML = "";
  await flipCard(showCardBackface);
  getRandomCard();
};

const updateLeaderboard = () => {
  usernamePlayers.innerHTML = "";
  scorePlayers.innerHTML = "";
  playersAndScores = [];
  Object.keys(localStorage).forEach((key) => {
    playersAndScores.push({
      name: key,
      score: parseInt(localStorage.getItem(key)),
    });
  });
  playersAndScores.sort((a, b) => b.score - a.score);

  for (
    let i = 0;
    i < Math.min(playersAndScores.length, maxLeaderboardPlayers);
    i++
  ) {
    let newNameData = document.createElement("p");
    newNameData.textContent = playersAndScores[i].name;
    usernamePlayers.appendChild(newNameData);

    let newScoreData = document.createElement("p");
    newScoreData.textContent = playersAndScores[i].score;
    scorePlayers.appendChild(newScoreData);
  }
};

// Events
playButton.addEventListener("click", async () => {
  playButton.className = "dp-none";
  cardInfo.classList.remove("dp-none");
  gameButtons.classList.remove("dp-none");
  await flipCard(showCardBackface);
  getRandomCard();
});

lowerButton.addEventListener("click", () => validateCard("Lower"));
equalButton.addEventListener("click", () => validateCard("Equal"));
higherButton.addEventListener("click", () => validateCard("Higher"));

tryAgainButton.addEventListener("click", () => restartGame());

nameTextInput.addEventListener("input", (event) => {
  playerName = event.target.value;
});

submmitButton.addEventListener("click", () => {
  if (nameTextInput.value !== "") {
    saveLocalData(playerName, score);
    updateLeaderboard();
    restartGame();
  }
});

updateLeaderboard();
