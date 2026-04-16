const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const STORAGE_KEY = "lingoflip-practice-state";
const LEARNED_WORDS_KEY = "lingoflip-learned-words";
const WORD_POOL = [
    "adapt", "admire", "balance", "calm", "capture", "cheerful", "clarify", "connect",
    "consider", "creative", "debate", "delight", "eager", "efficient", "encourage", "explore",
    "flexible", "focus", "gather", "generous", "graceful", "honest", "imagine", "improve",
    "inspire", "journey", "kindness", "listen", "measure", "notice", "observe", "organize",
    "patient", "practice", "prepare", "reflect", "relief", "respect", "restore", "support",
    "thrive", "translate", "understand", "unique", "value", "welcome", "wonder", "achieve"
];

const practiceWord = document.querySelector("#practice-word");
const practiceStatus = document.querySelector("#practice-status");
const revealButton = document.querySelector("#reveal-answer");
const nextButton = document.querySelector("#next-word");
const correctButton = document.querySelector("#mark-correct");
const reviewButton = document.querySelector("#mark-review");
const answerPanel = document.querySelector("#practice-answer");
const definitionOutput = document.querySelector("#practice-definition");
const exampleOutput = document.querySelector("#practice-example");
const partOfSpeechOutput = document.querySelector("#practice-part-of-speech");
const audioOutput = document.querySelector("#practice-audio");
const currentCount = document.querySelector("#current-count");
const correctCount = document.querySelector("#correct-count");
const remainingCount = document.querySelector("#remaining-count");
const historyList = document.querySelector("#practice-history");

let practiceQueue = [];
let currentCard = null;
let stats = {
    seen: 0,
    correct: 0,
    history: []
};

initializePractice();

async function initializePractice() {
    restoreStats();
    refillQueue();
    updateScoreboard();
    renderHistory();
    await loadNextPracticeWord();
}

function restoreStats() {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
        return;
    }

    try {
        const parsedState = JSON.parse(savedState);
        stats = {
            seen: parsedState.seen ?? 0,
            correct: parsedState.correct ?? 0,
            history: Array.isArray(parsedState.history) ? parsedState.history : []
        };
    } catch (error) {
        stats = { seen: 0, correct: 0, history: [] };
    }
}

function saveStats() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

function buildWordPool() {
    const learnedWords = readLearnedWords().map((entry) => entry.word.toLowerCase());
    const uniqueWords = new Set([...WORD_POOL, ...learnedWords]);
    return Array.from(uniqueWords);
}

function refillQueue() {
    const sourceWords = buildWordPool();
    practiceQueue = shuffleWords(sourceWords);
}

function shuffleWords(words) {
    const shuffled = [...words];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }

    return shuffled;
}

async function loadNextPracticeWord() {
    answerPanel.hidden = true;
    setStatus("Finding a fresh word for practice...");

    while (practiceQueue.length > 0) {
        const nextWord = practiceQueue.pop();
        renderLoading(nextWord);

        try {
            const response = await fetch(`${API_URL}${encodeURIComponent(nextWord)}`);

            if (!response.ok) {
                continue;
            }

            const data = await response.json();
            currentCard = normalizeEntry(data[0]);
            renderCard(currentCard);
            updateScoreboard();
            setStatus(`Practice word ready: ${currentCard.word}.`);
            return;
        } catch (error) {
            continue;
        }
    }

    refillQueue();
    setStatus("You completed the full word set. Starting a new mixed round.");
    await loadNextPracticeWord();
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

function renderLoading(word) {
    practiceWord.textContent = capitalizeWord(word);
}

function renderCard(card) {
    practiceWord.textContent = capitalizeWord(card.word);
    definitionOutput.textContent = card.definition;
    exampleOutput.textContent = card.example;
    partOfSpeechOutput.textContent = card.partOfSpeech;

    if (card.audio) {
        audioOutput.textContent = "Open pronunciation audio";
        audioOutput.href = card.audio;
    } else {
        audioOutput.textContent = "Audio not available";
        audioOutput.href = "#";
    }
}

function revealAnswer() {
    if (!currentCard) {
        return;
    }

    answerPanel.hidden = false;
    setStatus(`Answer revealed for ${currentCard.word}. Mark how it went.`);
}

function recordResult(result) {
    if (!currentCard) {
        return;
    }

    stats.seen += 1;

    if (result === "correct") {
        stats.correct += 1;
    }

    stats.history.unshift({
        word: currentCard.word,
        result
    });

    stats.history = stats.history.slice(0, 6);
    saveStats();
    updateScoreboard();
    renderHistory();
    loadNextPracticeWord();
}

function updateScoreboard() {
    currentCount.textContent = stats.seen;
    correctCount.textContent = stats.correct;
    remainingCount.textContent = practiceQueue.length;
}

function renderHistory() {
    historyList.innerHTML = "";

    if (stats.history.length === 0) {
        const emptyItem = document.createElement("li");
        emptyItem.innerHTML = "<span class=\"history-word\">No practice yet</span><span class=\"history-result\">Your latest answers will appear here.</span>";
        historyList.appendChild(emptyItem);
        return;
    }

    stats.history.forEach((entry) => {
        const item = document.createElement("li");
        const resultLabel = entry.result === "correct" ? "You knew it" : "Review again";
        item.innerHTML = `<span class="history-word">${capitalizeWord(entry.word)}</span><span class="history-result">${resultLabel}</span>`;
        historyList.appendChild(item);
    });
}

function setStatus(message) {
    practiceStatus.textContent = message;
}

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

function capitalizeWord(word) {
    if (!word) {
        return "";
    }

    return word.charAt(0).toUpperCase() + word.slice(1);
}

revealButton?.addEventListener("click", revealAnswer);
nextButton?.addEventListener("click", loadNextPracticeWord);
correctButton?.addEventListener("click", () => recordResult("correct"));
reviewButton?.addEventListener("click", () => recordResult("review"));
