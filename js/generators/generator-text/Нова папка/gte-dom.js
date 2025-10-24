// js/generators/generator-text/gte-dom.js

import { SELECTORS } from './gte-config.js';

/**
 * Знаходить та повертає всі DOM-елементи, що використовуються генератором тексту.
 * Ця функція не використовує кеш, щоб завжди отримувати актуальні елементи
 * з динамічно завантаженого контенту.
 * @returns {object} - Об'єкт з посиланнями на елементи.
 */
export function getTextDOM() {
    const domElements = {};
    // Проходимо по всіх селекторах і знаходимо відповідні елементи в DOM
    for (const key in SELECTORS) {
        // Перетворюємо ключ (напр. BOLD_BTN) в camelCase (напр. boldBtn)
        const camelCaseKey = key.toLowerCase().replace(/_([a-z])/g, g => g[1].toUpperCase());
        domElements[camelCaseKey] = document.querySelector(SELECTORS[key]);
    }
    return domElements;
}