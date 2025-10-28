// js/generators/generator-entities/ge-marketplaces-admin.js

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║           АДМІН-ПАНЕЛЬ КЕРУВАННЯ МАРКЕТПЛЕЙСАМИ                          ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

import { getMarketplacesData, createMarketplaceSheet } from './ge-data.js';
import { showToast } from '../../common/ui-toast.js';

let currentMarketplacesData = [];
let hasUnsavedChanges = false;

const SPREADSHEET_ID = '1iFOCQUbisLprSfIkfCar3Oc5f8JW12kA0dpHzjEXSsk';
const MARKETPLACE_HEADERS = ['marketplace_id', 'display_name', 'icon_svg', 'primary_color'];

/**
 * Відкриває модал адмін-панелі маркетплейсів
 */
export function openMarketplacesAdminModal() {
    console.log('🔥 openMarketplacesAdminModal викликано!');

    const modal = document.getElementById('modal-marketplaces-admin');
    
    if (!modal) {
        console.error('❌ Модал #modal-marketplaces-admin не знайдено в DOM');
        alert('Модал не знайдено! Перевірте HTML.');
        return;
    }

    // Копіюємо поточні дані маркетплейсів
    const rawData = getMarketplacesData();
    currentMarketplacesData = JSON.parse(JSON.stringify(rawData));
    
    console.log('📦 Завантажено маркетплейсів:', currentMarketplacesData.length);

    // Рендеримо таблицю
    renderMarketplacesTable();

    // Показуємо модал
    modal.style.display = 'flex';

    // Обробники подій
    initModalEventListeners(modal);

    console.log('✅ Модал адмін-панелі маркетплейсів відкрито');
}

/**
 * Ініціалізує обробники подій модалу
 */
function initModalEventListeners(modal) {
    // Закриття модалу
    const closeButtons = modal.querySelectorAll('[data-modal-close]');
    closeButtons.forEach(btn => {
        btn.onclick = () => {
            console.log('🚪 Закриття модалу...');
            closeModal(modal);
        };
    });

    // Закриття по оверлею
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
        overlay.onclick = () => {
            console.log('🚪 Закриття модалу через overlay...');
            closeModal(modal);
        };
    }

    // Кнопка "Додати"
    const btnAdd = document.getElementById('btn-add-marketplace-row');
    if (btnAdd) {
        btnAdd.onclick = addMarketplaceRow;
    }

    // Кнопка "Зберегти"
    const btnSave = document.getElementById('btn-save-marketplaces');
    if (btnSave) {
        btnSave.onclick = saveMarketplaces;
    }
}

/**
 * Закриває модал
 */
function closeModal(modal) {
    if (hasUnsavedChanges) {
        const confirm = window.confirm('Є незбережені зміни. Ви впевнені, що хочете закрити?');
        if (!confirm) return;
    }

    modal.style.display = 'none';
    hasUnsavedChanges = false;
    updateSaveButtonState();
}

/**
 * Рендерить таблицю маркетплейсів
 */
function renderMarketplacesTable() {
    const tbody = document.querySelector('#marketplaces-admin-table tbody');
    if (!tbody) {
        console.error('❌ tbody для таблиці маркетплейсів не знайдено');
        return;
    }

    tbody.innerHTML = '';

    if (currentMarketplacesData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    Немає маркетплейсів. Натисніть "Додати Маркетплейс" щоб створити.
                </td>
            </tr>
        `;
        return;
    }

    currentMarketplacesData.forEach((item, index) => {
        const tr = document.createElement('tr');
        tr.dataset.index = index;

        tr.innerHTML = `
            <td>
                <input type="text" 
                       class="input-main" 
                       value="${escapeHtml(item.marketplace_id)}" 
                       data-field="marketplace_id" 
                       placeholder="rozetka" 
                       required
                       style="width: 100%;">
            </td>
            <td>
                <input type="text" 
                       class="input-main" 
                       value="${escapeHtml(item.display_name)}" 
                       data-field="display_name" 
                       placeholder="Розетка" 
                       required
                       style="width: 100%;">
            </td>
            <td>
                <input type="text" 
                       class="input-main" 
                       value="${escapeHtml(item.icon_svg || '')}" 
                       data-field="icon_svg" 
                       placeholder="<svg>..."
                       style="width: 100%;">
            </td>
            <td>
                <input type="text" 
                       class="input-main" 
                       value="${escapeHtml(item.primary_color || '')}" 
                       data-field="primary_color" 
                       placeholder="#FF0000"
                       style="width: 100%;">
            </td>
            <td style="text-align: center;">
                <label style="display: flex; align-items: center; gap: 4px; justify-content: center;">
                    <input type="checkbox" 
                           data-field="create_sheet" 
                           ${item._createSheet ? 'checked' : ''}>
                    <span style="font-size: 12px;">Створити аркуш</span>
                </label>
            </td>
            <td style="text-align: center;">
                <button class="btn-icon btn-delete-row" title="Видалити" data-index="${index}">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </td>
        `;

        tbody.appendChild(tr);
    });

    // Додаємо обробники подій
    attachTableEventListeners(tbody);

    console.log(`✅ Таблиця маркетплейсів відрендерена: ${currentMarketplacesData.length} записів`);
}

/**
 * Додає обробники подій до таблиці
 */
function attachTableEventListeners(tbody) {
    // Обробка змін в input полях
    tbody.addEventListener('input', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') {
            const tr = e.target.closest('tr');
            const index = parseInt(tr.dataset.index);
            const field = e.target.dataset.field;
            const value = e.target.value;

            updateMarketplaceData(index, field, value);
        }
    });

    // Обробка чекбоксів
    tbody.addEventListener('change', (e) => {
        if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            const tr = e.target.closest('tr');
            const index = parseInt(tr.dataset.index);
            const field = e.target.dataset.field;
            const value = e.target.checked;

            if (field === 'create_sheet') {
                currentMarketplacesData[index]._createSheet = value;
                setUnsavedChanges();
            }
        }
    });

    // Обробка кнопок видалення
    tbody.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-delete-row');
        if (deleteBtn) {
            const index = parseInt(deleteBtn.dataset.index);
            deleteMarketplaceRow(index);
        }
    });
}

/**
 * Оновлює дані маркетплейсу
 */
function updateMarketplaceData(index, field, value) {
    if (currentMarketplacesData[index][field] !== value) {
        currentMarketplacesData[index][field] = value;
        setUnsavedChanges();
    }
}

/**
 * Додає новий рядок маркетплейсу
 */
function addMarketplaceRow() {
    console.log('➕ Додавання нового рядка маркетплейсу...');

    currentMarketplacesData.push({
        marketplace_id: '',
        display_name: '',
        icon_svg: '',
        primary_color: '',
        _createSheet: false
    });

    setUnsavedChanges();
    renderMarketplacesTable();

    // Фокус на перше поле нового рядка
    const tbody = document.querySelector('#marketplaces-admin-table tbody');
    const newRow = tbody.querySelector('tr:last-child input[data-field="marketplace_id"]');
    if (newRow) newRow.focus();

    console.log('✅ Новий рядок додано');
}

/**
 * Видаляє рядок маркетплейсу
 */
function deleteMarketplaceRow(index) {
    const marketplace = currentMarketplacesData[index];
    const confirmMsg = marketplace.marketplace_id 
        ? `Видалити маркетплейс "${marketplace.marketplace_id}"?`
        : 'Видалити порожній рядок?';

    if (!confirm(confirmMsg)) return;

    currentMarketplacesData.splice(index, 1);
    setUnsavedChanges();
    renderMarketplacesTable();

    console.log(`🗑️ Видалено маркетплейс на індексі ${index}`);
}

/**
 * Зберігає маркетплейси
 */
async function saveMarketplaces() {
    console.log('💾 Збереження маркетплейсів...');

    if (!hasUnsavedChanges) {
        console.log('⚠️ Немає незбережених змін');
        return;
    }

    // Валідація
    if (!validateMarketplaces()) {
        showToast('Заповніть всі обов\'язкові поля', 'error');
        return;
    }

    const btnSave = document.getElementById('btn-save-marketplaces');
    btnSave.disabled = true;
    btnSave.innerHTML = '<span class="material-symbols-outlined">hourglass_empty</span> Збереження...';

    try {
        // Підготовка даних для збереження (без _createSheet)
        const dataToSave = currentMarketplacesData.map(mp => {
            const { _createSheet, _rowIndex, ...cleanData } = mp;
            return cleanData;
        });

        // Перезаписуємо аркуш Marketplaces
        await rewriteMarketplacesSheet(dataToSave);

        showToast('Маркетплейси успішно збережено', 'success');

        // Створюємо аркуші для нових маркетплейсів (якщо потрібно)
        await createSheetsForMarketplaces();

        hasUnsavedChanges = false;
        updateSaveButtonState();

        console.log('✅ Збереження завершено');

        // Закриваємо модал
        setTimeout(() => {
            const modal = document.getElementById('modal-marketplaces-admin');
            modal.style.display = 'none';
        }, 1000);

    } catch (error) {
        console.error('❌ Помилка збереження маркетплейсів:', error);
        showToast('Помилка збереження: ' + error.message, 'error');
    } finally {
        btnSave.disabled = false;
        btnSave.innerHTML = '<span class="material-symbols-outlined">save</span> Зберегти';
    }
}

/**
 * Перезаписує аркуш Marketplaces
 */
async function rewriteMarketplacesSheet(data) {
    const token = gapi.client.getToken()?.access_token;
    if (!token) throw new Error('Немає токена авторизації');

    console.log('📝 Перезаписуємо аркуш Marketplaces...');

    // Формуємо дані з заголовками
    const values = [
        MARKETPLACE_HEADERS,
        ...data.map(mp => [
            mp.marketplace_id,
            mp.display_name,
            mp.icon_svg || '',
            mp.primary_color || ''
        ])
    ];

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Marketplaces!A1:Z?valueInputOption=RAW`;

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Помилка збереження: ${response.status} - ${errorText}`);
    }

    console.log('✅ Аркуш Marketplaces перезаписано');
}

/**
 * Створює аркуші для маркетплейсів
 */
async function createSheetsForMarketplaces() {
    const toCreate = currentMarketplacesData.filter(mp => mp._createSheet && mp.marketplace_id);

    if (toCreate.length === 0) {
        console.log('ℹ️ Немає маркетплейсів для створення аркушів');
        return;
    }

    console.log(`📄 Створення ${toCreate.length} аркушів...`);

    for (const mp of toCreate) {
        try {
            const { sheetTitle } = await createMarketplaceSheet(mp.marketplace_id);
            showToast(`Аркуш "${sheetTitle}" створено`, 'success');
            console.log(`✅ Аркуш ${sheetTitle} створено`);
        } catch (error) {
            console.error(`❌ Помилка створення аркуша для ${mp.marketplace_id}:`, error);
            showToast(`Не вдалося створити аркуш для ${mp.marketplace_id}`, 'error');
        }
    }
}

/**
 * Валідує маркетплейси
 */
function validateMarketplaces() {
    for (const mp of currentMarketplacesData) {
        if (!mp.marketplace_id || !mp.display_name) {
            console.error('❌ Валідація не пройдена:', mp);
            return false;
        }
    }
    console.log('✅ Валідація пройдена');
    return true;
}

/**
 * Встановлює прапорець незбережених змін
 */
function setUnsavedChanges() {
    hasUnsavedChanges = true;
    updateSaveButtonState();
}

/**
 * Оновлює стан кнопки "Зберегти"
 */
function updateSaveButtonState() {
    const btnSave = document.getElementById('btn-save-marketplaces');
    if (btnSave) {
        btnSave.disabled = !hasUnsavedChanges;
    }

    const status = document.getElementById('marketplaces-status');
    if (status) {
        if (hasUnsavedChanges) {
            status.innerHTML = '<span class="material-symbols-outlined">warning</span> Є незбережені зміни';
            status.style.color = 'var(--warning, orange)';
        } else {
            status.innerHTML = '<span class="material-symbols-outlined">info</span> Редагуйте дані прямо в таблиці';
            status.style.color = 'var(--text-secondary)';
        }
    }
}

/**
 * Екранує HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}
