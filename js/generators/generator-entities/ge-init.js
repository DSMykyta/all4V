// js/generators/generator-entities/ge-init.js

import { dom } from './ge-dom.js';
import { fetchAllData } from './ge-data.js';
import { renderCategories, renderCharacteristics, renderOptions } from './ge-render.js';
import { initTabs } from './ge-tabs.js';
import { initEvents } from './ge-events.js';

/**
 * Завантажує та відображає дані сутностей
 */
async function loadEntitiesData() {
    try {
        await fetchAllData();

        renderCategories(dom.categoriesTbody);
        renderCharacteristics(dom.characteristicsTbody);
        renderOptions(dom.optionsTbody);

        console.log('✅ Дані сутностей завантажено та відображено');
    } catch (error) {
        console.error('Помилка завантаження даних сутностей:', error);

        // Показуємо помилку в таблицях
        const errorMessage = `
            <tr>
                <td colspan="4" class="error-state">
                    <span class="material-symbols-outlined">error</span>
                    <p>Помилка завантаження даних</p>
                    <small>${error.message}</small>
                </td>
            </tr>
        `;

        dom.categoriesTbody.innerHTML = errorMessage;
        dom.characteristicsTbody.innerHTML = errorMessage;
        dom.optionsTbody.innerHTML = errorMessage;
    }
}

/**
 * Головна функція ініціалізації
 */
function init() {
    // Ініціалізуємо вкладки
    initTabs();

    // Ініціалізуємо обробники подій
    initEvents();

    // Перевіряємо авторизацію
    const token = localStorage.getItem('google_auth_token');
    if (token) {
        // Якщо вже авторизовані, завантажуємо дані
        loadEntitiesData();
    }

    // Слухаємо подію успішної авторизації
    document.addEventListener('google-auth-success', () => {
        console.log('🔐 Авторизовано, завантажуємо дані сутностей...');
        loadEntitiesData();
    });

    // Слухаємо подію виходу
    document.addEventListener('google-auth-signout', () => {
        console.log('🚪 Вихід, очищуємо дані сутностей...');

        // Очищуємо таблиці
        const notAuthMessage = `
            <tr>
                <td colspan="4" class="empty-state">
                    <span class="material-symbols-outlined">lock</span>
                    <p>Авторизуйтесь для перегляду даних</p>
                </td>
            </tr>
        `;

        dom.categoriesTbody.innerHTML = notAuthMessage;
        dom.characteristicsTbody.innerHTML = notAuthMessage;
        dom.optionsTbody.innerHTML = notAuthMessage;
    });
}

// Запускаємо ініціалізацію
init();
