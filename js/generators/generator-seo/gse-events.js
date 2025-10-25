// js/generators/generator-seo/gse-events.js
import { getSeoDOM } from './gse-dom.js';
import * as logic from './gse-logic.js';
import { syncTulipsFromProductName, addTulip } from './gse-triggers.js';
import { updateCountryDisplay } from './gse-brand.js';
import { updateCounters } from './gse-counters.js';

// Utility функція для debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Головна функція, яка робить ТІЛЬКИ перерахунок SEO-полів.
 */
export function runCalculations() {
    const dom = getSeoDOM();
    
    const brand = dom.brandNameInput.value.trim();
    const product = dom.productNameInput.value.trim();
    const packaging = dom.productPackagingInput.value.trim();
    const mainText = dom.inputTextMarkup.value;
    const activeTulips = Array.from(dom.triggerTitlesContainer.querySelectorAll('.trigger-title-active'))
                              .map(t => t.dataset.title);

    dom.seoTitleInput.value = logic.generateSeoTitle(brand, product, packaging);
    dom.seoDescriptionInput.value = logic.generateSeoDescription(mainText);
    dom.seoKeywordsInput.value = logic.generateSeoKeywords(brand, product, packaging, activeTulips);
    
    dom.commonWarning.textContent = logic.checkSafety(product);
    updateCountryDisplay();
    updateCounters();
}

/**
 * Налаштовує всі слухачі подій.
 */
export function initEventListeners() {
    const dom = getSeoDOM();
    
    dom.inputTextMarkup.addEventListener('input', debounce(() => {
        const { brand, product } = logic.updateBrandAndProductFromText(dom.inputTextMarkup.value);
        dom.brandNameInput.value = brand;
        dom.productNameInput.value = product;
        syncTulipsFromProductName();
        runCalculations();
    }, 300));


    dom.productNameInput.addEventListener('input', () => {
        syncTulipsFromProductName();
        runCalculations();
    });

    [dom.brandNameInput, dom.productPackagingInput].forEach(input => {
        input.addEventListener('input', runCalculations);
    });

    dom.searchTrigerInput.addEventListener('input', e => {
        const searchTerm = e.target.value.toLowerCase();
        dom.trigerButtonsContainer.querySelectorAll('.trigger-button').forEach(button => {
            button.style.display = button.textContent.toLowerCase().includes(searchTerm) ? '' : 'none';
        });
    });

    dom.trigerButtonsContainer.addEventListener('click', e => {
        if (e.target.classList.contains('trigger-button')) {
            addTulip(e.target.dataset.title, true);
            runCalculations();
        }
    });

    dom.triggerTitlesContainer.addEventListener('click', e => {
        const target = e.target;
        if (target.dataset.title) {
            target.classList.toggle('trigger-title-active');
            target.classList.toggle('trigger-title-inactive');
            runCalculations();
        }
    });
}