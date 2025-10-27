// js/generators/generator-entities/ge-panels.js

import { getEntitiesDOM } from './ge-dom.js';

/**
 * Ініціалізує управління панелями
 */
export function initPanels() {
    const dom = getEntitiesDOM();

    // Ліва панель
    if (dom.btnPanelLeftToggle) {
        dom.btnPanelLeftToggle.addEventListener('click', () => {
            togglePanel(dom.panelLeft, dom.btnPanelLeftToggle, 'left');
        });
    }

    // Права панель
    if (dom.btnPanelRightToggle) {
        dom.btnPanelRightToggle.addEventListener('click', () => {
            togglePanel(dom.panelRight, dom.btnPanelRightToggle, 'right');
        });
    }

    console.log('✅ Панелі ініціалізовано');
}

/**
 * Перемикає стан панелі (згорнута/розгорнута)
 */
function togglePanel(panel, button, side) {
    if (!panel) return;

    const isCollapsed = panel.classList.toggle('is-collapsed');
    
    // Оновлюємо іконку кнопки
    const icon = button.querySelector('.material-symbols-outlined');
    
    if (side === 'left') {
        icon.textContent = isCollapsed ? 'keyboard_arrow_right' : 'keyboard_arrow_left';
        button.setAttribute('aria-label', isCollapsed ? 'Розгорнути панель' : 'Згорнути панель');
    } else {
        icon.textContent = isCollapsed ? 'keyboard_arrow_left' : 'keyboard_arrow_right';
        button.setAttribute('aria-label', isCollapsed ? 'Розгорнути панель' : 'Згорнути панель');
    }

    console.log(`${side === 'left' ? 'Ліва' : 'Права'} панель ${isCollapsed ? 'згорнута' : 'розгорнута'}`);
}
