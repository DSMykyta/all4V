// js/generators/generator-seo/gse-triggers.js
import { getSeoDOM } from './gse-dom.js';
import { getTriggersData } from './gse-data.js';

/**
 * Створює список кнопок-тригерів в асайді.
 */
export function renderTriggerButtons() {
    const dom = getSeoDOM();
    const triggersData = getTriggersData();
    dom.trigerButtonsContainer.innerHTML = '';
    
    triggersData.forEach(trigger => {
        const button = document.createElement('button');
        button.className = 'trigger-button';
        button.textContent = trigger.title;
        button.dataset.title = trigger.title;
        dom.trigerButtonsContainer.appendChild(button);
    });
}

/**
 * Створює HTML для одного "тюльпана" і додає його на сторінку.
 */
export function addTulip(title, isActive = true) {
    const dom = getSeoDOM();
    if (dom.triggerTitlesContainer.querySelector(`[data-title="${title}"]`)) return;

    const triggerData = getTriggersData().find(t => t.title === title);
    if (!triggerData) return;

    const tulip = document.createElement('div');
    tulip.className = isActive ? 'trigger-title-active' : 'trigger-title-inactive';
    tulip.textContent = title;
    tulip.dataset.title = title;

    if (triggerData.keywords && triggerData.keywords.length > 0) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = triggerData.keywords.join(', ');
        tulip.appendChild(tooltip);
    }
    dom.triggerTitlesContainer.appendChild(tulip);
}

/**
 * Автоматично додає "тюльпани" на основі назви продукту.
 */
export function syncTulipsFromProductName() {
    const dom = getSeoDOM();
    const triggersData = getTriggersData();
    const productName = dom.productNameInput.value.toLowerCase();
    
    triggersData.forEach(trigger => {
        if (trigger.triggers.some(t => productName.includes(t))) {
            addTulip(trigger.title, true);
        }
    });
}