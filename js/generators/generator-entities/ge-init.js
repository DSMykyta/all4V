// js/generators/generator-entities/ge-init.js

import { initDOM, updateDynamicDOM } from './ge-dom.js';
import { fetchAllData } from './ge-data.js';
import { renderAllTables, showAuthRequiredState } from './ge-render.js';
import { initEvents } from './ge-events.js';
import { initFilters } from './ge-filters.js';
import { openMarketplacesAdminModal } from './ge-marketplaces-admin.js';

// ТИМЧАСОВИЙ ТЕСТ
window.testModalOpen = function() {
    console.log('🧪 TEST: Пряме відкриття модалу...');
    const modal = document.getElementById('modal-marketplaces-admin');
    console.log('🧪 TEST: Модал знайдено:', modal);
    if (modal) {
        modal.style.display = 'flex';
        console.log('🧪 TEST: Модал відкрито!');
    }
};


/**
 * Головна функція ініціалізації
 */
async function init() {
    console.log('🚀 Ініціалізація Generator Entities...');

    // Крок 1: Ініціалізуємо DOM елементи
    initDOM();

    // Крок 2: Ініціалізуємо обробники подій
    initEvents();

    // 🆕 Крок 2.5: Ініціалізація кнопки маркетплейсів
    initMarketplacesButton();

    // Крок 3: Чекаємо на ініціалізацію Google API (затримка 2 секунди)
    setTimeout(async () => {
        const token = localStorage.getItem('google_auth_token');
        
        if (token && typeof gapi !== 'undefined' && gapi.client) {
            console.log('✅ Токен знайдено, завантажуємо дані...');
            await loadEntitiesData();
        } else {
            console.warn('⚠️ Користувач не авторизований або gapi не готовий');
            showNotAuthorizedState();
        }
    }, 2000);

    // Крок 4: Слухаємо подію авторизації
    document.addEventListener('google-auth-success', async () => {
        console.log('🔐 Авторизація успішна, завантажуємо дані...');
        setTimeout(async () => {
            await loadEntitiesData();
        }, 500);
    });

    // Крок 5: Ініціалізуємо фільтри (після завантаження aside шаблону)
    setTimeout(() => {
        updateDynamicDOM();
        initFilters();
    }, 1500);

    console.log('✅ Generator Entities ініціалізовано');
}

// 🆕 ДОДАНО: Функція ініціалізації кнопки маркетплейсів
function initMarketplacesButton() {
    console.log('🔍 Початок ініціалізації кнопки маркетплейсів...');
    
    const btn = document.getElementById('btn-marketplaces-admin');
    
    console.log('🔍 Кнопка знайдена:', btn);
    
    if (!btn) {
        console.warn('⚠️ Кнопка #btn-marketplaces-admin не знайдена');
        return;
    }

    // Перевіряємо чи кнопка видима
    const styles = window.getComputedStyle(btn);
    console.log('🔍 Стилі кнопки:', {
        display: styles.display,
        visibility: styles.visibility,
        pointerEvents: styles.pointerEvents,
        opacity: styles.opacity
    });

    // Додаємо обробник
    btn.addEventListener('click', (event) => {
        console.log('🖱️ КЛІК ПО КНОПЦІ МАРКЕТПЛЕЙСІВ!', event);
        console.log('🔍 Event target:', event.target);
        console.log('🔍 Current target:', event.currentTarget);
        
        try {
            console.log('🔍 Викликаємо openMarketplacesAdminModal...');
            openMarketplacesAdminModal();
        } catch (error) {
            console.error('❌ ПОМИЛКА при виклику openMarketplacesAdminModal:', error);
        }
    }, true); // true = capture phase

    // Додаємо ще один обробник для перевірки
    btn.onclick = () => {
        console.log('🖱️ ONCLICK СПРАЦЮВАВ!');
    };

    console.log('✅ Кнопка маркетплейсів ініціалізована');
    console.log('🔍 Event listeners на кнопці:', getEventListeners ? getEventListeners(btn) : 'Неможливо перевірити');
}


/**
 * Завантажує дані сутностей з Google Sheets
 */
async function loadEntitiesData() {
    console.log('🔄 Завантаження даних сутностей...');

    try {
        // Перевіряємо чи gapi готовий
        if (typeof gapi === 'undefined' || !gapi.client) {
            console.warn('⚠️ Google API ще не ініціалізовано, чекаємо...');
            return;
        }

        await fetchAllData();
        renderAllTables();

        console.log('✅ Дані сутностей завантажено та відображено');

    } catch (error) {
        console.error('❌ Помилка завантаження даних сутностей:', error);
        showErrorState();
    }
}

/**
 * Показує стан "не авторизовано"
 */
function showNotAuthorizedState() {
    const categoriesTbody = document.getElementById('categories-tbody');
    const characteristicsTbody = document.getElementById('characteristics-tbody');
    const optionsTbody = document.getElementById('options-tbody');

    showAuthRequiredState(categoriesTbody, 7);
    showAuthRequiredState(characteristicsTbody, 9);
    showAuthRequiredState(optionsTbody, 6);
}

/**
 * Показує стан помилки
 */
function showErrorState() {
    const categoriesTbody = document.getElementById('categories-tbody');
    const characteristicsTbody = document.getElementById('characteristics-tbody');
    const optionsTbody = document.getElementById('options-tbody');

    const errorHTML = `
        <tr class="error-state">
            <td colspan="7" style="text-align: center; padding: 60px 20px;">
                <span class="material-symbols-outlined" style="font-size: 64px; display: block; margin-bottom: 16px; color: var(--error, red);">error</span>
                <h3 style="margin: 0 0 8px 0; font-size: 18px; color: var(--text-primary);">Помилка завантаження</h3>
                <p style="color: var(--text-secondary); margin: 0 0 20px 0;">Не вдалося завантажити дані з сервера</p>
                <button onclick="document.getElementById('btn-reload').click()" class="btn-primary">
                    <span class="material-symbols-outlined">refresh</span>
                    Спробувати знову
                </button>
            </td>
        </tr>
    `;

    if (categoriesTbody) categoriesTbody.innerHTML = errorHTML;
    if (characteristicsTbody) characteristicsTbody.innerHTML = errorHTML.replace('colspan="7"', 'colspan="9"');
    if (optionsTbody) optionsTbody.innerHTML = errorHTML.replace('colspan="7"', 'colspan="6"');
}

// Запускаємо ініціалізацію після завантаження DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
