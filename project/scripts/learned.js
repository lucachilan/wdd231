const STARTER_WORDS_URL = "./data/starter-words.json";
const LEARNED_WORDS_KEY = "lingoflip-learned-words";

const totalWords = document.querySelector("#total-words");
const learnedWordsCount = document.querySelector("#learned-words");
const starterWordsCount = document.querySelector("#starter-words");
const boardMessage = document.querySelector("#board-message");
const wordGrid = document.querySelector("#word-grid");

const detailDialog = document.querySelector("#word-detail-dialog");
const dialogTitle = document.querySelector("#dialog-word");
const dialogDefinition = document.querySelector("#dialog-definition");
const dialogExample = document.querySelector("#dialog-example");
const dialogPartOfSpeech = document.querySelector("#dialog-part-of-speech");
const dialogAudio = document.querySelector("#dialog-audio");
const closeDialogButton = document.querySelector("#close-dialog");
const closeDialogFooterButton = document.querySelector("#close-dialog-footer");

let wordCollection = [];

initializeLearnedPage();

// initializes everythin, checking if the api is working
async function initializeLearnedPage() {
    const savedWords = readLearnedWords();
    const starterWords = await readStarterWords();
    wordCollection = mergeWords(savedWords, starterWords);
    renderStats(savedWords.length, starterWords.length, wordCollection.length);
    renderWordGrid(wordCollection);
}

async function readStarterWords() {
    try {
        const response = await fetch(STARTER_WORDS_URL);

        if (!response.ok) {
            throw new Error("Starter words not available");
        }

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        boardMessage.textContent = "Starter words could not be loaded, so only your saved words are showing.";
        return [];
    }
}

// checks the learned words from local storage
function readLearnedWords() {
    const savedWords = localStorage.getItem(LEARNED_WORDS_KEY);

    if (!savedWords) {
        return [];
    }

    try {
        const parsedWords = JSON.parse(savedWords);
        return Array.isArray(parsedWords) ? parsedWords : [];
    } catch (error) {
        return [];
    }
}

// there's just one list, so it creates it
function mergeWords(savedWords, starterWords) {
    const wordMap = new Map();

    savedWords.forEach((entry) => {
        wordMap.set(entry.word.toLowerCase(), {
            ...entry,
            source: "Learned"
        });
    });

    starterWords.forEach((entry) => {
        const key = entry.word.toLowerCase();

        if (!wordMap.has(key)) {
            wordMap.set(key, {
                ...entry,
                source: "Starter set"
            });
        }
    });

    return Array.from(wordMap.values());
}

function renderStats(savedCount, starterCount, totalCount) {
    totalWords.textContent = totalCount;
    learnedWordsCount.textContent = savedCount;
    starterWordsCount.textContent = starterCount;

    if (savedCount > 0) {
        boardMessage.textContent = "Your saved words are mixed with the starter collection below.";
        return;
    }

    boardMessage.textContent = "You have not saved words yet, so this page is showing the starter collection for review.";
}

function renderWordGrid(words) {
    wordGrid.innerHTML = "";

    if (words.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No words are available right now.";
        wordGrid.appendChild(emptyMessage);
        return;
    }

    words.forEach((word) => {
        const card = document.createElement("article");
        card.className = "word-card";
        card.innerHTML = `
            <div>
                <p class="word-card__label">Word</p>
                <h3>${capitalizeWord(word.word)}</h3>
            </div>
            <div class="word-meta">
                <span class="meta-pill">${word.partOfSpeech}</span>
                <span class="meta-pill">${word.source}</span>
            </div>
            <div>
                <p class="word-card__label">Definition</p>
                <p>${word.definition}</p>
            </div>
            <div>
                <p class="word-card__label">Example</p>
                <p>${word.example}</p>
            </div>
            <div class="word-card__actions">
                <button type="button" class="word-button primary" data-word="${word.word.toLowerCase()}">View details</button>
                ${word.audio ? `<a class="word-button secondary" href="${word.audio}" target="_blank" rel="noopener noreferrer">Open audio</a>` : ""}
            </div>
        `;
        wordGrid.appendChild(card);
    });
}

function openWordDetails(wordKey) {
    const selectedWord = wordCollection.find((entry) => entry.word.toLowerCase() === wordKey);

    if (!selectedWord) {
        return;
    }

    dialogTitle.textContent = capitalizeWord(selectedWord.word);
    dialogDefinition.textContent = selectedWord.definition;
    dialogExample.textContent = selectedWord.example;
    dialogPartOfSpeech.textContent = selectedWord.partOfSpeech;

    if (selectedWord.audio) {
        dialogAudio.textContent = "Open pronunciation audio";
        dialogAudio.href = selectedWord.audio;
    } else {
        dialogAudio.textContent = "Audio not available";
        dialogAudio.href = "#";
    }

    detailDialog.showModal();
}

function capitalizeWord(word) {
    if (!word) {
        return "";
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
}

wordGrid?.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-word]");

    if (!trigger) {
        return;
    }

    openWordDetails(trigger.dataset.word);
});

closeDialogButton?.addEventListener("click", () => {
    detailDialog.close();
});

closeDialogFooterButton?.addEventListener("click", () => {
    detailDialog.close();
});

detailDialog?.addEventListener("click", (event) => {
    const dialogRect = detailDialog.getBoundingClientRect();
    const isInDialog = (
        dialogRect.top <= event.clientY &&
        event.clientY <= dialogRect.top + dialogRect.height &&
        dialogRect.left <= event.clientX &&
        event.clientX <= dialogRect.left + dialogRect.width
    );

    if (!isInDialog) {
        detailDialog.close();
    }
});
