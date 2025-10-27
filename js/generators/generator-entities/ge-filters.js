// js/generators/generator-entities/ge-filters.js

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                   ПОШУК ТА ФІЛЬТРАЦІЯ СУТНОСТЕЙ                          ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * Відповідає за:
 * - Пошук по всіх полях
 * - Фільтрацію за критеріями
 * - Масове видалення обраних елементів
 */

import { getCategoriesData, getCharacteristicsData, getOptionsData, deleteEntity } from './ge-data.js';
import { renderCategories, renderCharacteristics, renderOptions, updateSelectedCount } from './ge-render.js';
import { getActiveTab, getActiveSheetName } from './ge-dom.js';
import { showToast } from '../../common/ui-toast.js';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ІНІЦІАЛІЗАЦІЯ ФІЛЬТРІВ
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function initFilters() {
    const searchInput = document.getElementById('search-input');
    const btnDeleteSelected = document.getElementById('btn-delete-selected');
    const selectAllCheckboxes = document.querySelectorAll('[id^="select-all-"]');

    // Пошук з затримкою (debounce)
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                handleSearch(e.target.value);
            }, 300); // 300ms затримка
        });
    }

    // Кнопка "Видалити обрані"
    if (btnDeleteSelected) {
        btnDeleteSelected.addEventListener('click', handleDeleteSelected);
    }

    // Чекбокси "Вибрати всі"
    selectAllCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            handleSelectAll(e.target.checked);
        });
    });

    // Відстежуємо зміни чекбоксів в рядках таблиці
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('row-checkbox')) {
            updateSelectedCount();
            updateDeleteButtonState();
        }
    });

    console.log('✅ Фільтри ініціалізовано');
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ПОШУК
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Обробник пошуку
 */
function handleSearch(query) {
    const activeTab = getActiveTab();
    const normalizedQuery = query.toLowerCase().trim();

    console.log(`🔍 Пошук: "${query}" в табі "${activeTab}"`);

    if (!normalizedQuery) {
        // Якщо пошук порожній - показуємо всі дані
        renderAllData();
        return;
    }

    // Фільтруємо дані залежно від табу
    switch (activeTab) {
        case 'categories':
            filterCategories(normalizedQuery);
            break;
        case 'characteristics':
            filterCharacteristics(normalizedQuery);
            break;
        case 'options':
            filterOptions(normalizedQuery);
            break;
    }
}

/**
 * Фільтрує категорії за пошуковим запитом
 */
function filterCategories(query) {
    const allCategories = getCategoriesData();
    const filtered = allCategories.filter(cat => {
        return (
            cat.local_id?.toLowerCase().includes(query) ||
            cat.parent_local_id?.toLowerCase().includes(query) ||
            cat.name_uk?.toLowerCase().includes(query) ||
            cat.name_ru?.toLowerCase().includes(query) ||
            cat.category_type?.toLowerCase().includes(query)
        );
    });

    const tbody = document.getElementById('categories-tbody');
    renderCategories(tbody, filtered);
    
    console.log(`✅ Знайдено ${filtered.length} з ${allCategories.length} категорій`);
}

/**
 * Фільтрує характеристики за пошуковим запитом
 */
function filterCharacteristics(query) {
    const allCharacteristics = getCharacteristicsData();
    const filtered = allCharacteristics.filter(char => {
        return (
            char.local_id?.toLowerCase().includes(query) ||
            char.name_uk?.toLowerCase().includes(query) ||
            char.name_ru?.toLowerCase().includes(query) ||
            char.param_type?.toLowerCase().includes(query) ||
            char.unit?.toLowerCase().includes(query) ||
            char.filter_type?.toLowerCase().includes(query) ||
            char.notes?.toLowerCase().includes(query)
        );
    });

    const tbody = document.getElementById('characteristics-tbody');
    renderCharacteristics(tbody, filtered);
    
    console.log(`✅ Знайдено ${filtered.length} з ${allCharacteristics.length} характеристик`);
}

/**
 * Фільтрує опції за пошуковим запитом
 */
function filterOptions(query) {
    const allOptions = getOptionsData();
    const filtered = allOptions.filter(opt => {
        return (
            opt.local_id?.toLowerCase().includes(query) ||
            opt.char_local_id?.toLowerCase().includes(query) ||
            opt.name_uk?.toLowerCase().includes(query) ||
            opt.name_ru?.toLowerCase().includes(query)
        );
    });

    const tbody = document.getElementById('options-tbody');
    renderOptions(tbody, filtered);
    
    console.log(`✅ Знайдено ${filtered.length} з ${allOptions.length} опцій`);
}

/**
 * Відображає всі дані без фільтрації
 */
function renderAllData() {
    const categoriesTbody = document.getElementById('categories-tbody');
    const characteristicsTbody = document.getElementById('characteristics-tbody');
    const optionsTbody = document.getElementById('options-tbody');

    renderCategories(categoriesTbody);
    renderCharacteristics(characteristicsTbody);
    renderOptions(optionsTbody);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ВИБІР ЕЛЕМЕНТІВ (ЧЕКБОКСИ)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Обробник "Вибрати всі"
 */
function handleSelectAll(checked) {
    const activeTab = getActiveTab();
    let selector = '';

    switch (activeTab) {
        case 'categories':
            selector = '#categories-tbody .row-checkbox';
            break;
        case 'characteristics':
            selector = '#characteristics-tbody .row-checkbox';
            break;
        case 'options':
            selector = '#options-tbody .row-checkbox';
            break;
    }

    const checkboxes = document.querySelectorAll(selector);
    checkboxes.forEach(cb => {
        cb.checked = checked;
    });

    updateSelectedCount();
    updateDeleteButtonState();

    console.log(`${checked ? '✅ Вибрано' : '❌ Знято вибір'} з усіх елементів (${checkboxes.length})`);
}

/**
 * Оновлює стан кнопки "Видалити обрані"
 */
function updateDeleteButtonState() {
    const btnDeleteSelected = document.getElementById('btn-delete-selected');
    if (!btnDeleteSelected) return;

    const selectedCount = document.querySelectorAll('.row-checkbox:checked').length;
    btnDeleteSelected.disabled = selectedCount === 0;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * МАСОВЕ ВИДАЛЕННЯ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Обробник "Видалити обрані"
 */
async function handleDeleteSelected() {
    const selectedCheckboxes = document.querySelectorAll('.row-checkbox:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);

    if (selectedIds.length === 0) {
        showToast('⚠️ Не вибрано жодного елемента', 'warning');
        return;
    }

    const confirmed = confirm(
        `Ви впевнені, що хочете видалити ${selectedIds.length} елементів?\n\n` +
        `Ця дія незворотня!`
    );

    if (!confirmed) return;

    const sheetName = getActiveSheetName();
    let successCount = 0;
    let errorCount = 0;

    showToast(`⏳ Видалення ${selectedIds.length} елементів...`, 'info');

    // Видаляємо елементи по одному
    for (const checkbox of selectedCheckboxes) {
        const row = checkbox.closest('tr');
        const rowIndex = row.dataset.rowIndex;

        try {
            await deleteEntity(sheetName, parseInt(rowIndex));
            successCount++;
            console.log(`✅ Видалено: ${checkbox.dataset.id}`);
        } catch (error) {
            errorCount++;
            console.error(`❌ Помилка видалення: ${checkbox.dataset.id}`, error);
        }
    }

    // Показуємо результат
    if (errorCount === 0) {
        showToast(`✅ Успішно видалено ${successCount} елементів`, 'success');
    } else {
        showToast(`⚠️ Видалено ${successCount}, помилок: ${errorCount}`, 'warning');
    }

    // Оновлюємо відображення
    renderAllData();
    updateSelectedCount();
    updateDeleteButtonState();

    // Знімаємо прапорець "Вибрати всі"
    const selectAllCheckbox = document.querySelector(`#select-all-${getActiveTab()}`);
    if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ОЧИЩЕННЯ ФІЛЬТРІВ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Очищає всі фільтри та пошук
 */
export function clearFilters() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    renderAllData();
    updateSelectedCount();

    console.log('🧹 Фільтри очищено');
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * СОРТУВАННЯ (ОПЦІОНАЛЬНО)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Сортує таблицю за вказаною колонкою
 * TODO: Реалізувати при потребі
 */
export function sortTable(column, direction = 'asc') {
    console.log(`📊 Сортування за "${column}" (${direction})`);
    // Реалізація сортування
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ЕКСПОРТ/ІМПОРТ (ОПЦІОНАЛЬНО)
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Експортує поточні дані в CSV
 * TODO: Реалізувати при потребі
 */
export function exportToCSV() {
    console.log('📥 Експорт в CSV');
    // Реалізація експорту
}

/**
 * Експортує поточні дані в JSON
 * TODO: Реалізувати при потребі
 */
export function exportToJSON() {
    console.log('📥 Експорт в JSON');
    // Реалізація експорту
}
