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

searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const requestedWord = wordInput.value.trim();

    if (!requestedWord) {
        updateStatus("Please type a word before searching.");
        return;
    }

    loadWord(requestedWord);
});

randomWordButton?.addEventListener("click", () => {
    const randomWord = DEFAULT_WORDS[Math.floor(Math.random() * DEFAULT_WORDS.length)];
    wordInput.value = randomWord;
    loadWord(randomWord);
});

saveWordButton?.addEventListener("click", () => {
    if (!currentCard) {
        updateStatus("Search for a word first so we can save it.");
        return;
    }

    const learnedWords = readLearnedWords();
    const alreadySaved = learnedWords.some((entry) => entry.word.toLowerCase() === currentCard.word.toLowerCase());

    if (alreadySaved) {
        updateStatus(`${currentCard.word} is already in your learned list.`);
        return;
    }

    learnedWords.push(currentCard);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(learnedWords));
    updateStatus(`${currentCard.word} was saved as learned.`);
});

async function loadWord(word) {
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

function renderCard(card) {
    wordTitle.textContent = capitalizeWord(card.word);
    wordDefinition.textContent = card.definition;
    wordExample.textContent = card.example;
    wordPartOfSpeech.textContent = card.partOfSpeech;

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

function renderLoadingState(word) {
    wordTitle.textContent = capitalizeWord(word);
    wordDefinition.textContent = "Fetching definition from the dictionary API.";
    wordExample.textContent = "Fetching example sentence.";
    wordPartOfSpeech.textContent = "Loading...";
    wordAudio.textContent = "Checking audio...";
    wordAudio.href = "#";
}

function renderErrorState(word) {
    wordTitle.textContent = capitalizeWord(word);
    wordDefinition.textContent = "This word could not be loaded from the dictionary.";
    wordExample.textContent = "Try a different search term or verify the spelling.";
    wordPartOfSpeech.textContent = "Unknown";
    wordAudio.textContent = "Audio not available";
    wordAudio.href = "#";
}

function updateStatus(message) {
    statusMessage.textContent = message;
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

loadWord(DEFAULT_WORDS[0]);
