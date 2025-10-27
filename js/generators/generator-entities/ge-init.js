// js/generators/generator-entities/ge-init.js

import { dom } from './ge-dom.js';
import { fetchAllData } from './ge-data.js';
import { renderCategories, renderCharacteristics, renderOptions } from './ge-render.js';
import { initTabs } from './ge-tabs.js';
import { initEvents } from './ge-events.js';

/**
 * Ініціалізація DOM елементів
 */
function initDOM() {
    // Переініціалізуємо всі DOM елементи після завантаження HTML
    dom.tabs = document.querySelectorAll('.entities-tab');
    dom.tabPanes = document.querySelectorAll('.entities-tab-pane');
    dom.categoriesTbody = document.getElementById('categories-tbody');
    dom.characteristicsTbody = document.getElementById('characteristics-tbody');
    dom.optionsTbody = document.getElementById('options-tbody');
    dom.btnAddCategory = document.getElementById('btn-add-category');
    dom.btnAddCharacteristic = document.getElementById('btn-add-characteristic');
    dom.btnAddOption = document.getElementById('btn-add-option');
    dom.btnReload = document.getElementById('reload-section-entities');
    dom.authBtn = document.getElementById('auth-btn');
}

/**
 * Завантажує дані та рендерить таблиці
 */
async function loadData() {
    try {
        await fetchAllData();

        // Рендеримо всі вкладки
        renderCategories(dom.categoriesTbody);
        renderCharacteristics(dom.characteristicsTbody);
        renderOptions(dom.optionsTbody);

    } catch (error) {
        console.error('Помилка завантаження даних:', error);

        // Показуємо помилку в таблицях
        const errorMessage = `
            <tr>
                <td colspan="3" class="error-state">
                    <span class="material-symbols-outlined">error</span>
                    <p>Помилка завантаження даних</p>
                    <small>${error.message}</small>
                </td>
            </tr>
        `;

        dom.categoriesTbody.innerHTML = errorMessage;
        dom.characteristicsTbody.innerHTML = errorMessage.replace('colspan="3"', 'colspan="4"');
        dom.optionsTbody.innerHTML = errorMessage.replace('colspan="3"', 'colspan="4"');
    }
}

/**
 * Головна функція ініціалізації
 */
function init() {
    // Спочатку ініціалізуємо DOM
    initDOM();

    // Ініціалізуємо вкладки
    initTabs();

    // Ініціалізуємо обробники подій
    initEvents();

    // Завантажуємо дані
    const token = localStorage.getItem('google_auth_token');
    if (token) {
        loadData();
    } else {
        console.warn('⚠️ Користувач не авторизований');
        const notAuthMessage = `
            <tr>
                <td colspan="3" class="empty-state">
                    <span class="material-symbols-outlined">lock</span>
                    <p>Авторизуйтесь для доступу до даних</p>
                </td>
            </tr>
        `;

        dom.categoriesTbody.innerHTML = notAuthMessage;
        dom.characteristicsTbody.innerHTML = notAuthMessage.replace('colspan="3"', 'colspan="4"');
        dom.optionsTbody.innerHTML = notAuthMessage.replace('colspan="3"', 'colspan="4"');
    }

    console.log('✅ Generator Entities ініціалізовано');
}

// Запускаємо ініціалізацію після завантаження DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
