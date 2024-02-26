/* -- Constants --*/
const LIVES_LOOKUP = {
    0: {img: 'imgs/0.png'},
    1: {img: 'imgs/1.png'},
    2: {img: 'imgs/2.png'},
    3: {img: 'imgs/3.png'},
    4: {img: 'imgs/4.png'},
    5: {img: 'imgs/5.png'},
    6: {img: 'imgs/6.png'},
    7: {img: 'imgs/7.png'},
    8: {img: 'imgs/8.png'}
}

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
    'hello world'
]


/* -- State Variables -- */

let livesLost
let word2Guess
let wordProgress
let victory = false
let loss = false
let lettersGuessed = []
let lifeBank


/* -- Cached Element References -- */
const wordBlanksEl = document.querySelector('#letters-to-guess')
const letterGuessInputEl = document.querySelector('#letter-guess')
const letterGuessButtonEl = document.querySelector('#submit-btn2')
const agiProgressEl = document.querySelector('#agi-progress > img')
const lettersGuessedEl = document.querySelector('letters-already-guessed')
const objectiveEl = document.querySelector('#objective')


/* -- Event Listeners -- */

letterGuessButtonEl.addEventListener('click', handleLetterSubmitClick)


/* -- Functions -- */

init()

function init() {
    lifebank = 2
    livesLost = 0
    chooseWord()
    word2GuessArray = Array.from(word2Guess)
    wordProgress = word2GuessArray.slice()
    wordProgress.fill(' _ ')

    handleSpaces()
    // handleGuess(',')
    updateBlanks(wordProgress)
    

    
}

function chooseWord() {
    word2Guess = WORDS_LOOKUP[Math.floor(Math.random() * WORDS_LOOKUP.length)].toLowerCase()
}

function updatePicture(livesLost) {
    console.log(agiProgressEl.src)
    agiProgressEl.src = 'imgs/' + livesLost + '.png'
    console.log(livesLost)
    console.log(agiProgressEl.src)
}

function handleSpaces() {
    handleGuess(' ')
}

function handleLetterSubmitClick() {
    handleGuess(letterGuessInputEl.value.toString())
    letterGuessInputEl.value = ''
}

function handleGuess(guessedLetter) {
    // //verify that only 1 character has been guessed
    // if (guessedLetter.toString().length === 1) {
        guessedLetter = guessedLetter.toString().toLowerCase()
        let guessedIndexes = getAllIndexes(word2GuessArray, guessedLetter)
        if (guessedIndexes.length >= 1) {
            
            //updates wordProgress to fill in all blanks for guessed letter
            guessedIndexes.forEach((guessedIndex) => wordProgress.splice(guessedIndex, 1, guessedLetter))

            updateBlanks(wordProgress)
            isThisLoss(word2Guess, wordProgress)
        }
        else {
            livesLost++
            updatePicture(livesLost)
            isThisLoss(word2Guess, wordProgress)
        }
    // }
    // else {
    //     return
    // }
    
}

function updateBlanks(wordSoFar) {
    wordBlanksEl.innerText = wordSoFar.join('').toUpperCase()
}

function getAllIndexes(arr, val) {
    let indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

function isThisLoss(word2Guess, wordProgress) {
    if (word2Guess.toString().toLowerCase() === wordProgress.toString().toLowerCase()) {
        victory = true
    }
    else {
        victory = false
    }
    if (livesLost >= lifeBank /* && victory !== true */) {
        loss = true
        setTimeout(function() {
            objectiveEl.innerText = 'Oh NO!!! The AGI made the whole world into paper clips! ): GAME OVER';
            agiProgressEl.src = 'paperclip.png'
          }, 3000);
    }
}