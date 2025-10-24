/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                   TABLE GENERATOR - ГОЛОВНИЙ ФАЙЛ (MAIN)                 ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * * ПРИЗНАЧЕННЯ:
 * Точка входу для всього модуля генератора таблиць. Його єдине завдання —
 * імпортувати необхідні компоненти та запустити процес ініціалізації.
 * Цей файл підключається до основного скрипту додатка.
 */

import { getTableDOM } from './gt-dom.js';
import { setupEventListeners } from './gt-event-handler.js';
import { initializeFirstRow } from './gt-row-manager.js';
import { loadSession, autoSaveSession } from './gt-session-manager.js';
import { initHotkeys } from './gt-hotkeys.js';
import { SORTABLE_CONFIG } from './gt-config.js';

export async function initTableGenerator() {
    const dom = getTableDOM();
    if (!dom.rowsContainer) {
        console.warn('Table Generator: Контейнер не знайдено.');
        return;
    }

    setupEventListeners();
    initHotkeys();

    const sessionLoaded = await loadSession();
    if (!sessionLoaded) {
        initializeFirstRow();
    }

    if (typeof Sortable !== 'undefined') {
        new Sortable(dom.rowsContainer, {
            ...SORTABLE_CONFIG,
            onEnd: function () {
                // Зберігаємо новий порядок рядків після перетягування
                autoSaveSession();
            }
        });
    } else {
        console.warn('Table Generator: Sortable.js не завантажена.');
    }

    console.log('Генератор таблиць успішно ініціалізовано.');
}