// js/generators/generator-text/gte-find-replace.js
import { getTextDOM } from './gte-dom.js';
import { showToast } from '../../common/ui-toast.js';

function findAndReplaceAll() {
    const dom = getTextDOM();
    const findText = dom.findInput.value;
    if (!findText) return;

    const replaceText = dom.replaceInput.value;
    const originalValue = dom.inputMarkup.value;
    const count = (originalValue.match(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;

    if (count === 0) {
        showToast(`Текст "${findText}" не знайдено`, 'info');
        return;
    }

    dom.inputMarkup.value = originalValue.split(findText).join(replaceText);
    dom.inputMarkup.focus();
    showToast(`Замінено "${findText}" на "${replaceText}" (${count} разів)`, 'success');
}

export function initFindAndReplace() {
    const dom = getTextDOM();
    if (dom.replaceAllBtn) {
        dom.replaceAllBtn.addEventListener('click', findAndReplaceAll);
    }
}