// js/generators/generator-translate/gtr-main.js
import { registerPanelInitializer } from '../../panel/panel-right.js';
import { initTranslateReset } from './gtr-reset.js'; // Імпортуємо нашу функцію

/**
 * Головна функція ініціалізації для модуля Перекладу.
 * Вона викликається автоматично після завантаження aside-translate.html.
 */
function initTranslateGenerator() {
    // Просто запускаємо ініціалізацію кнопки "Оновити"
    initTranslateReset();
    console.log('Модуль Перекладу ініціалізовано.');
}

// Реєструємо наш запускач в системі правої панелі
registerPanelInitializer('aside-translate', initTranslateGenerator);