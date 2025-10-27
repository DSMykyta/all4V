// js/generators/generator-entities/ge-tabs.js

import { renderCategories, renderCharacteristics, renderOptions } from './ge-render.js';
import { getEntitiesDOM } from './ge-dom.js';

let currentTab = 'categories';

/**
 * Ініціалізує перемикання табів
 */
export function initTabs() {
    const dom = getEntitiesDOM();

    dom.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            switchTab(tabName);
        });
    });
}

/**
 * Перемикає таб
 */
export function switchTab(tabName) {
    currentTab = tabName;
    
    const dom = getEntitiesDOM();

    // Оновлюємо активний стан кнопок
    dom.tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Оновлюємо активний стан контенту
    dom.tabContents.forEach(content => {
        content.classList.toggle('active', content.dataset.tabContent === tabName);
    });

    // Очищаємо вибрані елементи
    clearAllSelections();

    console.log(`📑 Перемкнуто на таб: ${tabName}`);
}

/**
 * Повертає поточний активний таб
 */
export function getCurrentTab() {
    return currentTab;
}

/**
 * Перерендерює поточний таб
 */
export function refreshCurrentTab() {
    const dom = getEntitiesDOM();

    switch (currentTab) {
        case 'categories':
            renderCategories(dom.categoriesTbody);
            break;
        case 'characteristics':
            renderCharacteristics(dom.characteristicsTbody);
            break;
        case 'options':
            renderOptions(dom.optionsTbody);
            break;
    }
}

/**
 * Очищає всі чекбокси
 */
function clearAllSelections() {
    const checkboxes = document.querySelectorAll('.row-checkbox:checked');
    checkboxes.forEach(cb => cb.checked = false);

    const selectAllCheckboxes = document.querySelectorAll('[id^="select-all-"]');
    selectAllCheckboxes.forEach(cb => cb.checked = false);

    // Оновлюємо кнопку видалення
    const dom = getEntitiesDOM();
    if (dom.btnDeleteSelected) {
        dom.btnDeleteSelected.disabled = true;
    }

    // Оновлюємо лічильник
    if (dom.selectedCount) {
        dom.selectedCount.textContent = '0 елементів';
    }
}
