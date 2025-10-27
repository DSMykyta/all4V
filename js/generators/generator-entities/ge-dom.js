// js/generators/generator-entities/ge-dom.js

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                   КЕШУВАННЯ DOM ЕЛЕМЕНТІВ СУТНОСТЕЙ                      ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * Зберігає посилання на всі DOM елементи для швидкого доступу.
 * Викликається один раз при ініціалізації.
 */

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

    // ═══════════════════════════════════════════════════════════════════════
    // ЧЕКБОКСИ "ВИБРАТИ ВСІ"
    // ═══════════════════════════════════════════════════════════════════════
    selectAllCategories: null,
    selectAllCharacteristics: null,
    selectAllOptions: null,

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
 * Викликається після завантаження DOM
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

    // Чекбокси
    dom.selectAllCategories = document.getElementById('select-all-categories');
    dom.selectAllCharacteristics = document.getElementById('select-all-characteristics');
    dom.selectAllOptions = document.getElementById('select-all-options');

    // Кнопки
    dom.btnAddEntity = document.getElementById('btn-add-entity');
    dom.btnReload = document.getElementById('btn-reload');
    dom.authBtn = document.getElementById('auth-btn');

    // Права панель
    dom.panelRight = document.getElementById('panel-right');
    dom.panelRightContent = document.getElementById('panel-right-content');

    console.log('✅ DOM елементи сутностей ініціалізовано:', {
        tabs: dom.tabButtons?.length || 0,
        tabContents: dom.tabContents?.length || 0,
        tables: [
            dom.categoriesTbody ? '✓' : '✗',
            dom.characteristicsTbody ? '✓' : '✗',
            dom.optionsTbody ? '✓' : '✗'
        ],
        buttons: [
            dom.btnAddEntity ? '✓' : '✗',
            dom.btnReload ? '✓' : '✗'
        ]
    });
}

/**
 * Оновлює посилання на динамічні елементи (після завантаження шаблонів)
 * Викликається після завантаження aside-entities.html
 */
export function updateDynamicDOM() {
    // Оновлюємо елементи з правої панелі (вони завантажуються динамічно)
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
        default:
            return 'Categories';
    }
}
