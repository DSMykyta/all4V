// js/generators/generator-glossary/ggl-main.js
import { registerPanelInitializer } from '../../panel/panel-right.js';
import { fetchGlossaryData } from './ggl-data.js';
import { renderGlossaryTree, initTreeToggles } from './ggl-tree.js';
import { initGlossaryArticles } from './ggl-articles.js';

async function initGlossaryGenerator() {
    if (!document.getElementById('glossary-content-container')) return;

    await fetchGlossaryData();
    renderGlossaryTree();
    initTreeToggles();
    initGlossaryArticles();L

    // initGlossarySearch();
    // initGlossaryReset();

    console.log('Глосарій успішно ініціалізовано.');
}

registerPanelInitializer('aside-glossary', initGlossaryGenerator);