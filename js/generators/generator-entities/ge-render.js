// js/generators/generator-entities/ge-render.js

import {
    getCategoriesData,
    getCharacteristicsData,
    getOptionsData,
    getCategoryById,
    getCharacteristicById
} from './ge-data.js';

/**
 * Рендерить таблицю категорій
 */
export function renderCategories(tbody, data = null) {
    const categories = data || getCategoriesData();

    if (categories.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="empty-state">
                    <span class="material-symbols-outlined">inbox</span>
                    <p>Немає категорій</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = categories.map(cat => `
        <tr data-entity-id="${cat.id}">
            <td>${cat.id}</td>
            <td>${cat.name}</td>
            <td class="actions-cell">
                <button class="btn-icon btn-edit" data-action="edit" data-entity-type="category" data-entity-id="${cat.id}">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="btn-icon btn-delete" data-action="delete" data-entity-type="category" data-entity-id="${cat.id}">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Рендерить таблицю характеристик
 */
export function renderCharacteristics(tbody, data = null) {
    const characteristics = data || getCharacteristicsData();

    if (characteristics.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <span class="material-symbols-outlined">inbox</span>
                    <p>Немає характеристик</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = characteristics.map(char => {
        const category = getCategoryById(char.categoryId);
        const categoryName = category ? category.name : char.categoryId;

        return `
            <tr data-entity-id="${char.id}">
                <td>${char.id}</td>
                <td>${char.name}</td>
                <td>${categoryName}</td>
                <td class="actions-cell">
                    <button class="btn-icon btn-edit" data-action="edit" data-entity-type="characteristic" data-entity-id="${char.id}">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon btn-delete" data-action="delete" data-entity-type="characteristic" data-entity-id="${char.id}">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Рендерить таблицю опцій
 */
export function renderOptions(tbody, data = null) {
    const options = data || getOptionsData();

    if (options.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    <span class="material-symbols-outlined">inbox</span>
                    <p>Немає опцій</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = options.map(opt => {
        const characteristic = getCharacteristicById(opt.characteristicId);
        const charName = characteristic ? characteristic.name : opt.characteristicId;

        return `
            <tr data-entity-id="${opt.id}">
                <td>${opt.id}</td>
                <td>${opt.name}</td>
                <td>${charName}</td>
                <td class="actions-cell">
                    <button class="btn-icon btn-edit" data-action="edit" data-entity-type="option" data-entity-id="${opt.id}">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="btn-icon btn-delete" data-action="delete" data-entity-type="option" data-entity-id="${opt.id}">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}
