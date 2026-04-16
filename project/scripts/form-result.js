const params = new URLSearchParams(window.location.search);
const word = params.get("word");
const input = document.querySelector("#result-word");

if (word && input) {
    input.textContent = word;
}

if (word && window.loadWord) {
    window.loadWord(word);
}