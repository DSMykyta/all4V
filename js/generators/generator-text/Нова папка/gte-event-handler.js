// js/generators/generator-text/gte-event-handler.js

import { getTextDOM } from './gte-dom.js';
import { copyToClipboard, showCopiedFeedback } from './gte-utils.js';
import { wrapSelectionWithTag, selectionToLowercase, findAndReplaceAll } from './gte-actions.js';
import * as builder from './gte-builder.js';
import { initStats } from './gte-stats.js';

let isTextSectionInitialized = false;

function initializeTextSectionOnce() {
    if (isTextSectionInitialized) return;
    initStats();
    isTextSectionInitialized = true;
}

/**
 * Надійно чекає на появу видимого модального вікна та повертає його.
 * @returns {Promise<Element|null>}
 */
function waitForVisibleModal() {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            const modalWrapper = document.querySelector('#global-modal-wrapper.is-open');
            if (modalWrapper) {
                clearInterval(interval);
                resolve(modalWrapper);
            }
        }, 50);
        // Таймаут на випадок, якщо вікно так і не з'явиться
        setTimeout(() => { clearInterval(interval); resolve(null); }, 2000);
    });
}

/**
 * Обробляє клік по кнопці візуалізації.
 * @param {HTMLElement} trigger - Кнопка, що викликала подію.
 * @param {object} dom - Об'єкт з DOM-елементами.
 */
async function handlePreview(trigger, dom) {
    const previewType = trigger.dataset.previewTarget;
    if (!previewType || !dom.inputMarkup) return;

    const builders = {
        'html': builder.generateTextHtml,
        'br': builder.generateTextBr,
        'keep-tags': builder.generateTextKeepTags,
        'clean': builder.generateTextClean
    };

    const generator = builders[previewType];
    if (!generator) return;

    // Чекаємо, доки модальне вікно гарантовано відкриється
    const modalWrapper = await waitForVisibleModal();
    if (modalWrapper) {
        const contentTarget = modalWrapper.querySelector('#preview-content-target');
        if (contentTarget) {
            const generatedContent = generator(dom.inputMarkup.value);
            contentTarget.innerHTML = generatedContent || '<p>Нічого для відображення.</p>';
        } else {
            console.error('Не знайдено #preview-content-target всередині модального вікна.');
        }
    } else {
        console.error('Модальне вікно не відкрилося вчасно.');
    }
}

export function setupEventListeners() {
    const rightPanel = document.getElementById('panel-right');
    if (!rightPanel) return;

    rightPanel.addEventListener('click', async (event) => {
        const dom = getTextDOM();
        if (!dom.inputMarkup) return;

        initializeTextSectionOnce();

        // Обробка тригеру візуалізації
        const trigger = event.target.closest('[data-modal-trigger="preview-modal"]');
        if (trigger) {
            // Ця функція тепер надійно чекає на відкриття вікна
            handlePreview(trigger, dom);
            // Подію не зупиняємо, щоб ui-modal.js міг її обробити і відкрити вікно
        }

        const target = event.target.closest('[id]');
        if (!target) return;

        // Обробка кнопок форматування
        const formattingActions = {
            'boldBtn': () => wrapSelectionWithTag('strong', dom.inputMarkup),
            'h1Btn': () => wrapSelectionWithTag('h1', dom.inputMarkup),
            'h2Btn': () => wrapSelectionWithTag('h2', dom.inputMarkup),
            'h3Btn': () => wrapSelectionWithTag('h3', dom.inputMarkup),
            'lowercaseBtn': () => selectionToLowercase(dom.inputMarkup),
            'gte-replace-all-btn': () => findAndReplaceAll(dom.inputMarkup, dom.findInput, dom.replaceInput)
        };
        if (formattingActions[target.id]) {
            formattingActions[target.id]();
            return;
        }

        // Обробка карток результатів
        const cardActions = {
            'result-card-text-html': builder.generateTextHtml,
            'result-card-text-br': builder.generateTextBr,
            'result-card-text-clean': builder.generateTextClean,
            'result-card-text-clean-tags': builder.generateTextKeepTags
        };
        if (cardActions[target.id]) {
            if (event.target.closest('[data-dropdown-trigger]')) return;
            const generatedContent = cardActions[target.id](dom.inputMarkup.value);
            await copyToClipboard(generatedContent);
            showCopiedFeedback(target);
        }
    });
}