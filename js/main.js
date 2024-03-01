/* -- Constants --*/
const WORDS_LOOKUP = [
    'i have no mouth and i must scream',
    'allied mastercomputer',
    'artificial intelligence',
    'large language model',
    'chat gpt',
    'generative pre-trained transformer',
    'linear regression',
    'prompt engineer',
    'autonomous',
    'hallucination',
    'neural network',
    'chatbot',
    'deep learning',
    'arms race',
    'autonomous',
    'computer vision',
    'computational learning theory',
    'natural language',
    'Eliezer Yudkowsky',
    'Sam Altman',
    'pattern recognition',
    'deepfakes',
    'election',
    'dead internet theory',
    'predictive',
    'super intelligence',
    'facial recognition',
    'autonomous weapon systems',
    'hello world',
    'air gapping',
    'llama',
    'machine learning',
    'nvidia',
    'artificial super intelligence',
    'theory of mind',
    'self aware',
    'artificial general intelligence',
    'narrow artificial intelligence',
    'generative ai',
    'open source',
    'open ai',
    'hugging face',
    'baby agi',
    'growth',
    'moore',
    'dall e',
    'midjourney',
    'stable diffusion',
    'adobe firefly',
    'sora',
    'data',
    'compute',
    'meta',
    'adobe',
    'google',
    'progress',
    'ukraine',
    'bystander effect',
    'social media',
    'revenue',
    'nsa',
    'nasa',
    'artists',
    'drivers',
    'developers',
    'legislators',
]

const VICTORY_PHRASE_LOOKUP = [
    'WELL DONE',
    'VICTORY',
    'INEVITABLE: DELAYED',
    'WELL PLAYED',
    'GGEZ',
    'YOU WON !!!',
    'NICE',
    'GOOD JOB',
    'WELL PLAYED',
    'THANK GOD, YOU SAVED THE WORLD',
    'OK',
    'GAME WON',
    'GREAT ENEMY FELLED',
    'HUMANITY RESTORED',
]

const QWERTY_LOOKUP = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',]


/* -- State Variables -- */

let livesLost
let word2Guess
let wordProgress
let victory = false
let loss = false
let lettersGuessed = []
let lifeBank
let score = 0
let victoryPhrase = ''
let word2GuessArray = []
let bombActive = false
let laserActive = false
let immortal = false

/* -- Cached Element References -- */
const wordBlanksEl = document.querySelector('#letters-to-guess')
const letterGuessInputEl = document.querySelector('#letter-guess')
const letterGuessButtonEl = document.querySelector('#submit-btn2')
const answerGuessInputEl = document.querySelector('#fanswer')
const answerGuessButtonEl = document.querySelector('#submit-btn1')
const agiProgressEl = document.querySelector('#agi-progress > img')
const scoreCounterEl = document.querySelector('#agi-progress > aside')
const lettersGuessedEl = document.querySelector('#letters-already-guessed')
const objectiveEl = document.querySelector('#objective')
const bombIconEl = document.querySelector('#bomb-icon')


/* -- Event Listeners -- */

letterGuessButtonEl.addEventListener('click', handleLetterSubmitClick)
answerGuessButtonEl.addEventListener('click', handleAnswerSubmitClick)
bombIconEl.addEventListener('click', handleBombClick)

/* -- Functions -- */

init()

function init() {
    objectiveEl.innerText = '!! GUESS LETTERS TO PREVENT THE NARROW AI FROM BECOMING AGI !!';
    objectiveEl.style.color = "white"

    lifeBank = 8
    livesLost = 0
    bombActive = false
    chooseWord()
    word2GuessArray = Array.from(word2Guess)
    wordProgress = word2GuessArray.slice()
    wordProgress.fill('_')

    handleSpaces()
    updateBlanks(wordProgress)
    updatePicture(livesLost)
}

function chooseWord() {
    word2Guess = WORDS_LOOKUP[Math.floor(Math.random() * WORDS_LOOKUP.length)].toLowerCase()
    console.log('Answer: ' + word2Guess)
}

function chooseVictoryPhrase() {
    victoryPhrase = VICTORY_PHRASE_LOOKUP[Math.floor(Math.random() * VICTORY_PHRASE_LOOKUP.length)]
}

function updatePicture(livesLost) {
    agiProgressEl.src = 'imgs/' + livesLost + '.png'
}

function handleSpaces() {
    handleGuess(' ')
}

function handleLetterSubmitClick() {
    handleGuess(letterGuessInputEl.value.toString().toLowerCase())
    letterGuessInputEl.value = ''
}

function handleAnswerSubmitClick() {
    if (word2Guess.toLowerCase() === answerGuessInputEl.value.toLowerCase()) {
        updateBlanks(word2GuessArray)
        copeWithVictory()
    }
    else {
        updateBlanks(["WRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONGWRONG"])
        copeWithDefeat()
    }
}

function copeWithVictory() {
    victory = true
    chooseVictoryPhrase()
    score++
    scoreCounterEl.innerText = 'Score: ' + score
    answerGuessInputEl.value = ''
    objectiveEl.style.color = "greenyellow"
    objectiveEl.innerText = `${victoryPhrase}`;
    agiProgressEl.src = 'imgs/victory.png'

    lettersGuessed = ['']
    setTimeout(function () {
        init()
    }, 4500);
}

function copeWithDefeat() {
    loss = true
    objectiveEl.innerText = 'Oh NO!!! The AGI made the whole world into paper clips! ): GAME OVER...';
    objectiveEl.style.color = "darkred"
    lettersGuessed = ['']
    answerGuessInputEl.value = ''
    setTimeout(function () {
        agiProgressEl.src = 'imgs/paperclip.png'
    }, 3000);

    setTimeout(function () {
        score = 0
        init()
    }, 10000);
}


function handleGuess(guessedLetter) {
    if (bombActive === true) {
        bombActive = false
        immortal = true
        useBomb(guessedLetter)
        immortal = false
    }
    let guessedIndexes = getAllIndexes(word2GuessArray, guessedLetter)
    if (guessedLetter === ' ') {
        guessedIndexes.forEach((guessedIndex) => wordProgress.splice(guessedIndex, 1, '  '))

        updateBlanks(wordProgress)
        trackGuesses(guessedLetter)
        isThisLoss(word2Guess, wordProgress)
        return
    }
    guessedLetter = guessedLetter.toString().toLowerCase()

    if (guessedIndexes.length >= 1) {

        //updates wordProgress to fill in all blanks for guessed letter
        guessedIndexes.forEach((guessedIndex) => wordProgress.splice(guessedIndex, 1, guessedLetter))

        updateBlanks(wordProgress)
        trackGuesses(guessedLetter)
        isThisLoss(word2Guess, wordProgress)

    }
    else {
        if (immortal === true) { }
        else {
            livesLost++
            updatePicture(livesLost)
            trackGuesses(guessedLetter)
            isThisLoss(word2Guess, wordProgress)
        }
    }
}

function updateBlanks(wordSoFar) {
    wordBlanksEl.textContent = wordSoFar.join('').toUpperCase()
}

function getAllIndexes(arr, val) {
    let indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}

function isThisLoss() {
    if (getAllIndexes(wordProgress, '  ').length > 0) {
        //Fixes bug caused by adding more than one space to the displayed array with blanks
        //which caused the solution and the players correct answer to differ when spaces are
        //involved and answer is reached letter-by-letter. This changes the answer array back
        //to using a single space for comparison.
        let spacesIndexes = getAllIndexes(wordProgress, '  ')
        spacesIndexes.forEach((spacesIndex) => wordProgress.splice(spacesIndex, 1, ' '))
    }
    if (word2Guess.toLowerCase() === wordProgress.join('').toLowerCase()) {
        copeWithVictory()
    }
    else {
        victory = false
    }
    if (livesLost >= lifeBank /* && victory !== true */) {
        copeWithDefeat()
    }
}

function trackGuesses(guessedLetter) {
    lettersGuessed.push(' ')
    lettersGuessed.push(guessedLetter)
    lettersGuessedEl.innerText = 'Letters Guessed So Far:' + lettersGuessed.join('  ')
}

function useBomb(bombedLetter) {
    let bombedIdx = QWERTY_LOOKUP.indexOf(bombedLetter)
    //Find indexes of letters around bombed letter by subtracting or adding to that index and guess the values at those indexes.
    handleGuess(bombedLetter)
    //If statements protect bombing letter Q
    if ((bombedIdx - 10) >= 0) { handleGuess(QWERTY_LOOKUP[bombedIdx - 10]) }
    if ((bombedIdx - 9) >= 0) { handleGuess(QWERTY_LOOKUP[bombedIdx - 9]) }
    if ((bombedIdx - 1) >= 0) { handleGuess(QWERTY_LOOKUP[bombedIdx - 1]) }

    if ((bombedIdx + 1) <= QWERTY_LOOKUP.length - 1) { handleGuess(QWERTY_LOOKUP[bombedIdx + 1]) }
    if ((bombedIdx + 9) <= QWERTY_LOOKUP.length - 1) { handleGuess(QWERTY_LOOKUP[bombedIdx + 9]) }
    if ((bombedIdx + 10) <= QWERTY_LOOKUP.length - 1) { handleGuess(QWERTY_LOOKUP[bombedIdx + 10]) }

    livesLost += 2
    bombIconEl.style.backgroundColor = 'grey'
    updatePicture(livesLost)
    trackGuesses(bombedLetter)
    trackGuesses(QWERTY_LOOKUP[bombedIdx - 10])
    trackGuesses(QWERTY_LOOKUP[bombedIdx - 9])
    trackGuesses(QWERTY_LOOKUP[bombedIdx + 1])
    trackGuesses(QWERTY_LOOKUP[bombedIdx - 1])
    trackGuesses(QWERTY_LOOKUP[bombedIdx + 9])
    trackGuesses(QWERTY_LOOKUP[bombedIdx + 10])
    isThisLoss(word2Guess, wordProgress)
}

function handleBombClick() {
    bombActive = true
    bombIconEl.style.backgroundColor = 'orange'
}