// js/generators/generator-entities/ge-events.js

import { getEntitiesDOM } from './ge-dom.js';
import { fetchAllData, deleteEntityFromSheet } from './ge-data.js';
import { renderCategories, renderCharacteristics, renderOptions, updateSelectedCount, showLoadingState } from './ge-render.js';
import { getCurrentTab, refreshCurrentTab } from './ge-tabs.js';
import { isUserAuthorized, signIn } from './ge-auth.js';

/**
 * Ініціалізує всі обробники подій
 */
export function initEventHandlers() {
    const dom = getEntitiesDOM();

    // Кнопка оновлення даних
    dom.btnRefreshData.addEventListener('click', handleRefreshData);

    // Кнопка додавання нової сутності
    dom.btnAddEntity.addEventListener('click', handleAddEntity);

    // Кнопка видалення вибраних
    dom.btnDeleteSelected.addEventListener('click', handleDeleteSelected);

    // Чекбокси "Вибрати всі"
    if (dom.selectAllCategories) {
        dom.selectAllCategories.addEventListener('change', (e) => {
            handleSelectAll(e, 'categories');
        });
    }

    if (dom.selectAllCharacteristics) {
        dom.selectAllCharacteristics.addEventListener('change', (e) => {
            handleSelectAll(e, 'characteristics');
        });
    }

    if (dom.selectAllOptions) {
        dom.selectAllOptions.addEventListener('change', (e) => {
            handleSelectAll(e, 'options');
        });
    }

    // Делегування подій для таблиць
    document.addEventListener('click', handleTableActions);

    // Чекбокси рядків (через делегування)
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('row-checkbox')) {
            handleRowCheckboxChange();
        }
    });

    // Пошук з debounce
    if (dom.searchInput) {
        let searchTimeout;
        dom.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch(e.target.value);
            }, 300);
        });
    }

    console.log('✅ Обробники подій ініціалізовано');
}

/**
 * Оновлює дані з Google Sheets
 */
async function handleRefreshData() {
    if (!isUserAuthorized()) {
        alert('Спочатку авторизуйтесь через Google');
        signIn();
        return;
    }

    const dom = getEntitiesDOM();
    const currentTab = getCurrentTab();

    try {
        // Показуємо індикатор завантаження
        switch (currentTab) {
            case 'categories':
                showLoadingState(dom.categoriesTbody, 7);
                break;
            case 'characteristics':
                showLoadingState(dom.characteristicsTbody, 9);
                break;
            case 'options':
                showLoadingState(dom.optionsTbody, 6);
                break;
        }

        // Завантажуємо дані
        await fetchAllData();

        // Рендеримо таблиці
        renderCategories(dom.categoriesTbody);
        renderCharacteristics(dom.characteristicsTbody);
        renderOptions(dom.optionsTbody);

        console.log('✅ Дані оновлено');

    } catch (error) {
        console.error('❌ Помилка оновлення даних:', error);
        alert('Помилка завантаження даних. Перевірте консоль.');
    }
}

/**
 * Додає нову сутність
 */
function handleAddEntity() {
    if (!isUserAuthorized()) {
        alert('Спочатку авторизуйтесь через Google');
        signIn();
        return;
    }

    const currentTab = getCurrentTab();
    
    // TODO: Відкрити модальне вікно для додавання
    alert(`Додавання нової сутності для табу: ${currentTab}\n(Функціонал в розробці)`);
}

/**
 * Видаляє вибрані елементи
 */
async function handleDeleteSelected() {
    const checkedBoxes = document.querySelectorAll('.row-checkbox:checked');
    
    if (checkedBoxes.length === 0) {
        return;
    }

    const confirmText = `Ви впевнені, що хочете видалити ${checkedBoxes.length} елементів?\nЦя дія незворотна!`;
    
    if (!confirm(confirmText)) {
        return;
    }

    const currentTab = getCurrentTab();
    const sheetName = getSheetNameFromTab(currentTab);

    try {
        // Збираємо індекси рядків для видалення (сортуємо в зворотному порядку)
        const rowIndexes = Array.from(checkedBoxes)
            .map(cb => parseInt(cb.closest('tr').dataset.rowIndex))
            .sort((a, b) => b - a); // Видаляємо з кінця, щоб не зміщувались індекси

        // Видаляємо по черзі
        for (const rowIndex of rowIndexes) {
            await deleteEntityFromSheet(sheetName, rowIndex);
        }

        console.log(`✅ Видалено ${rowIndexes.length} елементів`);

        // Оновлюємо таблицю
        await handleRefreshData();

    } catch (error) {
        console.error('❌ Помилка видалення:', error);
        alert('Помилка видалення елементів. Перевірте консоль.');
    }
}

/**
 * Обробляє вибір всіх елементів
 */
function handleSelectAll(event, tabName) {
    const isChecked = event.target.checked;
    const checkboxes = document.querySelectorAll(`#${tabName}-tbody .row-checkbox`);
    
    checkboxes.forEach(cb => {
        cb.checked = isChecked;
    });

    handleRowCheckboxChange();
}

/**
 * Оновлює стан при зміні чекбокса рядка
 */
function handleRowCheckboxChange() {
    const dom = getEntitiesDOM();
    const checkedCount = document.querySelectorAll('.row-checkbox:checked').length;

    // Оновлюємо кнопку видалення
    dom.btnDeleteSelected.disabled = checkedCount === 0;

    // Оновлюємо лічильник
    updateSelectedCount(dom.selectedCount);
}

/**
 * Обробляє кліки по кнопках в таблиці (edit, delete)
 */
function handleTableActions(e) {
    // Кнопка редагування
    if (e.target.closest('.btn-edit')) {
        const btn = e.target.closest('.btn-edit');
        const entityId = btn.dataset.id;
        handleEditEntity(entityId);
        return;
    }

    // Кнопка видалення одного елемента
    if (e.target.closest('.btn-delete')) {
        const btn = e.target.closest('.btn-delete');
        const entityId = btn.dataset.id;
        const rowIndex = parseInt(btn.dataset.row);
        handleDeleteSingleEntity(entityId, rowIndex);
        return;
    }
}

/**
 * Редагує сутність
 */
function handleEditEntity(entityId) {
    // TODO: Відкрити модальне вікно редагування
    alert(`Редагування сутності: ${entityId}\n(Функціонал в розробці)`);
}

/**
 * Видаляє одну сутність
 */
async function handleDeleteSingleEntity(entityId, rowIndex) {
    if (!confirm(`Видалити елемент ${entityId}?`)) {
        return;
    }

    const currentTab = getCurrentTab();
    const sheetName = getSheetNameFromTab(currentTab);

    try {
        await deleteEntityFromSheet(sheetName, rowIndex);
        console.log(`✅ Елемент ${entityId} видалено`);

        // Оновлюємо таблицю
        await handleRefreshData();

    } catch (error) {
        console.error('❌ Помилка видалення:', error);
        alert('Помилка видалення елемента. Перевірте консоль.');
    }
}

/**
 * Обробляє пошук
 */
function handleSearch(query) {
    const currentTab = getCurrentTab();
    const tbody = document.querySelector(`#${currentTab}-tbody`);
    const rows = tbody.querySelectorAll('tr:not(.loading-row):not(.empty-state)');

    const lowerQuery = query.toLowerCase().trim();

    rows.forEach(row => {
        if (!lowerQuery) {
            row.style.display = '';
            return;
        }

        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(lowerQuery) ? '' : 'none';
    });
}

/**
 * Повертає назву аркуша по імені табу
 */
function getSheetNameFromTab(tabName) {
    const mapping = {
        'categories': 'Categories',
        'characteristics': 'Characteristics',
        'options': 'Options'
    };
    return mapping[tabName] || 'Categories';
}
