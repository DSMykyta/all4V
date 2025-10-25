// js/generators/generator-entities/ge-init.js

import { getEntitiesDOM } from './ge-dom.js';
import { fetchAllData } from './ge-data.js';
import { renderCategories, renderCharacteristics, renderOptions } from './ge-render.js';
import { initTabs } from './ge-tabs.js';
import { initEventHandlers } from './ge-events.js';
import { initPanels } from './ge-panels.js';
import { loadHTML } from '../../common/util-loader.js';
import { isUserAuthorized } from '../../auth/google-auth.js';

/**
 * Ініціалізація Entities генератора
 * Викликається після ініціалізації core (включаючи авторизацію)
 */
async function initEntitiesGenerator() {
    console.log('🚀 Ініціалізація генератора Entities...');

    try {
        const dom = getEntitiesDOM();

        // 1. Завантажуємо aside панель
        const panelContent = document.getElementById('panel-right-content');
        if (panelContent) {
            await loadHTML('templates/aside/aside-entities.html', panelContent);
        }

        // 2. Ініціалізуємо панелі
        initPanels();

        // 3. Ініціалізуємо таби
        initTabs();

        // 4. Ініціалізуємо обробники подій
        initEventHandlers();

        // 5. Якщо вже авторизовані - завантажуємо дані
        if (isUserAuthorized()) {
            await loadEntitiesData();
        } else {
            console.log('ℹ️ Очікування авторизації для завантаження даних...');
            // Підписуємось на подію авторизації
            window.addEventListener('google-auth-success', loadEntitiesData);
        }

        console.log('✅ Генератор Entities ініціалізовано');

    } catch (error) {
        console.error('❌ Помилка ініціалізації генератора Entities:', error);
    }
}

/**
 * Завантажує дані сутностей
 */
async function loadEntitiesData() {
    console.log('📊 Завантаження даних сутностей...');
    
    const dom = getEntitiesDOM();
    
    try {
        await fetchAllData();

        renderCategories(dom.categoriesTbody);
        renderCharacteristics(dom.characteristicsTbody);
        renderOptions(dom.optionsTbody);

        console.log('✅ Дані сутностей завантажено');
    } catch (error) {
        console.error('❌ Помилка завантаження даних:', error);
    }
}

// Запускаємо після завантаження DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEntitiesGenerator);
} else {
    initEntitiesGenerator();
}
