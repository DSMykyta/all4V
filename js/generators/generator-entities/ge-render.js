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
                <td colspan="7">
                    <div class="empty-state">
                        <span class="material-symbols-outlined">category</span>
                        <h3>Немає категорій</h3>
                        <p>Додайте першу категорію, щоб почати</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = categories.map(cat => `
        <tr data-entity-id="${cat.local_id}" data-row-index="${cat._rowIndex}">
            <td>
                <input type="checkbox" class="row-checkbox" data-id="${cat.local_id}">
            </td>
            <td><code>${cat.local_id}</code></td>
            <td>${cat.parent_local_id || '<em>—</em>'}</td>
            <td>${cat.name_uk || ''}</td>
            <td>${cat.name_ru || ''}</td>
            <td>${cat.category_type || ''}</td>
            <td>
                <div class="table-actions">
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
                <td colspan="9">
                    <div class="empty-state">
                        <span class="material-symbols-outlined">tune</span>
                        <h3>Немає характеристик</h3>
                        <p>Додайте першу характеристику, щоб почати</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = characteristics.map(char => `
        <tr data-entity-id="${char.local_id}" data-row-index="${char._rowIndex}">
            <td>
                <input type="checkbox" class="row-checkbox" data-id="${char.local_id}">
            </td>
            <td><code>${char.local_id}</code></td>
            <td>${char.name_uk || ''}</td>
            <td>${char.name_ru || ''}</td>
            <td>${char.param_type || ''}</td>
            <td>${char.unit || '—'}</td>
            <td>${char.filter_type || ''}</td>
            <td>
                ${char.is_global === 'true' || char.is_global === true 
                    ? '<span style="color: green;">✓</span>' 
                    : '<span style="color: gray;">—</span>'}
            </td>
            <td>
                <div class="table-actions">
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
                <td colspan="6">
                    <div class="empty-state">
                        <span class="material-symbols-outlined">list</span>
                        <h3>Немає опцій</h3>
                        <p>Додайте першу опцію, щоб почати</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = options.map(opt => `
        <tr data-entity-id="${opt.local_id}" data-row-index="${opt._rowIndex}">
            <td>
                <input type="checkbox" class="row-checkbox" data-id="${opt.local_id}">
            </td>
            <td><code>${opt.local_id}</code></td>
            <td><code>${opt.char_local_id || ''}</code></td>
            <td>${opt.name_uk || ''}</td>
            <td>${opt.name_ru || ''}</td>
            <td>
                <div class="table-actions">
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
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const count = checkedBoxes.length;
    
    selectedCountEl.textContent = count === 0 
        ? '0 елементів' 
        : `${count} ${getWordEnding(count)}`;
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
