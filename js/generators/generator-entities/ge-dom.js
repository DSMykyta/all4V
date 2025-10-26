// js/generators/generator-entities/ge-dom.js

/**
 * Кешування DOM-елементів для генератора сутностей
 */
export const dom = {
    // Tabs
    tabs: document.querySelectorAll('.entities-tab'),
    tabPanes: document.querySelectorAll('.entities-tab-pane'),

    // Table bodies
    categoriesTbody: document.getElementById('categories-tbody'),
    characteristicsTbody: document.getElementById('characteristics-tbody'),
    optionsTbody: document.getElementById('options-tbody'),

    // Buttons
    btnAddCategory: document.getElementById('btn-add-category'),
    btnAddCharacteristic: document.getElementById('btn-add-characteristic'),
    btnAddOption: document.getElementById('btn-add-option'),
    btnReload: document.getElementById('reload-section-entities'),

    // Auth button
    authBtn: document.getElementById('auth-btn'),
};
