// js/generators/generator-entities/ge-modal.js

import { showModal } from '../../common/ui-modal.js';
import { addEntity, updateEntity, getEntityById, getCategoriesData, getCharacteristicsData, getOptionsData, createMarketplaceSheet } from './ge-data.js';
import { renderAllTables } from './ge-render.js';
import { showToast } from '../../common/ui-toast.js';

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║              МОДАЛЬНІ ВІКНА ДЛЯ КЕРУВАННЯ СУТНОСТЯМИ                    ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * 
 * Використовує існуючу систему ui-modal.js для відображення модальних вікон.
 * Всі шаблони знаходяться в /templates/modals/entity-*.html
 */

// ============================================================================
// ВІДКРИТТЯ МОДАЛЬНИХ ВІКОН
// ============================================================================

export function openAddCategoryModal() {
    showModal('entity-add-category');
}

export function openEditCategoryModal(id) {
    showModal('entity-edit-category');
    // Зберігаємо ID для подальшого використання після відкриття модалу
    window._editEntityId = id;
}

export function openAddCharacteristicModal() {
    showModal('entity-add-characteristic');
}

export function openEditCharacteristicModal(id) {
    showModal('entity-edit-characteristic');
    window._editEntityId = id;
}

export function openAddOptionModal() {
    showModal('entity-add-option');
}

export function openEditOptionModal(id) {
    showModal('entity-edit-option');
    window._editEntityId = id;
}

// ============================================================================
// ОБРОБКА ПОДІЙ ПІСЛЯ ВІДКРИТТЯ МОДАЛІВ
// ============================================================================

document.addEventListener('modal-opened', (e) => {
    const { modalId, bodyTarget } = e.detail;
    
    switch(modalId) {
        case 'entity-add-category':
            handleAddCategoryModalOpened(bodyTarget);
            break;
        case 'entity-edit-category':
            handleEditCategoryModalOpened(bodyTarget);
            break;
        case 'entity-add-characteristic':
            handleAddCharacteristicModalOpened(bodyTarget);
            break;
        case 'entity-edit-characteristic':
            handleEditCharacteristicModalOpened(bodyTarget);
            break;
        case 'entity-add-option':
            handleAddOptionModalOpened(bodyTarget);
            break;
        case 'entity-edit-option':
            handleEditOptionModalOpened(bodyTarget);
            break;
    }
});

// ============================================================================
// КАТЕГОРІЇ: ДОДАВАННЯ
// ============================================================================

function handleAddCategoryModalOpened(container) {
    const form = container.querySelector('#form-add-category');
    const parentSelect = container.querySelector('#category-parent-id');
    
    // Заповнюємо список батьківських категорій
    populateParentCategoriesSelect(parentSelect);
    
    // Обробляємо submit форми
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const nameUa = container.querySelector('#category-name-ua').value.trim();
        const nameRu = container.querySelector('#category-name-ru').value.trim();
        const parentId = container.querySelector('#category-parent-id').value.trim();
        const type = container.querySelector('#category-type').value.trim();
        
        if (!nameUa || !type) {
            showToast('Заповніть обов\'язкові поля', 'error');
            return;
        }
        
        try {
            // Генеруємо новий ID
            const newId = generateCategoryId();
            const values = [newId, parentId, nameUa, nameRu, type];
            
            await addEntity('Categories', values);
            
            showToast('Категорію успішно додано', 'success');
            renderAllTables();
            closeModalByButton(container);
            
        } catch (error) {
            console.error('Помилка додавання категорії:', error);
            showToast('Помилка додавання категорії', 'error');
        }
    };
}

// ============================================================================
// КАТЕГОРІЇ: РЕДАГУВАННЯ
// ============================================================================

function handleEditCategoryModalOpened(container) {
    const form = container.querySelector('#form-edit-category');
    const entityId = window._editEntityId;
    
    if (!entityId) {
        showToast('Помилка: ID категорії не знайдено', 'error');
        return;
    }
    
    const entity = getEntityById('category', entityId);
    
    if (!entity) {
        showToast('Помилка: категорію не знайдено', 'error');
        return;
    }
    
    // Заповнюємо форму даними
    container.querySelector('#edit-category-id').value = entity.id;
    container.querySelector('#edit-category-name-ua').value = entity.nameUa;
    container.querySelector('#edit-category-name-ru').value = entity.nameRu || '';
    container.querySelector('#edit-category-type').value = entity.type;
    container.querySelector('#edit-category-row-index').value = entity.rowIndex;
    
    // Заповнюємо список батьківських категорій
    const parentSelect = container.querySelector('#edit-category-parent-id');
    populateParentCategoriesSelect(parentSelect, entityId);
    parentSelect.value = entity.parentId || '';
    
    // Обробляємо submit форми
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const nameUa = container.querySelector('#edit-category-name-ua').value.trim();
        const nameRu = container.querySelector('#edit-category-name-ru').value.trim();
        const parentId = container.querySelector('#edit-category-parent-id').value.trim();
        const type = container.querySelector('#edit-category-type').value.trim();
        const rowIndex = parseInt(container.querySelector('#edit-category-row-index').value);
        
        if (!nameUa || !type) {
            showToast('Заповніть обов\'язкові поля', 'error');
            return;
        }
        
        try {
            const values = [entity.id, parentId, nameUa, nameRu, type];
            await updateEntity('Categories', rowIndex, values);
            
            showToast('Категорію успішно оновлено', 'success');
            renderAllTables();
            closeModalByButton(container);
            
        } catch (error) {
            console.error('Помилка оновлення категорії:', error);
            showToast('Помилка оновлення категорії', 'error');
        }
    };
}

// ============================================================================
// ХАРАКТЕРИСТИКИ: ДОДАВАННЯ
// ============================================================================

function handleAddCharacteristicModalOpened(container) {
    const form = container.querySelector('#form-add-characteristic');
    
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const nameUa = container.querySelector('#characteristic-name-ua').value.trim();
        const nameRu = container.querySelector('#characteristic-name-ru').value.trim();
        const paramType = container.querySelector('#characteristic-param-type').value.trim();
        const unit = container.querySelector('#characteristic-unit').value.trim();
        const filterType = container.querySelector('#characteristic-filter-type').value.trim();
        const isGlobal = container.querySelector('#characteristic-is-global').checked ? 'TRUE' : 'FALSE';
        
        if (!nameUa || !paramType || !filterType) {
            showToast('Заповніть обов\'язкові поля', 'error');
            return;
        }
        
        try {
            const newId = generateCharacteristicId();
            const values = [newId, nameUa, nameRu, paramType, unit, filterType, isGlobal];
            
            await addEntity('Characteristics', values);
            
            showToast('Характеристику успішно додано', 'success');
            renderAllTables();
            closeModalByButton(container);
            
        } catch (error) {
            console.error('Помилка додавання характеристики:', error);
            showToast('Помилка додавання характеристики', 'error');
        }
    };
}

// ============================================================================
// ХАРАКТЕРИСТИКИ: РЕДАГУВАННЯ
// ============================================================================

function handleEditCharacteristicModalOpened(container) {
    const form = container.querySelector('#form-edit-characteristic');
    const entityId = window._editEntityId;
    
    if (!entityId) {
        showToast('Помилка: ID характеристики не знайдено', 'error');
        return;
    }
    
    const entity = getEntityById('characteristic', entityId);
    
    if (!entity) {
        showToast('Помилка: характеристику не знайдено', 'error');
        return;
    }
    
    // Заповнюємо форму даними
    container.querySelector('#edit-characteristic-id').value = entity.id;
    container.querySelector('#edit-characteristic-name-ua').value = entity.nameUa;
    container.querySelector('#edit-characteristic-name-ru').value = entity.nameRu || '';
    container.querySelector('#edit-characteristic-param-type').value = entity.paramType;
    container.querySelector('#edit-characteristic-unit').value = entity.unit || '';
    container.querySelector('#edit-characteristic-filter-type').value = entity.filterType;
    container.querySelector('#edit-characteristic-is-global').checked = entity.isGlobal === 'TRUE';
    container.querySelector('#edit-characteristic-row-index').value = entity.rowIndex;
    
    // Обробляємо submit форми
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const nameUa = container.querySelector('#edit-characteristic-name-ua').value.trim();
        const nameRu = container.querySelector('#edit-characteristic-name-ru').value.trim();
        const paramType = container.querySelector('#edit-characteristic-param-type').value.trim();
        const unit = container.querySelector('#edit-characteristic-unit').value.trim();
        const filterType = container.querySelector('#edit-characteristic-filter-type').value.trim();
        const isGlobal = container.querySelector('#edit-characteristic-is-global').checked ? 'TRUE' : 'FALSE';
        const rowIndex = parseInt(container.querySelector('#edit-characteristic-row-index').value);
        
        if (!nameUa || !paramType || !filterType) {
            showToast('Заповніть обов\'язкові поля', 'error');
            return;
        }
        
        try {
            const values = [entity.id, nameUa, nameRu, paramType, unit, filterType, isGlobal];
            await updateEntity('Characteristics', rowIndex, values);
            
            showToast('Характеристику успішно оновлено', 'success');
            renderAllTables();
            closeModalByButton(container);
            
        } catch (error) {
            console.error('Помилка оновлення характеристики:', error);
            showToast('Помилка оновлення характеристики', 'error');
        }
    };
}

// ============================================================================
// ОПЦІЇ: ДОДАВАННЯ
// ============================================================================

function handleAddOptionModalOpened(container) {
    const form = container.querySelector('#form-add-option');
    const charSelect = container.querySelector('#option-characteristic-id');
    
    // Заповнюємо список характеристик
    populateCharacteristicsSelect(charSelect);
    
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const characteristicId = container.querySelector('#option-characteristic-id').value.trim();
        const nameUa = container.querySelector('#option-name-ua').value.trim();
        const nameRu = container.querySelector('#option-name-ru').value.trim();
        
        if (!characteristicId || !nameUa) {
            showToast('Заповніть обов\'язкові поля', 'error');
            return;
        }
        
        try {
            const newId = generateOptionId();
            const values = [newId, characteristicId, nameUa, nameRu];
            
            await addEntity('Options', values);
            
            showToast('Опцію успішно додано', 'success');
            renderAllTables();
            closeModalByButton(container);
            
        } catch (error) {
            console.error('Помилка додавання опції:', error);
            showToast('Помилка додавання опції', 'error');
        }
    };
}

// ============================================================================
// ОПЦІЇ: РЕДАГУВАННЯ
// ============================================================================

function handleEditOptionModalOpened(container) {
    const form = container.querySelector('#form-edit-option');
    const entityId = window._editEntityId;
    
    if (!entityId) {
        showToast('Помилка: ID опції не знайдено', 'error');
        return;
    }
    
    const entity = getEntityById('option', entityId);
    
    if (!entity) {
        showToast('Помилка: опцію не знайдено', 'error');
        return;
    }
    
    // Заповнюємо форму даними
    container.querySelector('#edit-option-id').value = entity.id;
    container.querySelector('#edit-option-name-ua').value = entity.nameUa;
    container.querySelector('#edit-option-name-ru').value = entity.nameRu || '';
    container.querySelector('#edit-option-row-index').value = entity.rowIndex;
    
    // Заповнюємо список характеристик
    const charSelect = container.querySelector('#edit-option-characteristic-id');
    populateCharacteristicsSelect(charSelect);
    charSelect.value = entity.characteristicId;
    
    // Обробляємо submit форми
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const characteristicId = container.querySelector('#edit-option-characteristic-id').value.trim();
        const nameUa = container.querySelector('#edit-option-name-ua').value.trim();
        const nameRu = container.querySelector('#edit-option-name-ru').value.trim();
        const rowIndex = parseInt(container.querySelector('#edit-option-row-index').value);
        
        if (!characteristicId || !nameUa) {
            showToast('Заповніть обов\'язкові поля', 'error');
            return;
        }
        
        try {
            const values = [entity.id, characteristicId, nameUa, nameRu];
            await updateEntity('Options', rowIndex, values);
            
            showToast('Опцію успішно оновлено', 'success');
            renderAllTables();
            closeModalByButton(container);
            
        } catch (error) {
            console.error('Помилка оновлення опції:', error);
            showToast('Помилка оновлення опції', 'error');
        }
    };
}

// ============================================================================
// ДОПОМІЖНІ ФУНКЦІЇ
// ============================================================================

function populateParentCategoriesSelect(selectElement, excludeId = null) {
    selectElement.innerHTML = '<option value="">— Немає (коренева категорія) —</option>';
    
    const categories = getCategoriesData(); // ← ЗМІНЕНО
    categories.forEach(cat => {
        if (cat.id !== excludeId) {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.id} — ${cat.nameUa}`;
            selectElement.appendChild(option);
        }
    });
}

function populateCharacteristicsSelect(selectElement) {
    selectElement.innerHTML = '<option value="">— Оберіть характеристику —</option>';
    
    entitiesData.characteristics.forEach(char => {
        const option = document.createElement('option');
        option.value = char.id;
        option.textContent = `${char.id} — ${char.nameUa}`;
        selectElement.appendChild(option);
    });
}

function generateCategoryId() {
    const categories = getCategoriesData(); // ← ЗМІНЕНО
    const ids = categories.map(c => parseInt(c.id.replace('CAT', ''))).filter(n => !isNaN(n));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return `CAT${String(maxId + 1).padStart(3, '0')}`;
}


function generateCharacteristicId() {
    const characteristics = getCharacteristicsData(); // ← ЗМІНЕНО
    const ids = characteristics.map(c => parseInt(c.id.replace('CHAR', ''))).filter(n => !isNaN(n));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return `CHAR${String(maxId + 1).padStart(3, '0')}`;
}


function generateOptionId() {
    const ids = entitiesData.options.map(o => parseInt(o.id.replace('OPT', ''))).filter(n => !isNaN(n));
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return `OPT${String(maxId + 1).padStart(3, '0')}`;
}

function closeModalByButton(container) {
    const closeBtn = container.querySelector('[data-modal-close]');
    if (closeBtn) closeBtn.click();
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 МАРКЕТПЛЕЙСИ: ДОДАВАННЯ
 * ═══════════════════════════════════════════════════════════════════════════
 */

export function openAddMarketplaceModal() {
    const modal = document.getElementById('modal-add-marketplace');
    if (!modal) {
        console.error('❌ Модальне вікно #modal-add-marketplace не знайдено');
        return;
    }

    // Показуємо модальне вікно
    modal.style.display = 'flex';

    // Обробник закриття
    const closeButtons = modal.querySelectorAll('[data-modal-close]');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'none';
            modal.querySelector('form').reset();
        });
    });

    // Обробник форми
    const form = modal.querySelector('#form-add-marketplace');
    form.onsubmit = async (e) => {
        e.preventDefault();
        await handleAddMarketplaceSubmit(modal);
    };
}

async function handleAddMarketplaceSubmit(modal) {
    const marketplaceId = modal.querySelector('#marketplace-id').value.trim();
    const displayName = modal.querySelector('#marketplace-name').value.trim();
    const iconSvg = modal.querySelector('#marketplace-icon').value.trim();
    const primaryColor = modal.querySelector('#marketplace-color').value.trim();
    const createSheet = modal.querySelector('#marketplace-create-sheet').checked;

    if (!marketplaceId || !displayName) {
        showToast('Заповніть обов\'язкові поля', 'error');
        return;
    }

    // Валідація ID (тільки латиниця, цифри та _)
    if (!/^[a-z0-9_]+$/.test(marketplaceId)) {
        showToast('ID може містити тільки латинські літери, цифри та _ ', 'error');
        return;
    }

    try {
        // Додаємо маркетплейс до аркуша Marketplaces
        const values = [marketplaceId, displayName, iconSvg, primaryColor];
        await addEntity('Marketplaces', values);

        showToast('Маркетплейс успішно додано', 'success');

        // Якщо потрібно створити окремий аркуш
        if (createSheet) {
            try {
                const { sheetTitle } = await createMarketplaceSheet(marketplaceId);
                showToast(`Аркуш "${sheetTitle}" створено`, 'success');
            } catch (sheetError) {
                console.error('❌ Помилка створення аркуша:', sheetError);
                showToast('Маркетплейс додано, але не вдалося створити аркуш', 'warning');
            }
        }

        renderAllTables();
        modal.style.display = 'none';
        modal.querySelector('form').reset();

    } catch (error) {
        console.error('❌ Помилка додавання маркетплейсу:', error);
        showToast('Помилка додавання маркетплейсу', 'error');
    }
}