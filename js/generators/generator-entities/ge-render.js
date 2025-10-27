// js/generators/generator-entities/ge-render.js

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                   РЕНДЕРИНГ ТАБЛИЦЬ СУТНОСТЕЙ                            ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * Відповідає за:
 * - Відображення даних в таблицях
 * - Стани: завантаження, порожньо, помилка, дані
 * - Фільтрацію та сортування
 */

import { getCategoriesData, getCharacteristicsData, getOptionsData } from './ge-data.js';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * РЕНДЕРИНГ КАТЕГОРІЙ
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function renderCategories(tbody, filteredData = null) {
    const categories = filteredData || getCategoriesData();
    
    if (!tbody) {
        console.error('❌ tbody для категорій не знайдено');
        return;
    }

    // Якщо немає даних
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

    // Рендеримо дані
    tbody.innerHTML = categories.map(cat => `
        <tr data-entity-id="${cat.local_id}" data-row-index="${cat._rowIndex}">
            <td>
                <input type="checkbox" class="row-checkbox" data-id="${cat.local_id}" aria-label="Вибрати">
            </td>
            <td><code>${escapeHtml(cat.local_id)}</code></td>
            <td>${cat.parent_local_id ? `<code>${escapeHtml(cat.parent_local_id)}</code>` : '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td>${escapeHtml(cat.name_uk) || '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td>${escapeHtml(cat.name_ru) || '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td>${escapeHtml(cat.category_type) || '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-edit" data-action="edit" data-id="${cat.local_id}" title="Редагувати">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon btn-delete" data-action="delete" data-id="${cat.local_id}" data-row="${cat._rowIndex}" title="Видалити">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    console.log(`✅ Відображено ${categories.length} категорій`);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * РЕНДЕРИНГ ХАРАКТЕРИСТИК
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function renderCharacteristics(tbody, filteredData = null) {
    const characteristics = filteredData || getCharacteristicsData();
    
    if (!tbody) {
        console.error('❌ tbody для характеристик не знайдено');
        return;
    }

    // Якщо немає даних
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

    // Рендеримо дані
    tbody.innerHTML = characteristics.map(char => `
        <tr data-entity-id="${char.local_id}" data-row-index="${char._rowIndex}">
            <td>
                <input type="checkbox" class="row-checkbox" data-id="${char.local_id}" aria-label="Вибрати">
            </td>
            <td><code>${escapeHtml(char.local_id)}</code></td>
            <td>${escapeHtml(char.name_uk) || '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td>${escapeHtml(char.name_ru) || '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td>${escapeHtml(char.param_type) || '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td>${escapeHtml(char.unit) || '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td>${escapeHtml(char.filter_type) || '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td style="text-align: center;">
                ${char.is_global === 'true' || char.is_global === true 
                    ? '<span style="color: var(--success, green); font-size: 18px;">✓</span>' 
                    : '<span style="color: var(--text-disabled, gray);">—</span>'}
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-edit" data-action="edit" data-id="${char.local_id}" title="Редагувати">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon btn-delete" data-action="delete" data-id="${char.local_id}" data-row="${char._rowIndex}" title="Видалити">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    console.log(`✅ Відображено ${characteristics.length} характеристик`);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * РЕНДЕРИНГ ОПЦІЙ
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function renderOptions(tbody, filteredData = null) {
    const options = filteredData || getOptionsData();
    
    if (!tbody) {
        console.error('❌ tbody для опцій не знайдено');
        return;
    }

    // Якщо немає даних
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

    // Рендеримо дані
    tbody.innerHTML = options.map(opt => `
        <tr data-entity-id="${opt.local_id}" data-row-index="${opt._rowIndex}">
            <td>
                <input type="checkbox" class="row-checkbox" data-id="${opt.local_id}" aria-label="Вибрати">
            </td>
            <td><code>${escapeHtml(opt.local_id)}</code></td>
            <td><code>${escapeHtml(opt.char_local_id) || '<em style="color: var(--text-disabled);">—</em>'}</code></td>
            <td>${escapeHtml(opt.name_uk) || '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td>${escapeHtml(opt.name_ru) || '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-edit" data-action="edit" data-id="${opt.local_id}" title="Редагувати">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon btn-delete" data-action="delete" data-id="${opt.local_id}" data-row="${opt._rowIndex}" title="Видалити">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    console.log(`✅ Відображено ${options.length} опцій`);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * СТАНИ ЗАВАНТАЖЕННЯ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Показує індикатор завантаження
 */
export function showLoadingState(tbody, colspan = 7) {
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr class="loading-row">
            <td colspan="${colspan}" style="text-align: center; padding: 40px;">
                <div class="loading-spinner"></div>
                <span style="margin-left: 8px;">Завантаження...</span>
            </td>
        </tr>
    `;
}

/**
 * Показує стан помилки
 */
export function showErrorState(tbody, errorMessage = 'Помилка завантаження даних', colspan = 7) {
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr class="error-state">
            <td colspan="${colspan}" style="text-align: center; padding: 40px; color: var(--error, red);">
                <span class="material-symbols-outlined" style="font-size: 48px; display: block; margin-bottom: 12px;">error</span>
                <strong>${errorMessage}</strong>
                <p style="color: var(--text-secondary); margin-top: 8px;">Спробуйте оновити дані або авторизуватися знову</p>
            </td>
        </tr>
    `;
}

/**
 * Показує стан "не авторизовано"
 */
export function showAuthRequiredState(tbody, colspan = 7) {
    if (!tbody) return;
    
    tbody.innerHTML = `
        <tr class="auth-required-state">
            <td colspan="${colspan}" style="text-align: center; padding: 60px 20px;">
                <span class="material-symbols-outlined" style="font-size: 64px; display: block; margin-bottom: 16px; color: var(--text-disabled);">lock</span>
                <h3 style="margin: 0 0 8px 0; font-size: 18px;">Авторизація необхідна</h3>
                <p style="color: var(--text-secondary); margin: 0 0 20px 0;">Увійдіть через Google, щоб отримати доступ до даних</p>
                <button onclick="document.getElementById('auth-btn').click()" class="btn-primary">
                    <span class="material-symbols-outlined">login</span>
                    Авторизуватися
                </button>
            </td>
        </tr>
    `;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ДОПОМІЖНІ ФУНКЦІЇ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Екранує HTML для безпеки (запобігає XSS)
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Оновлює лічильник вибраних елементів
 */
export function updateSelectedCount() {
    const selectedCountEl = document.getElementById('selected-count');
    if (!selectedCountEl) return;

    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const count = checkedBoxes.length;
    
    selectedCountEl.textContent = count === 0 
        ? 'Нічого не вибрано' 
        : `Вибрано: ${count} ${getWordEnding(count)}`;
}

/**
 * Допоміжна функція для правильного закінчення слова (елемент/елементи/елементів)
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
 * Перемальовує всі таблиці
 */
export function renderAllTables() {
    const categoriesTbody = document.getElementById('categories-tbody');
    const characteristicsTbody = document.getElementById('characteristics-tbody');
    const optionsTbody = document.getElementById('options-tbody');

    renderCategories(categoriesTbody);
    renderCharacteristics(characteristicsTbody);
    renderOptions(optionsTbody);

    console.log('✅ Всі таблиці перемальовано');
}
