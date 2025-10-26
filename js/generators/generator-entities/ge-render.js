// js/generators/generator-entities/ge-render.js

import { getCategoriesData, getCharacteristicsData, getOptionsData } from './ge-data.js';

/**
 * Рендерить категорії в таблицю
 */
export function renderCategories(tbody, data = null) {
    const categories = data || getCategoriesData();
    
    if (categories.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="3">
                    <div class="empty-state-content">
                        <span class="material-symbols-outlined">category</span>
                        <p>Немає категорій</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = categories.map(cat => `
        <tr data-entity-id="${cat.local_id}" data-row-index="${cat._rowIndex}">
            <td><code>${cat.local_id}</code></td>
            <td>${cat.name_uk || cat.name_ru || '—'}</td>
            <td>
                <div class="actions-cell">
                    <button class="btn-icon btn-edit" data-id="${cat.local_id}" title="Редагувати">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon btn-delete" data-id="${cat.local_id}" data-row="${cat._rowIndex}" title="Видалити">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Рендерить характеристики в таблицю
 */
export function renderCharacteristics(tbody, data = null) {
    const characteristics = data || getCharacteristicsData();
    
    if (characteristics.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="4">
                    <div class="empty-state-content">
                        <span class="material-symbols-outlined">tune</span>
                        <p>Немає характеристик</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = characteristics.map(char => `
        <tr data-entity-id="${char.local_id}" data-row-index="${char._rowIndex}">
            <td><code>${char.local_id}</code></td>
            <td>${char.name_uk || char.name_ru || '—'}</td>
            <td><code>${char.category_local_id || '—'}</code></td>
            <td>
                <div class="actions-cell">
                    <button class="btn-icon btn-edit" data-id="${char.local_id}" title="Редагувати">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon btn-delete" data-id="${char.local_id}" data-row="${char._rowIndex}" title="Видалити">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Рендерить опції в таблицю
 */
export function renderOptions(tbody, data = null) {
    const options = data || getOptionsData();
    
    if (options.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="4">
                    <div class="empty-state-content">
                        <span class="material-symbols-outlined">list</span>
                        <p>Немає опцій</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = options.map(opt => `
        <tr data-entity-id="${opt.local_id}" data-row-index="${opt._rowIndex}">
            <td><code>${opt.local_id}</code></td>
            <td>${opt.name_uk || opt.name_ru || '—'}</td>
            <td><code>${opt.char_local_id || '—'}</code></td>
            <td>
                <div class="actions-cell">
                    <button class="btn-icon btn-edit" data-id="${opt.local_id}" title="Редагувати">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon btn-delete" data-id="${opt.local_id}" data-row="${opt._rowIndex}" title="Видалити">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Оновлює лічильник вибраних елементів
 */
export function updateSelectedCount(selectedCountEl) {
    if (!selectedCountEl) return;

    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const count = checkedBoxes.length;

    const strongEl = selectedCountEl.querySelector('strong');
    if (strongEl) {
        strongEl.textContent = count;
    } else {
        selectedCountEl.textContent = count === 0
            ? '0 елементів'
            : `${count} ${getWordEnding(count)}`;
    }
}

/**
 * Допоміжна функція для правильного закінчення слова
 */
function getWordEnding(count) {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return 'елементів';
    }
    
    if (lastDigit === 1) {
        return 'елемент';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
        return 'елементи';
    }
    
    return 'елементів';
}

/**
 * Показує індикатор завантаження
 */
export function showLoadingState(tbody, colspan) {
    tbody.innerHTML = `
        <tr class="loading-row">
            <td colspan="${colspan}">
                <div class="loading-spinner"></div>
                Завантаження...
            </td>
        </tr>
    `;
}
