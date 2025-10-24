// js/generators/generator-link/gln-ui.js
import { getLinksDOM } from './gln-dom.js';
import { getLinksData, getCountriesData } from './gln-data.js';

export function renderLinkButtons() {
    const dom = getLinksDOM();
    const data = getLinksData();
    if (!dom.buttonsContainer) return;
    dom.buttonsContainer.innerHTML = ''; // Очищуємо перед рендером

    data.forEach(item => {
        const button = document.createElement("a"); // Тепер це одразу посилання
        button.className = "link-button";
        button.href = item.link;
        button.target = "_blank";
        button.textContent = item.brand; // Просто текст бренду
        // Додаємо атрибут для фільтрації
        button.dataset.brandLower = item.brand.toLowerCase();
        dom.buttonsContainer.appendChild(button);
    });
}

export function updateLinkCountryDisplay() {
    const dom = getLinksDOM();
    const countries = getCountriesData();
    if (!dom.searchInput || !dom.countryDisplay) return;
    const brandName = dom.searchInput.value.trim().toLowerCase();
    dom.countryDisplay.textContent = countries[brandName] || '';
}

export function filterLinkButtons() {
    const dom = getLinksDOM();
    if (!dom.searchInput || !dom.buttonsContainer) return;
    const searchTerm = dom.searchInput.value.toLowerCase();
    const buttons = dom.buttonsContainer.querySelectorAll(".link-button");

    buttons.forEach(button => {
        const buttonText = button.dataset.brandLower; // Беремо з data-атрибуту
        button.style.display = buttonText.includes(searchTerm) ? "" : "none";
    });
}