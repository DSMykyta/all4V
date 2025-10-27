// js/generators/generator-entities/ge-dom.js

/**
 * Повертає всі DOM елементи сторінки entities
 */
export function getEntitiesDOM() {
    return {
        // Панелі
        panelLeft: document.getElementById('panel-left'),
        panelRight: document.getElementById('panel-right'),
        btnPanelLeftToggle: document.getElementById('btn-panel-left-toggle'),
        btnPanelRightToggle: document.getElementById('btn-panel-right-toggle'),

        // Кнопки дій
        btnAddEntity: document.getElementById('btn-add-entity'),
        btnRefreshData: document.getElementById('btn-refresh-data'),
        btnDeleteSelected: document.getElementById('btn-delete-selected'),
        authBtn: document.getElementById('auth-btn'),

        // Таби
        tabButtons: document.querySelectorAll('.tab-button'),
        tabContents: document.querySelectorAll('.tab-content'),

        // Таблиці
        categoriesTbody: document.getElementById('categories-tbody'),
        characteristicsTbody: document.getElementById('characteristics-tbody'),
        optionsTbody: document.getElementById('options-tbody'),

        // Чекбокси select-all
        selectAllCategories: document.getElementById('select-all-categories'),
        selectAllCharacteristics: document.getElementById('select-all-characteristics'),
        selectAllOptions: document.getElementById('select-all-options'),

        // Права панель
        searchInput: document.getElementById('search-input'),
        filtersContainer: document.getElementById('filters-container'),
        selectedCount: document.getElementById('selected-count'),
    };
}
