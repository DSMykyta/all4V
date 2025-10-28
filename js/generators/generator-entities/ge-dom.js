// js/generators/generator-entities/ge-dom.js

export const dom = {
    // ═══════════════════════════════════════════════════════════════════════
    // ТАБИ
    // ═══════════════════════════════════════════════════════════════════════
    tabsContainer: null,
    tabButtons: null,
    tabContents: null,

    // ═══════════════════════════════════════════════════════════════════════
    // ТАБЛИЦІ (tbody)
    // ═══════════════════════════════════════════════════════════════════════
    categoriesTbody: null,
    characteristicsTbody: null,
    optionsTbody: null,
    // 🔴 ВИДАЛЕНО: marketplacesTbody: null,

    // ═══════════════════════════════════════════════════════════════════════
    // ЧЕКБОКСИ "ВИБРАТИ ВСІ"
    // ═══════════════════════════════════════════════════════════════════════
    selectAllCategories: null,
    selectAllCharacteristics: null,
    selectAllOptions: null,
    // 🔴 ВИДАЛЕНО: selectAllMarketplaces: null,

    // ═══════════════════════════════════════════════════════════════════════
    // КНОПКИ УПРАВЛІННЯ
    // ═══════════════════════════════════════════════════════════════════════
    btnAddEntity: null,
    btnReload: null,
    authBtn: null,

    // ═══════════════════════════════════════════════════════════════════════
    // ПРАВА ПАНЕЛЬ (фільтри, пошук)
    // ═══════════════════════════════════════════════════════════════════════
    panelRight: null,
    panelRightContent: null,
    searchInput: null,
    btnDeleteSelected: null,
    selectedCount: null,
};

/**
 * Ініціалізує всі DOM елементи
 */
export function initDOM() {
    // Таби
    dom.tabsContainer = document.querySelector('[data-tabs-container]');
    dom.tabButtons = document.querySelectorAll('[data-tab-target]');
    dom.tabContents = document.querySelectorAll('[data-tab-content]');

    // Таблиці
    dom.categoriesTbody = document.getElementById('categories-tbody');
    dom.characteristicsTbody = document.getElementById('characteristics-tbody');
    dom.optionsTbody = document.getElementById('options-tbody');
    // 🔴 ВИДАЛЕНО: dom.marketplacesTbody = document.getElementById('marketplaces-tbody');

    // Чекбокси
    dom.selectAllCategories = document.getElementById('select-all-categories');
    dom.selectAllCharacteristics = document.getElementById('select-all-characteristics');
    dom.selectAllOptions = document.getElementById('select-all-options');
    // 🔴 ВИДАЛЕНО: dom.selectAllMarketplaces = document.getElementById('select-all-marketplaces');

    // Кнопки
    dom.btnAddEntity = document.getElementById('btn-add-entity');
    dom.btnReload = document.getElementById('btn-reload');
    dom.authBtn = document.getElementById('auth-btn');

    // Права панель
    dom.panelRight = document.getElementById('panel-right');
    dom.panelRightContent = document.getElementById('panel-right-content');

    // Ініціалізація табів
    initTabs();

    console.log('✅ DOM елементи сутностей ініціалізовано:', {
        tabs: dom.tabButtons?.length || 0,
        tabContents: dom.tabContents?.length || 0,
        tables: [
            dom.categoriesTbody ? '✓' : '✗',
            dom.characteristicsTbody ? '✓' : '✗',
            dom.optionsTbody ? '✓' : '✗'
            // 🔴 ВИДАЛЕНО: dom.marketplacesTbody ? '✓' : '✗'
        ],
        buttons: [
            dom.btnAddEntity ? '✓' : '✗',
            dom.btnReload ? '✓' : '✗'
        ]
    });
}

/**
 * Ініціалізація системи табів
 */
function initTabs() {
    if (!dom.tabButtons) return;

    dom.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tabTarget;
            
            // Оновлюємо активний таб
            dom.tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Показуємо відповідний контент
            dom.tabContents.forEach(content => {
                if (content.dataset.tabContent === targetTab) {
                    content.classList.add('is-active');
                } else {
                    content.classList.remove('is-active');
                }
            });

            console.log(`🔄 Переключено на таб: ${targetTab}`);
        });
    });
}

/**
 * Оновлює посилання на динамічні елементи
 */
export function updateDynamicDOM() {
    dom.searchInput = document.getElementById('search-input');
    dom.btnDeleteSelected = document.getElementById('btn-delete-selected');
    dom.selectedCount = document.getElementById('selected-count');

    console.log('✅ Динамічні DOM елементи оновлено:', {
        searchInput: dom.searchInput ? '✓' : '✗',
        btnDeleteSelected: dom.btnDeleteSelected ? '✓' : '✗',
        selectedCount: dom.selectedCount ? '✓' : '✗'
    });
}

/**
 * Отримує поточний активний таб
 */
export function getActiveTab() {
    const activeButton = document.querySelector('[data-tab-target].active');
    return activeButton?.dataset.tabTarget || 'categories';
}

/**
 * Отримує tbody поточного активного табу
 */
export function getActiveTbody() {
    const activeTab = getActiveTab();
    
    switch (activeTab) {
        case 'categories':
            return dom.categoriesTbody;
        case 'characteristics':
            return dom.characteristicsTbody;
        case 'options':
            return dom.optionsTbody;
        // 🔴 ВИДАЛЕНО: case 'marketplaces':
        default:
            return dom.categoriesTbody;
    }
}

/**
 * Отримує назву аркуша для поточного табу
 */
export function getActiveSheetName() {
    const activeTab = getActiveTab();
    
    switch (activeTab) {
        case 'categories':
            return 'Categories';
        case 'characteristics':
            return 'Characteristics';
        case 'options':
            return 'Options';
        // 🔴 ВИДАЛЕНО: case 'marketplaces':
        default:
            return 'Categories';
    }
}

export function getEntitiesDOM() {
    return dom;
}
