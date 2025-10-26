// js/generators/generator-text/gte-results.js

import { getTextDOM } from './gte-dom.js';
import { copyToClipboard, showCopiedFeedback } from './gte-utils.js';
import { generateTextHtml, generateTextBr, generateTextClean, generateTextKeepTags } from './gte-builder.js';

function activateResultCard(cardElement, generatorFunction) {
    if (!cardElement) return;

    cardElement.addEventListener('click', async (e) => {
        if (e.target.closest('[data-dropdown-trigger]')) return;

        const dom = getTextDOM();
        const textToProcess = dom.inputMarkup.value;
        const result = generatorFunction(textToProcess);
        
        await copyToClipboard(result);
        showCopiedFeedback(cardElement);
    });
}

/**
 * Обробляє modal-opened event для preview
 */
function handleModalOpened(event) {
    const { modalId, trigger } = event.detail;
    
    // Перевіряємо чи це preview-modal
    if (modalId !== 'preview-modal') return;
    
    // Перевіряємо чи trigger має preview-target
    const previewType = trigger?.dataset?.previewTarget;
    if (!previewType) return;
    
    // Перевіряємо чи це текстовий preview
    if (!['html', 'br', 'clean', 'keep-tags'].includes(previewType)) return;

    const dom = getTextDOM();
    const textToProcess = dom.inputMarkup.value;

    if (!textToProcess || textToProcess.trim() === '') {
        const contentTarget = document.getElementById('preview-content-target');
        if (contentTarget) {
            contentTarget.innerHTML = `<p style="color: var(--text-secondary);">Введіть текст для попереднього перегляду</p>`;
        }
        return;
    }

    setTimeout(() => {
        const contentTarget = document.getElementById('preview-content-target');
        if (!contentTarget) return;

        let generatedContent = '';
        
        switch (previewType) {
            case 'html':
                generatedContent = generateTextHtml(textToProcess);
                break;
            case 'br':
                generatedContent = generateTextBr(textToProcess);
                break;
            case 'clean':
                generatedContent = generateTextClean(textToProcess);
                break;
            case 'keep-tags':
                generatedContent = generateTextKeepTags(textToProcess);
                break;
        }

        contentTarget.innerHTML = `
            ${generatedContent}
        `;
    }, 50);
}

export function initResultCards() {
    const dom = getTextDOM();
    
    activateResultCard(dom.resultCardHtml,       generateTextHtml);
    activateResultCard(dom.resultCardBr,         generateTextBr);
    activateResultCard(dom.resultCardClean,      generateTextClean);
    activateResultCard(dom.resultCardCleanTags,  generateTextKeepTags);

    // Слухаємо modal-opened event
    document.addEventListener('modal-opened', handleModalOpened);
}
