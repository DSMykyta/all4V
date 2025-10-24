// js/generators/generator-table/gt-event-handler.js

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║          TABLE GENERATOR - ОБРОБНИК ПОДІЙ (EVENT HANDLER)                ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * * ПРИЗНАЧЕННЯ:
 * Центральний модуль для налаштування всіх глобальних слухачів подій,
 * включаючи логіку для модального вікна підтвердження очищення.
 */

import { getTableDOM } from './gt-dom.js';
import { createAndAppendRow, initializeEmptyRow, resetTableSection } from './gt-row-manager.js';
import { handleInputTypeSwitch } from './gt-row-renderer.js';
import { getNutritionFacts, getVitamins, getAminoAcids } from './gt-data-provider.js';
import { calculatePercentages, checkForEmptyNutritionFacts } from './gt-calculator.js';
import { generateHtmlTable } from './gt-html-builder.js';
import { generateBrText } from './gt-br-builder.js';
import { processAndFillInputs } from './gt-magic-parser.js';
import { copyToClipboard, debounce } from './gt-utils.js';
import { autoSaveSession } from './gt-session-manager.js';

export function setupEventListeners() {
    const dom = getTableDOM();
    if (!dom.rowsContainer) return;

    // === ОНОВЛЕННЯ: Логіка кнопки "Оновити" ===
    if (dom.reloadBtn) {
        // Тепер кнопка не очищує таблицю, а лише отримує атрибут для виклику модалу.
        dom.reloadBtn.dataset.modalTrigger = 'confirm-clear-modal';
    }
    // ===========================================

    const rightPanel = document.getElementById('panel-right');
    if (rightPanel) {
        rightPanel.addEventListener('click', (event) => {
            const target = event.target.closest('[id]');
            if (!target) return;
            const actions = {
                'add-input-btn': () => createAndAppendRow(),
                'add-empty-line-btn': () => initializeEmptyRow(),
                'add-ingredients-btn': () => addSampleTemplate('ingredients'),
                'add-warning-btn': () => addSampleTemplate('warning'),
                'add-composition-btn': () => addSampleTemplate('composition'),
                'add-nutrition-btn': () => addSampleList(getNutritionFacts()),
                'add-vitamins-btn': () => addSampleList(getVitamins()),
                'add-aminos-btn': () => addSampleList(getAminoAcids()),
                'result-card-html': (e) => {
                    if (!e.target.closest('[data-dropdown-trigger]')) {
                        if (checkForEmptyNutritionFacts()) return;
                        copyToClipboard(generateHtmlTable(), target);
                    }
                },
                'result-card-br': (e) => {
                    if (!e.target.closest('[data-dropdown-trigger]')) {
                        if (checkForEmptyNutritionFacts()) return;
                        copyToClipboard(generateBrText(), target);
                    }
                }
            };
            if (actions[target.id]) actions[target.id](event);
        });
    }

    document.addEventListener('click', (event) => {
        const magicApplyBtn = event.target.closest('#magic-apply-btn');
        if (magicApplyBtn) handleMagicApply();

        const previewTrigger = event.target.closest('[data-modal-trigger="preview-modal"]');
        if (previewTrigger) handlePreview(previewTrigger);

        // === НОВА ЛОГІКА: Підтвердження очищення ===
        const confirmClearBtn = event.target.closest('#confirm-clear-action');
        if (confirmClearBtn) {
            resetTableSection(); // Викликаємо очищення
            document.querySelector('#global-modal-wrapper .modal-close-btn')?.click(); // Закриваємо модал
        }
        // ========================================

        // Додаємо обробник для кнопок "Скасувати"
        const modalCloseBtn = event.target.closest('[data-modal-close]');
        if (modalCloseBtn) {
             document.querySelector('#global-modal-wrapper .modal-close-btn')?.click();
        }
    });
    
    const debouncedCalculateAndSave = debounce(() => {
        calculatePercentages();
        autoSaveSession(); // <-- Додати виклик автозбереження
    }, 300);
    dom.rowsContainer.addEventListener('input', debouncedCalculateAndSave);
}

// --- Допоміжні функції для обробників ---

function handleMagicApply() {
    const magicTextEl = document.getElementById('magic-text');
    if (magicTextEl) {
        processAndFillInputs(magicTextEl.value);
        magicTextEl.value = '';
    }
    document.querySelector('#global-modal-wrapper .modal-close-btn')?.click();
}

/**
 * Обробляє запит на попередній перегляд.
 * @param {HTMLElement} trigger - Кнопка, що викликала подію.
 */
function handlePreview(trigger) {
    const previewType = trigger.dataset.previewTarget;
    if (!previewType) return;

    // Модальне вікно відкриється автоматично завдяки ui-modal.js.
    // Нам потрібно лише зачекати, поки воно з'явиться в DOM, і вставити контент.
    setTimeout(() => {
        const contentTarget = document.getElementById('preview-content-target');
        if (!contentTarget) {
            console.error('Не знайдено цільовий елемент #preview-content-target у модальному вікні.');
            return;
        }

        if (checkForEmptyNutritionFacts(true)) { // silent=true
            contentTarget.innerHTML = `<p style="color: var(--color-error);">Помилка: обов'язкове поле "Пищевая ценность" не заповнено!</p>`;
            return;
        }

        let generatedContent = '';
        if (previewType === 'html') {
            generatedContent = generateHtmlTable();
        } else if (previewType === 'br') {
            generatedContent = generateBrText();
        }

        contentTarget.innerHTML = generatedContent || '<p>Нічого для відображення.</p>';
    }, 100); // Невелика затримка, щоб модальне вікно встигло відрендеритись
}


function addSampleList(items) {
    items.forEach(item => {
        createAndAppendRow().then(row => {
            row.classList.add('added');
            row.querySelector('.input-left').value = item;
        });
    });
}

async function addSampleTemplate(type) {
    await initializeEmptyRow();

    if (type === 'ingredients') {
        const headerRow = await createAndAppendRow();
        headerRow.classList.remove('td');
        headerRow.classList.add('th-strong', 'single');
        headerRow.querySelector('.input-left').value = 'Ингредиенты';
    }

    const fieldRow = await createAndAppendRow();
    handleInputTypeSwitch(fieldRow, 'field');
    fieldRow.classList.remove('td');
    fieldRow.classList.add('single');

    if (type === 'warning' || type === 'composition') {
        fieldRow.classList.add('bold');
    }
    if (type === 'composition') {
        fieldRow.querySelector('.input-left').value = 'Состав может незначительно отличаться в зависимости от вкуса';
    }
}