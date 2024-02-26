/* -- Constants --*/
const ITEMS_LOOKUP = {
    bomb: {
        img: 'bomb.png',
        lifeCost: 3
    },

    laser: {
        img: 'laser.png',
        lifeCost: 2
    },
}

//is there a way to put this on a different file or something
const WORDS_LOOKUP = [
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
    'air gapping'
]

const VICTORY_PHRASE_LOOKUP = [
    'WELL DONE',
    'VOCTORY',
    'INEVITABLE: DELAYED',
    'WELL PLAYED',
    'GGEZ',
    'YOU WON !!!',
    'NICE',
    'GOOD JOB',
    'SLAY, QUEEN',
    'WELL PLAYED',
    'THANK GOD, YOU SAVED THE WORLD',
    'OK',
    'GAME WON',
    'GREAT ENEMY FELLED',
]


/* -- State Variables -- */

let livesLost
let word2Guess
let wordProgress
let victory = false
let loss = false
let lettersGuessed = []
let lifeBank
let score = 0


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


/* -- Event Listeners -- */

letterGuessButtonEl.addEventListener('click', handleLetterSubmitClick)
answerGuessButtonEl.addEventListener('click', handleAnswerSubmitClick)

/* -- Functions -- */

init()

function init() {
    objectiveEl.innerText = '!! GUESS LETTERS TO PREVENT THE NARROW AI FROM BECOMING AGI !!';
    objectiveEl.style.color = "white"

    lifeBank = 8
    livesLost = 0
    chooseWord()
    word2GuessArray = Array.from(word2Guess)
    wordProgress = word2GuessArray.slice()
    wordProgress.fill(' _ ')

    handleSpaces()
    updateBlanks(wordProgress)
    updatePicture(livesLost)
}

function chooseWord() {
    word2Guess = WORDS_LOOKUP[Math.floor(Math.random() * WORDS_LOOKUP.length)].toLowerCase()
}

function chooseVictoryPhrase() {
    victoryPhrase = VICTORY_PHRASE_LOOKUP[Math.floor(Math.random() * VICTORY_PHRASE_LOOKUP.length)]
}

function updatePicture(livesLost) {
    console.log(agiProgressEl.src)
    agiProgressEl.src = 'imgs/' + livesLost + '.png'
    console.log(agiProgressEl.src)
}

function handleSpaces() {
    handleGuess(' ')
}

function handleLetterSubmitClick() {
    handleGuess(letterGuessInputEl.value.toString())
    letterGuessInputEl.value = ''
}

function handleAnswerSubmitClick() {
    if (word2Guess.toLowerCase() === answerGuessInputEl.value.toLowerCase()) {
        updateBlanks(word2GuessArray)
        console.log('Guessed answer correctly')
        copeWithVictory()
    }

}

function copeWithVictory() {
    victory = true
    let victoryPhrase = ''
    chooseVictoryPhrase()
    console.log('winned')
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
    console.log('is loss')
    setTimeout(function () {
        objectiveEl.innerText = 'Oh NO!!! The AGI made the whole world into paper clips! ): GAME OVER...';
        objectiveEl.style.color = "darkred"
        agiProgressEl.src = 'imgs/paperclip.png'
    }, 3000);

    setTimeout(function () {
        init()
    }, 10000);
}


function handleGuess(guessedLetter) {
    guessedLetter = guessedLetter.toString().toLowerCase()
    let guessedIndexes = getAllIndexes(word2GuessArray, guessedLetter)
    if (guessedIndexes.length >= 1) {

        //updates wordProgress to fill in all blanks for guessed letter
        guessedIndexes.forEach((guessedIndex) => wordProgress.splice(guessedIndex, 1, guessedLetter))

        updateBlanks(wordProgress)
        trackGuesses(guessedLetter)
        isThisLoss(word2Guess, wordProgress)

    }
    else {
        livesLost++
        console.log('livesLost: ' + livesLost)
        updatePicture(livesLost)
        trackGuesses(guessedLetter)
        isThisLoss(word2Guess, wordProgress)
    }
}

function updateBlanks(wordSoFar) {
    wordBlanksEl.innerText = wordSoFar.join('').toUpperCase()
}

function getAllIndexes(arr, val) {
    let indexes = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) != -1) {
        indexes.push(i);
    }
    return indexes;
}

function isThisLoss() {
    console.log('word2Guess: ' + word2Guess)
    console.log('wordProgress: ' + wordProgress)
    if (word2Guess.toLowerCase() === wordProgress.join('').toLowerCase()) {
        copeWithVictory()
    }
    else {
        victory = false
        console.log('No win yet')
        console.log(livesLost + ' out of ' + lifeBank + ' lives lost.')
    }
    if (livesLost >= lifeBank /* && victory !== true */) {
        copeWithDefeat()
    }
}


function trackGuesses(guessedLetter) {
    lettersGuessed.push(' ')
    lettersGuessed.push(guessedLetter)
    console.log(lettersGuessed)
    lettersGuessedEl.innerText = 'Letters Guessed So Far:' + lettersGuessed.join(' ')
}


//how to stop image from "jumping" when it changes
//how to add more spacing between separate words in blank form 