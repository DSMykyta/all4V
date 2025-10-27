// js/generators/generator-entities/ge-modal.js

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                   МОДАЛЬНІ ВІКНА ДЛЯ СУТНОСТЕЙ                           ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * Відповідає за:
 * - Створення форм для додавання нових сутностей
 * - Редагування існуючих сутностей
 * - Валідацію даних форм
 */

import { addEntity, updateEntity, getEntityById } from './ge-data.js';
import { renderAllTables } from './ge-render.js';
import { showToast } from '../../common/ui-toast.js';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * МОДАЛЬНЕ ВІКНО ДЛЯ КАТЕГОРІЙ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Відкриває модальне вікно для додавання категорії
 */
export function openAddCategoryModal() {
    const modal = createModal('Додати категорію', getCategoryFormHTML(), async (formData) => {
        try {
            const values = [
                formData.local_id,
                formData.parent_local_id,
                formData.name_uk,
                formData.name_ru,
                formData.category_type
            ];

            await addEntity('Categories', values);
            renderAllTables();
            showToast('✅ Категорію успішно додано', 'success');
            
        } catch (error) {
            console.error('❌ Помилка додавання категорії:', error);
            showToast('❌ Помилка додавання категорії', 'error');
            throw error;
        }
    });

    showModal(modal);
}

/**
 * Відкриває модальне вікно для редагування категорії
 */
export function openEditCategoryModal(id) {
    const category = getEntityById('categories', id);
    
    if (!category) {
        showToast('❌ Категорію не знайдено', 'error');
        return;
    }

    const modal = createModal('Редагувати категорію', getCategoryFormHTML(category), async (formData) => {
        try {
            const values = [
                formData.local_id,
                formData.parent_local_id,
                formData.name_uk,
                formData.name_ru,
                formData.category_type
            ];

            await updateEntity('Categories', category._rowIndex, values);
            renderAllTables();
            showToast('✅ Категорію успішно оновлено', 'success');
            
        } catch (error) {
            console.error('❌ Помилка оновлення категорії:', error);
            showToast('❌ Помилка оновлення категорії', 'error');
            throw error;
        }
    });

    showModal(modal);
}

/**
 * Генерує HTML форми для категорії
 */
function getCategoryFormHTML(data = {}) {
    return `
        <div class="form-group">
            <label for="modal-local-id">ID категорії *</label>
            <input type="text" id="modal-local-id" name="local_id" 
                   class="input-main" placeholder="cat_protein" 
                   value="${data.local_id || ''}" required>
        </div>

        <div class="form-group">
            <label for="modal-parent-local-id">Батьківська категорія</label>
            <input type="text" id="modal-parent-local-id" name="parent_local_id" 
                   class="input-main" placeholder="cat_main" 
                   value="${data.parent_local_id || ''}">
        </div>

        <div class="form-group">
            <label for="modal-name-uk">Назва (українська) *</label>
            <input type="text" id="modal-name-uk" name="name_uk" 
                   class="input-main" placeholder="Протеїн" 
                   value="${data.name_uk || ''}" required>
        </div>

        <div class="form-group">
            <label for="modal-name-ru">Назва (російська) *</label>
            <input type="text" id="modal-name-ru" name="name_ru" 
                   class="input-main" placeholder="Протеин" 
                   value="${data.name_ru || ''}" required>
        </div>

        <div class="form-group">
            <label for="modal-category-type">Тип категорії</label>
            <select id="modal-category-type" name="category_type" class="input-main">
                <option value="">-- Оберіть тип --</option>
                <option value="main" ${data.category_type === 'main' ? 'selected' : ''}>Головна</option>
                <option value="sub" ${data.category_type === 'sub' ? 'selected' : ''}>Підкатегорія</option>
                <option value="filter" ${data.category_type === 'filter' ? 'selected' : ''}>Фільтр</option>
            </select>
        </div>
    `;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * МОДАЛЬНЕ ВІКНО ДЛЯ ХАРАКТЕРИСТИК
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Відкриває модальне вікно для додавання характеристики
 */
export function openAddCharacteristicModal() {
    const modal = createModal('Додати характеристику', getCharacteristicFormHTML(), async (formData) => {
        try {
            const values = [
                formData.local_id,
                formData.name_uk,
                formData.name_ru,
                formData.param_type,
                formData.unit,
                formData.filter_type,
                formData.is_global,
                formData.notes
            ];

            await addEntity('Characteristics', values);
            renderAllTables();
            showToast('✅ Характеристику успішно додано', 'success');
            
        } catch (error) {
            console.error('❌ Помилка додавання характеристики:', error);
            showToast('❌ Помилка додавання характеристики', 'error');
            throw error;
        }
    });

    showModal(modal);
}

/**
 * Відкриває модальне вікно для редагування характеристики
 */
export function openEditCharacteristicModal(id) {
    const characteristic = getEntityById('characteristics', id);
    
    if (!characteristic) {
        showToast('❌ Характеристику не знайдено', 'error');
        return;
    }

    const modal = createModal('Редагувати характеристику', getCharacteristicFormHTML(characteristic), async (formData) => {
        try {
            const values = [
                formData.local_id,
                formData.name_uk,
                formData.name_ru,
                formData.param_type,
                formData.unit,
                formData.filter_type,
                formData.is_global,
                formData.notes
            ];

            await updateEntity('Characteristics', characteristic._rowIndex, values);
            renderAllTables();
            showToast('✅ Характеристику успішно оновлено', 'success');
            
        } catch (error) {
            console.error('❌ Помилка оновлення характеристики:', error);
            showToast('❌ Помилка оновлення характеристики', 'error');
            throw error;
        }
    });

    showModal(modal);
}

/**
 * Генерує HTML форми для характеристики
 */
function getCharacteristicFormHTML(data = {}) {
    return `
        <div class="form-group">
            <label for="modal-local-id">ID характеристики *</label>
            <input type="text" id="modal-local-id" name="local_id" 
                   class="input-main" placeholder="char_weight" 
                   value="${data.local_id || ''}" required>
        </div>

        <div class="form-group">
            <label for="modal-name-uk">Назва (українська) *</label>
            <input type="text" id="modal-name-uk" name="name_uk" 
                   class="input-main" placeholder="Вага" 
                   value="${data.name_uk || ''}" required>
        </div>

        <div class="form-group">
            <label for="modal-name-ru">Назва (російська) *</label>
            <input type="text" id="modal-name-ru" name="name_ru" 
                   class="input-main" placeholder="Вес" 
                   value="${data.name_ru || ''}" required>
        </div>

        <div class="form-group">
            <label for="modal-param-type">Тип параметра</label>
            <select id="modal-param-type" name="param_type" class="input-main">
                <option value="">-- Оберіть тип --</option>
                <option value="text" ${data.param_type === 'text' ? 'selected' : ''}>Текст</option>
                <option value="number" ${data.param_type === 'number' ? 'selected' : ''}>Число</option>
                <option value="select" ${data.param_type === 'select' ? 'selected' : ''}>Вибір (select)</option>
                <option value="multiselect" ${data.param_type === 'multiselect' ? 'selected' : ''}>Мультивибір</option>
            </select>
        </div>

        <div class="form-group">
            <label for="modal-unit">Одиниця виміру</label>
            <input type="text" id="modal-unit" name="unit" 
                   class="input-main" placeholder="кг, мл, шт" 
                   value="${data.unit || ''}">
        </div>

        <div class="form-group">
            <label for="modal-filter-type">Тип фільтра</label>
            <select id="modal-filter-type" name="filter_type" class="input-main">
                <option value="">-- Оберіть тип --</option>
                <option value="checkbox" ${data.filter_type === 'checkbox' ? 'selected' : ''}>Чекбокси</option>
                <option value="range" ${data.filter_type === 'range' ? 'selected' : ''}>Діапазон</option>
                <option value="none" ${data.filter_type === 'none' ? 'selected' : ''}>Без фільтра</option>
            </select>
        </div>

        <div class="form-group">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                <input type="checkbox" id="modal-is-global" name="is_global" 
                       ${data.is_global === 'true' || data.is_global === true ? 'checked' : ''}>
                <span>Глобальна характеристика</span>
            </label>
        </div>

        <div class="form-group">
            <label for="modal-notes">Примітки</label>
            <textarea id="modal-notes" name="notes" class="input-main" 
                      rows="3" placeholder="Додаткова інформація...">${data.notes || ''}</textarea>
        </div>
    `;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * МОДАЛЬНЕ ВІКНО ДЛЯ ОПЦІЙ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Відкриває модальне вікно для додавання опції
 */
export function openAddOptionModal() {
    const modal = createModal('Додати опцію', getOptionFormHTML(), async (formData) => {
        try {
            const values = [
                formData.local_id,
                formData.char_local_id,
                formData.name_uk,
                formData.name_ru
            ];

            await addEntity('Options', values);
            renderAllTables();
            showToast('✅ Опцію успішно додано', 'success');
            
        } catch (error) {
            console.error('❌ Помилка додавання опції:', error);
            showToast('❌ Помилка додавання опції', 'error');
            throw error;
        }
    });

    showModal(modal);
}

/**
 * Відкриває модальне вікно для редагування опції
 */
export function openEditOptionModal(id) {
    const option = getEntityById('options', id);
    
    if (!option) {
        showToast('❌ Опцію не знайдено', 'error');
        return;
    }

    const modal = createModal('Редагувати опцію', getOptionFormHTML(option), async (formData) => {
        try {
            const values = [
                formData.local_id,
                formData.char_local_id,
                formData.name_uk,
                formData.name_ru
            ];

            await updateEntity('Options', option._rowIndex, values);
            renderAllTables();
            showToast('✅ Опцію успішно оновлено', 'success');
            
        } catch (error) {
            console.error('❌ Помилка оновлення опції:', error);
            showToast('❌ Помилка оновлення опції', 'error');
            throw error;
        }
    });

    showModal(modal);
}

/**
 * Генерує HTML форми для опції
 */
function getOptionFormHTML(data = {}) {
    return `
        <div class="form-group">
            <label for="modal-local-id">ID опції *</label>
            <input type="text" id="modal-local-id" name="local_id" 
                   class="input-main" placeholder="opt_vanilla" 
                   value="${data.local_id || ''}" required>
        </div>

        <div class="form-group">
            <label for="modal-char-local-id">ID характеристики *</label>
            <input type="text" id="modal-char-local-id" name="char_local_id" 
                   class="input-main" placeholder="char_flavor" 
                   value="${data.char_local_id || ''}" required>
        </div>

        <div class="form-group">
            <label for="modal-name-uk">Назва (українська) *</label>
            <input type="text" id="modal-name-uk" name="name_uk" 
                   class="input-main" placeholder="Ваніль" 
                   value="${data.name_uk || ''}" required>
        </div>

        <div class="form-group">
            <label for="modal-name-ru">Назва (російська) *</label>
            <input type="text" id="modal-name-ru" name="name_ru" 
                   class="input-main" placeholder="Ваниль" 
                   value="${data.name_ru || ''}" required>
        </div>
    `;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ДОПОМІЖНІ ФУНКЦІЇ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Створює модальне вікно з формою
 */
function createModal(title, formHTML, onSubmit) {
    const modalId = `modal-entity-${Date.now()}`;
    
    const modalHTML = `
        <div id="${modalId}" class="modal">
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="btn-icon modal-close" aria-label="Закрити">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="${modalId}-form">
                        ${formHTML}
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-secondary modal-close">Скасувати</button>
                    <button type="submit" form="${modalId}-form" class="btn-primary">Зберегти</button>
                </div>
            </div>
        </div>
    `;

    // Додаємо модалку в body
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    const modal = tempDiv.firstElementChild;
    document.body.appendChild(modal);

    // Обробник відправки форми
    const form = modal.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            // Для чекбоксів
            if (form.elements[key].type === 'checkbox') {
                data[key] = form.elements[key].checked ? 'true' : 'false';
            } else {
                data[key] = value;
            }
        }

        try {
            await onSubmit(data);
            closeModal(modal);
        } catch (error) {
            console.error('Помилка обробки форми:', error);
        }
    });

    // Обробники закриття
    modal.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
        el.addEventListener('click', () => closeModal(modal));
    });

    return modal;
}

/**
 * Показує модальне вікно
 */
function showModal(modal) {
    setTimeout(() => modal.classList.add('is-active'), 10);
}

/**
 * Закриває та видаляє модальне вікно
 */
function closeModal(modal) {
    modal.classList.remove('is-active');
    setTimeout(() => modal.remove(), 300);
}
