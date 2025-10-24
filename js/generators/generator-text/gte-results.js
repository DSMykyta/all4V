// js/generators/generator-text/gte-results.js

import { getTextDOM } from './gte-dom.js';
import { copyToClipboard, showCopiedFeedback } from './gte-utils.js';
import { generateTextHtml, generateTextBr, generateTextClean, generateTextKeepTags } from './gte-builder.js';

// Функція, яка прив'язує дію до картки
function activateResultCard(cardElement, generatorFunction) {
    if (!cardElement) return;

    cardElement.addEventListener('click', async (e) => {
        // Ігноруємо клік по меню "..."
        if (e.target.closest('[data-dropdown-trigger]')) return;

        const dom = getTextDOM();
        const textToProcess = dom.inputMarkup.value; // Беремо текст з поля вводу
        const result = generatorFunction(textToProcess); // Віддаємо його "двигуну"
        
        await copyToClipboard(result);
        showCopiedFeedback(cardElement);
    });
}

// Функція, яка "включає" всі картки
export function initResultCards() {
    const dom = getTextDOM();
    
    activateResultCard(dom.resultCardHtml,       generateTextHtml);
    activateResultCard(dom.resultCardBr,         generateTextBr);
    activateResultCard(dom.resultCardClean,      generateTextClean);
    activateResultCard(dom.resultCardCleanTags,  generateTextKeepTags);
}