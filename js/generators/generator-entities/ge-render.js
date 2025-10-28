// js/generators/generator-entities/ge-render.js

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                   РЕНДЕРИНГ ТАБЛИЦЬ СУТНОСТЕЙ                            ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { 
    getCategoriesData, 
    getCharacteristicsData, 
    getOptionsData, 
    getMarketplacesData 
} from './ge-data.js';

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
 * РЕНДЕРИНГ МАРКЕТПЛЕЙСІВ
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function renderMarketplaces(tbody, filteredData = null) {
    const marketplaces = filteredData || getMarketplacesData();
    
    if (!tbody) {
        console.error('❌ tbody для маркетплейсів не знайдено');
        return;
    }

    if (marketplaces.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="6">
                    <div class="empty-state">
                        <span class="material-symbols-outlined">store</span>
                        <h3>Немає маркетплейсів</h3>
                        <p>Додайте перший маркетплейс, щоб почати</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = marketplaces.map(mp => `
        <tr data-entity-id="${mp.marketplace_id}" data-row-index="${mp._rowIndex}">
            <td>
                <input type="checkbox" class="row-checkbox" data-id="${mp.marketplace_id}" aria-label="Вибрати">
            </td>
            <td><code>${escapeHtml(mp.marketplace_id)}</code></td>
            <td>${escapeHtml(mp.display_name) || '<em style="color: var(--text-disabled);">—</em>'}</td>
            <td style="text-align: center;">
                ${mp.icon_svg 
                    ? `<div style="width: 24px; height: 24px; display: inline-block;">${mp.icon_svg}</div>` 
                    : '<em style="color: var(--text-disabled);">—</em>'}
            </td>
            <td>
                ${mp.primary_color 
                    ? `<div style="display: flex; align-items: center; gap: 8px;">
                        <div style="width: 20px; height: 20px; background: ${escapeHtml(mp.primary_color)}; border-radius: 4px; border: 1px solid var(--border-color);"></div>
                        <code>${escapeHtml(mp.primary_color)}</code>
                       </div>` 
                    : '<em style="color: var(--text-disabled);">—</em>'}
            </td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon btn-edit" data-action="edit" data-id="${mp.marketplace_id}" title="Редагувати">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon btn-delete" data-action="delete" data-id="${mp.marketplace_id}" data-row="${mp._rowIndex}" title="Видалити">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    console.log(`✅ Відображено ${marketplaces.length} маркетплейсів`);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * СТАНИ ЗАВАНТАЖЕННЯ
 * ═══════════════════════════════════════════════════════════════════════════
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

export function updateSelectedCount() {
    const selectedCountEl = document.getElementById('selected-count');
    if (!selectedCountEl) return;

    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    const count = checkedBoxes.length;
    
    selectedCountEl.textContent = count === 0 
        ? 'Нічого не вибрано' 
        : `Вибрано: ${count} ${getWordEnding(count)}`;
}

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
    // 🔴 ВИДАЛЕНО: const marketplacesTbody = document.getElementById('marketplaces-tbody');

    renderCategories(categoriesTbody);
    renderCharacteristics(characteristicsTbody);
    renderOptions(optionsTbody);
    // 🔴 ВИДАЛЕНО: renderMarketplaces(marketplacesTbody);

    console.log('✅ Всі таблиці перемальовано');
}