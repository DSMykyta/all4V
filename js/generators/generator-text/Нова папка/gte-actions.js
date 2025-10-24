// js/generators/generator-text/gte-actions.js

import { showToast } from '../../common/ui-toast.js';
import { forceStatsUpdate } from './gte-stats.js';

export function wrapSelectionWithTag(tag, inputElement) {
    if (!inputElement) return;
    const { value, selectionStart, selectionEnd } = inputElement;
    const selectedText = value.slice(selectionStart, selectionEnd);
    
    const textBefore = value.slice(0, selectionStart);
    const textAfter = value.slice(selectionEnd);
    
    const wrappedText = `<${tag}>${selectedText}</${tag}>`;
    
    // **ВИПРАВЛЕНО ТУТ (було 'after' замість 'textAfter')**
    inputElement.value = textBefore + wrappedText + textAfter;

    // Оновлюємо позицію курсора та статистику
    const newCursorPosition = (textBefore + wrappedText).length;
    inputElement.focus();
    inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
    forceStatsUpdate(); // Оновлюємо статистику після зміни
}

/**
 * Перетворює виділений текст у нижній регістр.
 * @param {HTMLTextAreaElement} inputElement - Поле вводу тексту.
 */
export function selectionToLowercase(inputElement) {
    if (!inputElement) return;
    const { selectionStart, selectionEnd } = inputElement;
    const selectedText = inputElement.value.slice(selectionStart, selectionEnd).toLowerCase();
    
    inputElement.focus();
    forceStatsUpdate();
}

/**
 * Знаходить та замінює всі входження тексту з повідомленням.
 * @param {HTMLTextAreaElement} inputElement - Головне поле вводу.
 * @param {HTMLInputElement} findInputElement - Поле "Що знайти".
 * @param {HTMLInputElement} replaceInputElement - Поле "На що замінити".
 */
export function findAndReplaceAll(inputElement, findInputElement, replaceInputElement) {
if (!inputElement || !findInputElement || !replaceInputElement) return;
    const findText = findInputElement.value;
    if (!findText) return;
    const replaceText = replaceInputElement.value;
    const originalValue = inputElement.value;
    const count = (originalValue.match(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    
    
    if (count === 0) {
        showToast(`Текст "${findText}" не знайдено`, 'info');
        return;
    }

    inputElement.value = originalValue.split(findText).join(replaceText);
    inputElement.focus();
    showToast(`Замінено "${findText}" на "${replaceText}" (${count} разів)`, 'success');

    forceStatsUpdate();
}

