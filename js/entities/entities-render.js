// js/entities/entities-render.js
// Рендеринг таблиць для сутностей

import { getEnrichedData } from './entities-data.js';
import { entitiesState, updateStats } from './entities-init.js';

/**
 * Відрендерити таблицю для вказаного типу сутності
 */
export function renderTable(entityType) {
    console.log(`🎨 Рендеримо таблицю: ${entityType}`);

    const data = getEnrichedData(entityType);
    if (!data) {
        console.warn(`Немає даних для ${entityType}`);
        return;
    }

    // Оновити state
    entitiesState[entityType] = data;
    entitiesState.currentTab = entityType;

    // Отримати pagination state
    const pagination = entitiesState.pagination[entityType];
    const { currentPage, pageSize } = pagination;

    // Застосувати пагінацію
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    // Оновити totalItems в pagination
    pagination.totalItems = data.length;
    const paginationInstance = entitiesState.paginationInstances[entityType];
    if (paginationInstance) {
        paginationInstance.updateTotalItems(data.length);
    }

    // Рендерити рядки
    const tableBody = document.querySelector(`#${entityType} .pseudo-table-body`);
    if (!tableBody) {
        console.error(`Таблиця для ${entityType} не знайдена`);
        return;
    }

    tableBody.innerHTML = '';

    paginatedData.forEach((item, index) => {
        const row = createTableRow(entityType, item, startIndex + index);
        tableBody.appendChild(row);
    });

    // Оновити статистику
    updateStats();

    console.log(`✅ Таблиця ${entityType} відрендерена (${paginatedData.length} рядків)`);
}

/**
 * Створити HTML рядок таблиці
 */
function createTableRow(entityType, item, globalIndex) {
    const row = document.createElement('div');
    row.className = 'pseudo-table-row';
    row.dataset.entityType = entityType;
    row.dataset.index = globalIndex;

    // Отримати local_id або brand_id
    const itemId = item.local_id || item.brand_id;
    row.dataset.id = itemId;

    // Checkbox
    const checkboxCell = createCell('cell-actions');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'row-checkbox';
    checkbox.dataset.id = itemId;
    checkboxCell.appendChild(checkbox);
    row.appendChild(checkboxCell);

    // Колонки залежно від типу сутності
    switch (entityType) {
        case 'categories':
            row.appendChild(createCell('cell-id', item.local_id));
            row.appendChild(createCell('', item.parent_name, 'parent_name'));
            row.appendChild(createCell('cell-main-name', item.name_uk, 'name_uk'));
            row.appendChild(createCell('', item.name_ru, 'name_ru'));
            row.appendChild(createCell('', item.category_type, 'category_type'));
            break;

        case 'characteristics':
            row.appendChild(createCell('cell-id', item.local_id));
            row.appendChild(createCell('cell-main-name', item.name_uk, 'name_uk'));
            row.appendChild(createCell('', item.category_names, 'category_names'));
            row.appendChild(createCell('', item.param_type, 'param_type'));
            row.appendChild(createCell('', item.is_global ? 'Так' : 'Ні', 'is_global'));
            break;

        case 'options':
            row.appendChild(createCell('cell-id', item.local_id));
            row.appendChild(createCell('', item.char_name, 'char_name'));
            row.appendChild(createCell('cell-main-name', item.name_uk, 'name_uk'));
            row.appendChild(createCell('', item.name_ru, 'name_ru'));
            break;
    }

    // TODO: Додати динамічні колонки маркетплейсів

    return row;
}

/**
 * Створити комірку таблиці
 */
function createCell(className, content, columnName = '') {
    const cell = document.createElement('div');
    cell.className = `pseudo-table-cell ${className}`.trim();
    if (columnName) {
        cell.dataset.column = columnName;
    }
    cell.innerHTML = content || '—';
    return cell;
}

/**
 * Оновити відображення після зміни даних
 */
export function refreshCurrentTable() {
    renderTable(entitiesState.currentTab);
}
