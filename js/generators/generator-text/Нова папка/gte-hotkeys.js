// js/generators/generator-text/gte-hotkeys.js

/**
 * Ініціалізує гарячі клавіші для текстового редактора.
 */
export function initHotkeys() {
    const textArea = document.getElementById('input-text-markup');
    if (!textArea) return;

    textArea.addEventListener('keydown', (e) => {
        // Обробка Ctrl + B для жирного тексту
        if (e.ctrlKey && e.key.toLowerCase() === 'b') {
            e.preventDefault(); // Завжди зупиняємо стандартну дію браузера

            // Динамічно імпортуємо потрібні модулі, тільки коли вони потрібні
            Promise.all([
                import('./gte-actions.js'),
                import('./gte-stats.js')
            ]).then(([actionsModule, statsModule]) => {
                
                // Викликаємо ту саму функцію, що й кнопка на панелі
                actionsModule.wrapSelectionWithTag('strong', textArea);
                
                // Примусово оновлюємо статистику
                statsModule.forceStatsUpdate();
            });
        }
    });
}