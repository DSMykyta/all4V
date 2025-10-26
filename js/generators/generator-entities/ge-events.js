// js/generators/generator-entities/ge-events.js

import { dom } from './ge-dom.js';
import { fetchAllData } from './ge-data.js';
import { renderCategories, renderCharacteristics, renderOptions } from './ge-render.js';

/**
 * Обробник кнопки "Додати категорію"
 */
function handleAddCategory() {
    console.log('Додати категорію');
    // TODO: Відкрити модальне вікно для додавання
}

/**
 * Обробник кнопки "Додати характеристику"
 */
function handleAddCharacteristic() {
    console.log('Додати характеристику');
    // TODO: Відкрити модальне вікно для додавання
}

/**
 * Обробник кнопки "Додати опцію"
 */
function handleAddOption() {
    console.log('Додати опцію');
    // TODO: Відкрити модальне вікно для додавання
}

/**
 * Обробник кнопки "Редагувати"
 */
function handleEdit(entityType, entityId) {
    console.log('Редагувати:', entityType, entityId);
    // TODO: Відкрити модальне вікно для редагування
}

/**
 * Обробник кнопки "Видалити"
 */
function handleDelete(entityType, entityId) {
    const confirmMessage = `Ви впевнені, що хочете видалити цю сутність (${entityType}: ${entityId})?`;
    if (confirm(confirmMessage)) {
        console.log('Видалити:', entityType, entityId);
        // TODO: Реалізувати видалення
    }
}

/**
 * Обробник кнопки перезавантаження
 */
async function handleReload() {
    try {
        dom.btnReload.disabled = true;
        dom.btnReload.style.color = 'var(--text-disabled)';

        await fetchAllData();

        renderCategories(dom.categoriesTbody);
        renderCharacteristics(dom.characteristicsTbody);
        renderOptions(dom.optionsTbody);

        console.log('✅ Дані перезавантажено');
    } catch (error) {
        console.error('Помилка перезавантаження:', error);
        alert('Помилка перезавантаження даних');
    } finally {
        dom.btnReload.disabled = false;
        dom.btnReload.style.color = '';
    }
}

/**
 * Ініціалізує обробники подій
 */
export function initEvents() {
    // Кнопки додавання
    dom.btnAddCategory?.addEventListener('click', handleAddCategory);
    dom.btnAddCharacteristic?.addEventListener('click', handleAddCharacteristic);
    dom.btnAddOption?.addEventListener('click', handleAddOption);

    // Кнопка перезавантаження
    dom.btnReload?.addEventListener('click', handleReload);

    // Делегування подій для кнопок у таблицях
    document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        const entityType = target.dataset.entityType;
        const entityId = target.dataset.entityId;

        if (action === 'edit') {
            handleEdit(entityType, entityId);
        } else if (action === 'delete') {
            handleDelete(entityType, entityId);
        }
    });
}
