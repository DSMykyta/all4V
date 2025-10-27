// js/generators/generator-entities/ge-events.js

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                   ОБРОБНИКИ ПОДІЙ СУТНОСТЕЙ                              ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * Відповідає за:
 * - Обробку кліків на кнопки (Додати, Оновити, Редагувати, Видалити)
 * - Делегування подій для динамічних елементів
 * - Взаємодію між модулями
 */

import { dom, getActiveTab, getActiveSheetName } from './ge-dom.js';
import { fetchAllData, deleteEntity } from './ge-data.js';
import { renderAllTables, showLoadingState, updateSelectedCount } from './ge-render.js';
import { 
    openAddCategoryModal, 
    openEditCategoryModal,
    openAddCharacteristicModal,
    openEditCharacteristicModal,
    openAddOptionModal,
    openEditOptionModal
} from './ge-modal.js';
import { showToast } from '../../common/ui-toast.js';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ІНІЦІАЛІЗАЦІЯ ОБРОБНИКІВ
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function initEvents() {
    // Кнопка "Додати"
    if (dom.btnAddEntity) {
        dom.btnAddEntity.addEventListener('click', handleAddEntity);
    }

    // Кнопка "Оновити дані"
    if (dom.btnReload) {
        dom.btnReload.addEventListener('click', handleReloadData);
    }

    // Делегування подій для таблиць (редагувати, видалити)
    document.addEventListener('click', handleTableActions);

    console.log('✅ Обробники подій ініціалізовано');
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * КНОПКА "ДОДАТИ"
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Обробник кнопки "Додати" - визначає активний таб і відкриває відповідне модальне вікно
 */
function handleAddEntity() {
    const activeTab = getActiveTab();
    
    console.log(`➕ Додати нову сутність в табі: ${activeTab}`);

    switch (activeTab) {
        case 'categories':
            openAddCategoryModal();
            break;
        case 'characteristics':
            openAddCharacteristicModal();
            break;
        case 'options':
            openAddOptionModal();
            break;
        default:
            console.warn('⚠️ Невідомий таб:', activeTab);
            showToast('⚠️ Не вдалося визначити тип сутності', 'warning');
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * КНОПКА "ОНОВИТИ ДАНІ"
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Обробник кнопки "Оновити дані"
 */
async function handleReloadData() {
    console.log('🔄 Оновлення даних...');

    // Блокуємо кнопку
    dom.btnReload.disabled = true;
    const icon = dom.btnReload.querySelector('.material-symbols-outlined');
    icon.classList.add('is-spinning');

    // Показуємо індикатори завантаження в таблицях
    showLoadingState(dom.categoriesTbody, 7);
    showLoadingState(dom.characteristicsTbody, 9);
    showLoadingState(dom.optionsTbody, 6);

    try {
        // Завантажуємо дані
        await fetchAllData();
        
        // Рендеримо таблиці
        renderAllTables();
        
        showToast('✅ Дані успішно оновлено', 'success');
        console.log('✅ Дані оновлено');

    } catch (error) {
        console.error('❌ Помилка оновлення даних:', error);
        showToast('❌ Помилка оновлення даних', 'error');
    } finally {
        // Розблоковуємо кнопку
        dom.btnReload.disabled = false;
        icon.classList.remove('is-spinning');
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ДЕЛЕГУВАННЯ ПОДІЙ ДЛЯ ТАБЛИЦЬ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Універсальний обробник кліків в таблицях (делегування)
 */
function handleTableActions(e) {
    const button = e.target.closest('[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const entityId = button.dataset.id;

    switch (action) {
        case 'edit':
            handleEditEntity(entityId);
            break;
        case 'delete':
            handleDeleteEntity(entityId, button.dataset.row);
            break;
        default:
            console.warn('⚠️ Невідома дія:', action);
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * РЕДАГУВАННЯ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Обробник кнопки "Редагувати"
 */
function handleEditEntity(entityId) {
    const activeTab = getActiveTab();
    
    console.log(`✏️ Редагувати сутність: ${entityId} (таб: ${activeTab})`);

    switch (activeTab) {
        case 'categories':
            openEditCategoryModal(entityId);
            break;
        case 'characteristics':
            openEditCharacteristicModal(entityId);
            break;
        case 'options':
            openEditOptionModal(entityId);
            break;
        default:
            console.warn('⚠️ Невідомий таб:', activeTab);
            showToast('⚠️ Не вдалося визначити тип сутності', 'warning');
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ВИДАЛЕННЯ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Обробник кнопки "Видалити"
 */
async function handleDeleteEntity(entityId, rowIndex) {
    const activeTab = getActiveTab();
    const sheetName = getActiveSheetName();

    console.log(`🗑️ Видалити сутність: ${entityId} (рядок: ${rowIndex}, таб: ${activeTab})`);

    // Підтвердження
    const confirmed = confirm(
        `Ви впевнені, що хочете видалити цю сутність?\n\n` +
        `ID: ${entityId}\n\n` +
        `Ця дія незворотня!`
    );

    if (!confirmed) {
        console.log('❌ Видалення скасовано користувачем');
        return;
    }

    try {
        // Блокуємо кнопку видалення
        const deleteBtn = document.querySelector(`[data-action="delete"][data-id="${entityId}"]`);
        if (deleteBtn) {
            deleteBtn.disabled = true;
        }

        // Видаляємо з Google Sheets
        await deleteEntity(sheetName, parseInt(rowIndex));

        // Перемальовуємо таблиці
        renderAllTables();

        showToast('✅ Сутність успішно видалено', 'success');
        console.log(`✅ Сутність ${entityId} видалено`);

    } catch (error) {
        console.error('❌ Помилка видалення:', error);
        showToast('❌ Помилка видалення сутності', 'error');

        // Розблоковуємо кнопку у разі помилки
        const deleteBtn = document.querySelector(`[data-action="delete"][data-id="${entityId}"]`);
        if (deleteBtn) {
            deleteBtn.disabled = false;
        }
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ПЕРЕМИКАННЯ ТАБІВ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Обробник перемикання табів
 * Оновлює текст кнопки "Додати" та очищає пошук
 */
function handleTabSwitch(e) {
    const tabButton = e.target.closest('[data-tab-target]');
    if (!tabButton) return;

    const tabName = tabButton.dataset.tabTarget;
    
    console.log(`📑 Перемикання на таб: ${tabName}`);

    // Оновлюємо текст кнопки "Додати" залежно від табу
    updateAddButtonText(tabName);

    // Очищаємо пошук при перемиканні табу
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
    }

    // Оновлюємо лічильник вибраних
    setTimeout(() => {
        updateSelectedCount();
    }, 100);
}

/**
 * Оновлює текст кнопки "Додати" залежно від активного табу
 */
function updateAddButtonText(tabName) {
    if (!dom.btnAddEntity) return;

    const textMap = {
        'categories': 'Додати категорію',
        'characteristics': 'Додати характеристику',
        'options': 'Додати опцію'
    };

    const text = textMap[tabName] || 'Додати';
    
    // Оновлюємо текст (якщо є текстовий вузол)
    const textNode = Array.from(dom.btnAddEntity.childNodes).find(
        node => node.nodeType === Node.TEXT_NODE
    );
    
    if (textNode) {
        textNode.textContent = text;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ЕКСПОРТ ФУНКЦІЙ (для використання в інших модулях)
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Експортуємо функції, які можуть знадобитись іншим модулям
export {
    handleAddEntity,
    handleReloadData,
    handleEditEntity,
    handleDeleteEntity
};
