// js/entities/entities-init.js
// Головний ініціалізатор для системи управління сутностями

import { initCustomSelects } from '../common/ui-select.js';
import { initPagination } from '../common/ui-pagination.js';
import { initColumnVisibility } from '../common/ui-columns.js';
import { initGoogleAuth } from '../auth/google-auth.js';
import { loadAllEntitiesData } from './entities-data.js';
import { renderTable } from './entities-render.js';
import { initEntityEvents } from './entities-events.js';

// Глобальний state для entities
export const entitiesState = {
    categories: [],
    characteristics: [],
    options: [],
    marketplaces: [],
    currentTab: 'categories',
    selectedIds: new Set(),
    pagination: {
        categories: { currentPage: 1, pageSize: 25, totalItems: 0 },
        characteristics: { currentPage: 1, pageSize: 25, totalItems: 0 },
        options: { currentPage: 1, pageSize: 25, totalItems: 0 }
    },
    paginationInstances: {} // Зберігаємо інстанси пагінації для кожного табу
};

export function initEntities() {
    console.log('📋 Ініціалізація Entities...');

    // 1. Завантажити aside-entities.html в праву панель
    loadAsideEntities();

    // 2. Ініціалізувати UI компоненти
    initCustomSelects();
    initColumnVisibility(
        document.querySelector('#columns-visibility-container'),
        document.querySelector('.entity-content'),
        {
            storageKey: 'entities-column-visibility',
            onColumnToggle: (columnName, isVisible) => {
                console.log(`Column ${columnName}: ${isVisible ? 'shown' : 'hidden'}`);
            }
        }
    );

    // 3. Ініціалізувати пагінацію для футера
    const footer = document.querySelector('.entity-footer');
    if (footer) {
        const paginationInstance = initPagination(footer, {
            currentPage: 1,
            pageSize: 25,
            totalItems: 0,
            onPageChange: (page, pageSize) => {
                const currentTab = entitiesState.currentTab;
                entitiesState.pagination[currentTab].currentPage = page;
                entitiesState.pagination[currentTab].pageSize = pageSize;
                renderTable(currentTab);
            }
        });
        entitiesState.paginationInstances[entitiesState.currentTab] = paginationInstance;
    }

    // 4. Ініціалізувати обробники подій (таби, кнопки, тощо)
    initEntityEvents();

    // 5. Ініціалізувати Google Auth з callback для завантаження даних
    initGoogleAuth(() => {
        console.log('✅ Google Auth готова, завантажуємо дані...');
        loadAllEntitiesData().then(() => {
            console.log('✅ Дані завантажені');
            // Відобразити початковий таб (categories)
            renderTable('categories');
        }).catch(error => {
            console.error('❌ Помилка завантаження даних:', error);
        });
    });
}

function loadAsideEntities() {
    const panelRightContent = document.getElementById('panel-right-content');
    if (!panelRightContent) return;

    fetch('templates/aside/aside-entities.html')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load aside-entities.html');
            return response.text();
        })
        .then(html => {
            panelRightContent.innerHTML = html;
            console.log('✅ aside-entities.html завантажено');

            // Ініціалізувати базові чекбокси колонок після завантаження aside
            setupColumnCheckboxes('categories');

            // Ініціалізувати пошук
            setupSearch();
        })
        .catch(error => {
            console.error('❌ Помилка завантаження aside-entities.html:', error);
        });
}

function setupColumnCheckboxes(entityType) {
    const columnsBase = document.getElementById('columns-base');
    if (!columnsBase) return;

    // Визначити базові колонки для кожного типу сутності
    const columnConfigs = {
        categories: [
            { name: 'local_id', label: 'ID', checked: true },
            { name: 'parent_name', label: 'Батьківська', checked: true },
            { name: 'name_uk', label: 'Назва UA', checked: true },
            { name: 'name_ru', label: 'Назва RU', checked: false },
            { name: 'category_type', label: 'Тип', checked: true }
        ],
        characteristics: [
            { name: 'local_id', label: 'ID', checked: true },
            { name: 'name_uk', label: 'Назва UA', checked: true },
            { name: 'category_names', label: 'Категорії', checked: true },
            { name: 'param_type', label: 'Тип параметра', checked: true },
            { name: 'is_global', label: 'Глобальна', checked: true }
        ],
        options: [
            { name: 'local_id', label: 'ID', checked: true },
            { name: 'char_name', label: 'Характеристика', checked: true },
            { name: 'name_uk', label: 'Назва UA', checked: true },
            { name: 'name_ru', label: 'Назва RU', checked: false }
        ]
    };

    const columns = columnConfigs[entityType] || columnConfigs.categories;

    // Очистити попередні чекбокси
    columnsBase.innerHTML = '';

    // Створити чекбокси
    columns.forEach(column => {
        const label = document.createElement('label');
        label.className = 'column-toggle-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = column.checked;
        checkbox.dataset.column = column.name;

        const span = document.createElement('span');
        span.textContent = column.label;

        label.appendChild(checkbox);
        label.appendChild(span);
        columnsBase.appendChild(label);
    });
}

function setupSearch() {
    const searchInput = document.getElementById('entity-search-input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        filterTableByQuery(query);
    });
}

function filterTableByQuery(query) {
    const currentTab = entitiesState.currentTab;
    const tableBody = document.querySelector(`#${currentTab} .pseudo-table-body`);
    if (!tableBody) return;

    const rows = tableBody.querySelectorAll('.pseudo-table-row');
    let visibleCount = 0;

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const matches = query === '' || text.includes(query);
        row.style.display = matches ? '' : 'none';
        if (matches) visibleCount++;
    });

    // Оновити статистику
    updateStats(visibleCount);
}

function updateStats(visibleCount = null) {
    const currentTab = entitiesState.currentTab;
    const totalItems = entitiesState[currentTab]?.length || 0;
    const selectedCount = entitiesState.selectedIds.size;

    const statsTotal = document.getElementById('stats-total');
    const statsSelected = document.getElementById('stats-selected');

    if (statsTotal) {
        statsTotal.textContent = `Всього: ${visibleCount !== null ? visibleCount : totalItems}`;
    }
    if (statsSelected) {
        statsSelected.textContent = `Вибрано: ${selectedCount}`;
    }
}

// Експортуємо функції для використання в інших модулях
export { setupColumnCheckboxes, updateStats };
