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
    
]


/* -- State Variables -- */

let livesLost
let word2Guess
let wordProgress
let victory = false


/* -- Cached Element References -- */
const wordBlanksEl = document.querySelector('#letters-to-guess')
const letterGuessInputEl = document.querySelector('#letter-guess')
const letterGuessButtonEl = document.querySelector('#submit-btn2')


/* -- Event Listeners -- */




/* -- Functions -- */

init()

function init() {
    livesLost = 0
    chooseWord()
    word2GuessArray = Array.from(word2Guess)
    wordProgress = word2GuessArray.slice()
    wordProgress.fill(' _ ')

    handleSpaces()
    updateBlanks(wordProgress)
    

    
}

function chooseWord() {
    word2Guess = WORDS_LOOKUP[Math.floor(Math.random() * WORDS_LOOKUP.length)].toLowerCase()
}

function updatePicture(livesLost) {
    document.getElementById('agi-progress').src = './imgs/' + livesLost + '.png'
}

function handleSpaces() {
    handleGuess(' ')
}

function getGuessedLetter() {

}

function handleGuess(guessedLetter) {
    // //verify that only 1 character has been guessed
    // if (guessedLetter.toString().length === 1) {
        guessedLetter = guessedLetter.toString().toLowerCase()
        let guessedIndexes = getAllIndexes(guessedLetter)
        if (guessedIndexes.length >= 1) {
            
            //updates wordProgress to fill in all blanks for guessed letter
            guessedIndexes.forEach((guessedIndex) => wordProgress.splice(guessedIndex, 1, guessedLetter))

            updateBlanks(wordProgress)
        }
        else {
            livesLost++
            updatePicture(livesLost)
        }
    // }
    // else {
    //     return
    // }
}

function updateBlanks(wordSoFar) {
    wordBlanksEl.innerText = wordSoFar.toString().toUpperCase()
}

function getAllIndexes(arr, val) {
    let indexes = [], i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1){
        indexes.push(i);
    }
    return indexes;
}

function checkWin(word2Guess, wordProgress) {
    if (word2Guess.toString().toLowerCase() === wordProgress.toString().toLowerCase()) {
        victory = true
    }
    else {
        victory = false
    }
}