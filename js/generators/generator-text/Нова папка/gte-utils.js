// js/generators/generator-text/gte-utils.js

/**
 * Асинхронно копіює текст в буфер обміну.
 * @param {string} text - Текст для копіювання.
 */
export async function copyToClipboard(text) {
    if (!text) return;
    try {
        await navigator.clipboard.writeText(text);
    } catch (err) {
        console.warn('Не вдалося використати Clipboard API, використовується застарілий метод.', err);
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
    }
}

/**
 * Показує візуальний відгук "Скопійовано!" на картці.
 * @param {HTMLElement} card - Елемент картки, на якій потрібно показати статус.
 */
export function showCopiedFeedback(card) {
    const status = card.querySelector('.result-status');
    if (!status) return;

    const originalText = status.textContent;
    status.textContent = 'Скопійовано!';
    card.classList.add('copied');

    setTimeout(() => {
        status.textContent = originalText;
        card.classList.remove('copied');
    }, 1500);
}