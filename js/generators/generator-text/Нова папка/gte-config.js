// js/generators/generator-text/gte-config.js

/**
 * Конфігурація для генератора тексту.
 * Зберігає всі CSS-селектори для швидкого доступу та легкої зміни.
 */
export const SELECTORS = {
    // Головне поле вводу
    INPUT_MARKUP: '#input-text-markup',

    // Кнопки форматування
    BOLD_BTN: '#boldBtn',
    H1_BTN: '#h1Btn',
    H2_BTN: '#h2Btn',
    H3_BTN: '#h3Btn',
    LOWERCASE_BTN: '#lowercaseBtn',

    // Картки результатів
    RESULT_CARD_HTML: '#result-card-text-html',
    RESULT_CARD_BR: '#result-card-text-br',
    RESULT_CARD_CLEAN: '#result-card-text-clean',
    RESULT_CARD_CLEAN_TAGS: '#result-card-text-clean-tags',
    
    // Пошук та заміна
    FIND_INPUT: '#gte-find-input',
    REPLACE_INPUT: '#gte-replace-input',
    REPLACE_ALL_BTN: '#gte-replace-all-btn',
};