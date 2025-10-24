// js/generators/generator-text/gte-main.js

import { getTextDOM } from './gte-dom.js';
import { setupEventListeners } from './gte-event-handler.js';
import { initStats } from './gte-stats.js';       // 1. Імпортуємо статистику
import { initHotkeys } from './gte-hotkeys.js'; // 2. Імпортуємо гарячі клавіші


/**
 * Ініціалізує весь функціонал генератора тексту.
 */
export function initTextGenerator() {
    const dom = getTextDOM();
    if (!dom.inputMarkup) {
        return;
    }

    setupEventListeners();
    initStats();
    initHotkeys();

    console.log('Генератор тексту успішно ініціалізовано.');
}