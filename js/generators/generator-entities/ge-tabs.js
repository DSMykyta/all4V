// js/generators/generator-entities/ge-tabs.js

import { dom } from './ge-dom.js';

/**
 * Перемикає вкладки
 */
export function switchTab(tabName) {
    // Оновлюємо класи на кнопках вкладок
    dom.tabs.forEach(tab => {
        if (tab.dataset.tab === tabName) {
            tab.classList.add('is-active');
        } else {
            tab.classList.remove('is-active');
        }
    });

    // Оновлюємо класи на панелях вкладок
    dom.tabPanes.forEach(pane => {
        if (pane.dataset.tabPane === tabName) {
            pane.classList.add('is-active');
        } else {
            pane.classList.remove('is-active');
        }
    });
}

/**
 * Ініціалізує обробники кліків на вкладках
 */
export function initTabs() {
    dom.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
}
