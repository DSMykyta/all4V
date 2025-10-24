// js/generators/generator-text/gte-dom.js

// Цей об'єкт буде зберігати всі наші HTML-елементи, щоб не шукати їх по 100 разів.
let domCache = null;

export function getTextDOM() {
    // Якщо ми вже один раз все знайшли, просто повертаємо готовий результат.
    if (domCache) {
        return domCache;
    }

    // Знаходимо всі елементи ОДИН раз і зберігаємо їх.
    domCache = {
        // Головне поле вводу
        inputMarkup: document.getElementById('input-text-markup'),

        // Кнопки форматування
        boldBtn: document.getElementById('boldBtn'),
        h1Btn: document.getElementById('h1Btn'),
        h2Btn: document.getElementById('h2Btn'),
        h3Btn: document.getElementById('h3Btn'),
        lowercaseBtn: document.getElementById('lowercaseBtn'),

        // Картки результатів
        resultCardHtml: document.getElementById('result-card-text-html'),
        resultCardBr: document.getElementById('result-card-text-br'),
        resultCardClean: document.getElementById('result-card-text-clean'),
        resultCardCleanTags: document.getElementById('result-card-text-clean-tags'),
        
        // Пошук та заміна
        findInput: document.getElementById('gte-find-input'),
        replaceInput: document.getElementById('gte-replace-input'),
        replaceAllBtn: document.getElementById('gte-replace-all-btn'),
    };

    return domCache;
}