// js/generators/generator-text/gte-stats.js

let charCountEl, wordCountEl, readingTimeEl, inputEl; // Зробимо inputEl доступним для обох функцій

function updateStats() {
    const text = inputEl.value; // Беремо актуальний текст
    const charCount = text.length;
    const words = text.match(/\S+/g) || []; // Використовуємо виправлене правило
    const wordCount = words.length;
    const readingTime = wordCount > 0 ? Math.ceil(wordCount / 200) : 0;

    charCountEl.textContent = charCount;
    wordCountEl.textContent = wordCount;
    readingTimeEl.textContent = readingTime;
}

// Ця функція буде викликатись з інших файлів
export function forceStatsUpdate() {
    updateStats();
}

export function initStats() {
    inputEl = document.getElementById('input-text-markup'); // Зберігаємо елемент
    charCountEl = document.getElementById('gte-char-count');
    wordCountEl = document.getElementById('gte-word-count');
    readingTimeEl = document.getElementById('gte-reading-time');

    if (!inputEl || !charCountEl) return;

    // Оновлення при ручному вводі
    inputEl.addEventListener('input', updateStats); 
    
    // Початкове оновлення
    updateStats();
}