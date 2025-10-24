// js/generators/generator-seo/gse-brand.js
import { getSeoDOM } from './gse-dom.js';
import { getBrandsData } from './gse-data.js';

/**
 * Оновлює назву країни поруч з полем бренду.
 */
export function updateCountryDisplay() {
    const dom = getSeoDOM();
    const brandsData = getBrandsData(); 
    const brandName = dom.brandNameInput.value.trim().toLowerCase();
    const brandInfo = brandsData[brandName];
    
    dom.countryNameDiv.textContent = brandInfo ? brandInfo.country : '';
}