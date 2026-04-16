const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const DEFAULT_WORDS = ["curious", "journey", "bright", "patient", "discover", "thoughtful"];
const STORAGE_KEY = "lingoflip-learned-words";

const searchForm = document.querySelector("#word-search");
const wordInput = document.querySelector("#word-input");
const randomWordButton = document.querySelector("#random-word");
const saveWordButton = document.querySelector("#save-word");
const statusMessage = document.querySelector("#status-message");

const wordTitle = document.querySelector("#word-title");
const wordDefinition = document.querySelector("#word-definition");
const wordExample = document.querySelector("#word-example");
const wordPartOfSpeech = document.querySelector("#word-part-of-speech");
const wordAudio = document.querySelector("#word-audio");

let currentCard = null;

// calls the api to load the word info
window.loadWord = async function (word) {
    updateStatus(`Looking up "${word}"...`);
    renderLoadingState(word);

    try {
        const response = await fetch(`${API_URL}${encodeURIComponent(word)}`);

        if (!response.ok) {
            throw new Error("Word not found");
        }
        const data = await response.json();
        currentCard = normalizeEntry(data[0]);
        renderCard(currentCard);
        updateStatus(`New card ready for "${currentCard.word}".`);
    } catch (error) {
        currentCard = null;
        renderErrorState(word);
        updateStatus(`We could not find "${word}". Try another word.`);
    }
}

// controls the form so you need to put something and looks for the word, sends it to loadWord
searchForm?.addEventListener("submit", (event) => {
    const requestedWord = wordInput?.value.trim();

    if (!requestedWord) {
        event.preventDefault();
        updateStatus("Please type a word before searching.");
        return;
    }

    if (document.querySelector("#flashcard")) {
        event.preventDefault();
        const url = new URL(window.location);
        url.searchParams.set("word", requestedWord);
        window.history.pushState({}, "", url);
        loadWord(requestedWord);
    }
});

// creates a random word to look up
randomWordButton?.addEventListener("click", () => {
    const randomWord = DEFAULT_WORDS[Math.floor(Math.random() * DEFAULT_WORDS.length)];
    wordInput.value = randomWord;
    loadWord(randomWord);
});

// loads the word to localstorage
saveWordButton?.addEventListener("click", () => {
    if (!currentCard) {
        updateStatus("Search for a word first so we can save it.");
        return;
    }

    const learnedWords = readLearnedWords();
    const alreadySaved = learnedWords.filter((entry) => entry.word.toLowerCase() === currentCard.word.toLowerCase());

    if (alreadySaved) {
        updateStatus(`${currentCard.word} is already in your learned list.`);
        return;
    }

    learnedWords.push(currentCard);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(learnedWords));
    updateStatus(`${currentCard.word} was saved as learned.`);
});

// checks if exists and sends the info to the flashcard
function normalizeEntry(entry) {
    const meanings = entry.meanings ?? [];
    const firstMeaning = meanings[0] ?? {};
    const firstDefinition = firstMeaning.definitions?.[0] ?? {};
    const audioSource = entry.phonetics?.find((item) => item.audio)?.audio || "";

    return {
        word: entry.word ?? "Unknown word",
        definition: firstDefinition.definition ?? "No definition available.",
        example: firstDefinition.example ?? "No example sentence available for this word yet.",
        partOfSpeech: firstMeaning.partOfSpeech ?? "Not specified",
        audio: audioSource
    };
}

// card when the word exist and its found
function renderCard(card) {
    if (wordTitle) wordTitle.textContent = capitalizeWord(card.word);
    if (wordDefinition) wordDefinition.textContent = card.definition;
    if (wordExample) wordExample.textContent = card.example;
    if (wordPartOfSpeech) wordPartOfSpeech.textContent = card.partOfSpeech;

    if (wordAudio) {
        if (card.audio) {
            wordAudio.textContent = "Open pronunciation audio";
            wordAudio.href = card.audio;
            wordAudio.removeAttribute("aria-disabled");
        } else {
            wordAudio.textContent = "Audio not available";
            wordAudio.href = "#";
            wordAudio.setAttribute("aria-disabled", "true");
        }
    }
}

// little time card for when it's loading, so it doesn't show broken
function renderLoadingState(word) {
    if (wordTitle) wordTitle.textContent = capitalizeWord(word);
    if (wordDefinition) wordDefinition.textContent = "Fetching definition from the dictionary API.";
    if (wordExample) wordExample.textContent = "Fetching example sentence.";
    if (wordPartOfSpeech) wordPartOfSpeech.textContent = "Loading...";
    if (wordAudio) {
        wordAudio.textContent = "Checking audio...";
        wordAudio.href = "#";
    }
}

// if  you cannot find the word in the api, it send you here
function renderErrorState(word) {
    if (wordTitle) wordTitle.textContent = capitalizeWord(word);
    if (wordDefinition) wordDefinition.textContent = "This word could not be loaded from the dictionary.";
    if (wordExample) wordExample.textContent = "Try a different search term or verify the spelling.";
    if (wordPartOfSpeech) wordPartOfSpeech.textContent = "Unknown";
    if (wordAudio) {
        wordAudio.textContent = "Audio not available";
        wordAudio.href = "#";
    }
}

function updateStatus(message) {
    if (statusMessage) {
        statusMessage.textContent = message;
    }
}

function readLearnedWords() {
    const savedWords = localStorage.getItem(STORAGE_KEY);

    if (!savedWords) {
        return [];
    }

    try {
        return JSON.parse(savedWords);
    } catch (error) {
        return [];
    }
}

function capitalizeWord(word) {
    if (!word) {
        return "";
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
}

if (document.querySelector("#flashcard")) {
    const params = new URLSearchParams(window.location.search);
    const urlWord = params.get("word");
    loadWord(urlWord || DEFAULT_WORDS[0]);
}
