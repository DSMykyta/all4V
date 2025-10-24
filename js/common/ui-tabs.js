// js/common/ui-tabs.js

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                      ГЛОБАЛЬНИЙ ОБРОБНИК ВКЛАДОК                         ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * * ПРИЗНАЧЕННЯ:
 * Керує логікою перемикання вкладок (табів).
 * * * ЯК ЦЕ ПРАЦЮЄ:
 * 1. Шукає контейнер з атрибутом `data-tabs-container`.
 * 2. Всередині нього знаходить кнопки-тригери з `data-tab-target="tab-id"`.
 * 3. Також знаходить панелі контенту з `data-tab-content="tab-id"`.
 * 4. При кліку на тригер, ховає всі панелі та показує потрібну.
 * 5. Перша вкладка активується за замовчуванням.
 */

/**
 * Ініціалізує вкладки всередині заданого контейнера.
 * @param {HTMLElement} container - DOM-елемент, в якому шукати вкладки (за замовчуванням document).
 */
export function initTabs(container = document) {
    const tabContainers = container.querySelectorAll('[data-tabs-container]');

    tabContainers.forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('[data-tab-target]');
        const tabContents = tabContainer.querySelectorAll('[data-tab-content]');

        if (tabs.length === 0) return;

        // Активуємо першу вкладку за замовчуванням
        activateTab(tabs[0], tabContents);

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                activateTab(tab, tabContents);
            });
        });
    });
}

/**
 * Активує вибрану вкладку та її контент.
 * @param {HTMLElement} selectedTab - Елемент вкладки, яку натиснули.
 * @param {NodeListOf<HTMLElement>} allContents - Колекція всіх панелей контенту.
 */
function activateTab(selectedTab, allContents) {
    const targetId = selectedTab.dataset.tabTarget;
    const targetContent = document.querySelector(`[data-tab-content="${targetId}"]`);

    // Деактивуємо всі вкладки та контент
    selectedTab.parentElement.querySelectorAll('[data-tab-target]').forEach(t => t.classList.remove('active'));
    allContents.forEach(content => content.classList.remove('is-active'));

    // Активуємо потрібні
    selectedTab.classList.add('active');
    if (targetContent) {
        targetContent.classList.add('is-active');
    }
}