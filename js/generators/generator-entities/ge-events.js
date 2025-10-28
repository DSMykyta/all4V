// js/generators/generator-entities/ge-events.js

import { dom, getActiveTab } from './ge-dom.js';
import { fetchAllData } from './ge-data.js';
import { renderAllTables, showLoadingState } from './ge-render.js';
import { showToast } from '../../common/ui-toast.js';
import { deleteEntity } from './ge-data.js';
import {
    openAddCategoryModal,
    openEditCategoryModal,
    openAddCharacteristicModal,
    openEditCharacteristicModal,
    openAddOptionModal,
    openEditOptionModal
} from './ge-modal.js';

/**
 * Ініціалізує всі обробники подій
 */
export function initEvents() {
    console.log('🎯 Ініціалізація обробників подій...');

    // Кнопка "Додати"
    if (dom.btnAddEntity) {
        dom.btnAddEntity.addEventListener('click', handleAddEntity);
    }

    // Кнопка "Оновити"
    if (dom.btnReload) {
        dom.btnReload.addEventListener('click', handleReloadData);
    }

    // Делегування подій для кнопок в таблицях (edit, delete)
    document.addEventListener('click', (e) => {
        if (e.target.closest('.btn-edit-entity')) {
            const btn = e.target.closest('.btn-edit-entity');
            const entityId = btn.dataset.entityId;
            handleEditEntity(entityId);
        }

        if (e.target.closest('.btn-delete-entity')) {
            const btn = e.target.closest('.btn-delete-entity');
            const entityId = btn.dataset.entityId;
            const rowIndex = parseInt(btn.dataset.rowIndex);
            handleDeleteEntity(entityId, rowIndex);
        }
    });

    console.log('✅ Обробники подій ініціалізовано');
}

/**
 * Обробляє натискання кнопки "Додати"
 */
function handleAddEntity() {
    const activeTab = getActiveTab();
    console.log('➕ Додавання нової сутності, активний таб:', activeTab);

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
        // 🔴 ВИДАЛЕНО: case 'marketplaces':
        default:
            console.warn('⚠️ Невідомий активний таб:', activeTab);
    }
}



/**
 * Обробляє натискання кнопки "Редагувати"
 */
function handleEditEntity(entityId) {
    const activeTab = getActiveTab();
    console.log('✏️ Редагування сутності:', entityId, 'таб:', activeTab);

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
        // 🔴 ВИДАЛЕНО: case 'marketplaces':
        default:
            console.warn('⚠️ Невідомий активний таб:', activeTab);
    }
}



/**
 * Обробляє натискання кнопки "Видалити"
 */
async function handleDeleteEntity(entityId, rowIndex) {
    const activeTab = getActiveTab();
    console.log('🗑️ Видалення сутності:', entityId, 'рядок:', rowIndex);

    const confirmed = confirm(`Ви впевнені, що хочете видалити сутність ${entityId}?\nЦю дію не можна скасувати.`);

    if (!confirmed) {
        console.log('❌ Видалення скасовано користувачем');
        return;
    }

    try {
        let sheetName = '';
        switch (activeTab) {
            case 'categories':
                sheetName = 'Categories';
                break;
            case 'characteristics':
                sheetName = 'Characteristics';
                break;
            case 'options':
                sheetName = 'Options';
                break;
            // 🔴 ВИДАЛЕНО: case 'marketplaces':
        }


        await deleteEntity(sheetName, rowIndex);
        showToast(`Сутність ${entityId} успішно видалено`, 'success');
        renderAllTables();

    } catch (error) {
        console.error('❌ Помилка видалення:', error);
        showToast('Помилка видалення сутності', 'error');
    }
}

/**
 * Обробляє натискання кнопки "Оновити дані"
 */
async function handleReloadData() {
    console.log('🔄 Перезавантаження даних...');

    const activeTab = getActiveTab();
    let tbody = null;
    let colspan = 7;

    switch (activeTab) {
        case 'categories':
            tbody = dom.categoriesTbody;
            colspan = 7;
            break;
        case 'characteristics':
            tbody = dom.characteristicsTbody;
            colspan = 9;
            break;
        case 'options':
            tbody = dom.optionsTbody;
            colspan = 6;
            break;
    }

    if (tbody) {
        showLoadingState(tbody, colspan);
    }

    try {
        await fetchAllData();
        renderAllTables();
        showToast('Дані успішно оновлено', 'success');
        console.log('✅ Дані оновлено');
    } catch (error) {
        console.error('❌ Помилка оновлення даних:', error);
        showToast('Помилка оновлення даних', 'error');
    }
}
