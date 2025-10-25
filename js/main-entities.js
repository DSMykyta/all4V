// js/main-entities.js
import { initCore } from './main-core.js';

// Імпортуємо головний файл генератора entities
import './generators/generator-entities/ge-init.js';

async function initializeApp() {
    try {
        console.log('Ініціалізація сторінки Entities...');
        initCore(); // Ініціалізуємо core (включаючи авторизацію)
        console.log('Сторінка Entities успішно ініціалізована.');
    } catch (error) {
        console.error('Критична помилка під час ініціалізації:', error);
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
