// js/common/ui-modal.js

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                  ГЛОБАЛЬНИЙ ОБРОБНИК МОДАЛЬНИХ ВІКОН                     ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * * ПРИЗНАЧЕННЯ:
 * Керує відкриттям, закриттям та динамічним наповненням модальних вікон.
 * Система працює глобально через один слухач подій на документі.
 * * * ЯК ЦЕ ПРАЦЮЄ:
 * 1. Кнопка-тригер повинна мати атрибут `data-modal-trigger="modal-id"`.
 * 2. Скрипт завантажує HTML-контент з `/templates/modals/modal-id.html`.
 * 3. З шаблону витягуються три частини: заголовок, кнопки для шапки та тіло.
 * 4. Скрипт будує оболонку модального вікна та вставляє в неї отриманий контент.
 * 5. Після побудови автоматично ініціалізується логіка вкладок (табів).
 */

import { initTabs } from './ui-tabs.js';

let modalWrapper = null;
const modalTemplateCache = new Map();

/**
 * Створює базову структуру модального вікна в DOM, якщо її ще немає.
 */
function createModalStructure() {
    if (document.getElementById('global-modal-wrapper')) return;

    modalWrapper = document.createElement('div');
    modalWrapper.id = 'global-modal-wrapper';
    modalWrapper.className = 'modal-overlay';
    modalWrapper.innerHTML = `
        <div class="modal-container" role="dialog" aria-modal="true">
            <div class="modal-header">
                <h2 class="modal-title"></h2>
                <div id="modal-header-actions" class="connected-button-group-round"></div>
            </div>
            <div class="modal-body"></div>
        </div>
    `;
    document.body.appendChild(modalWrapper);

    // Закриття по кліку на оверлей
    modalWrapper.addEventListener('click', (e) => {
        if (e.target === modalWrapper) {
            closeModal();
        }
    });
}

/**
 * Завантажує та відображає модальне вікно.
 * @param {string} modalId - Ідентифікатор модального вікна (відповідає назві файлу).
 */
export async function showModal(modalId) {
    if (!modalWrapper) createModalStructure();

    try {
        let templateHtml;
        // Перевіряємо, чи є шаблон у кеші
        if (modalTemplateCache.has(modalId)) {
            templateHtml = modalTemplateCache.get(modalId);
        } else {
            // Якщо немає - завантажуємо і зберігаємо в кеш
            const response = await fetch(`/templates/modals/${modalId}.html`);
            if (!response.ok) throw new Error(`Не вдалося завантажити шаблон: ${modalId}`);
            templateHtml = await response.text();
            modalTemplateCache.set(modalId, templateHtml); // Зберігаємо
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(templateHtml, 'text/html');

        // Знаходимо елементи для вставки
        const titleSource = doc.querySelector('.modal-title-source')?.textContent || 'Заголовок';
        const headerActionsSource = doc.querySelector('.modal-header-actions-source');
        const bodySource = doc.querySelector('.modal-body-source');

        // Наповнюємо структуру
        const titleTarget = modalWrapper.querySelector('.modal-title');
        const headerActionsTarget = modalWrapper.querySelector('#modal-header-actions');
        const bodyTarget = modalWrapper.querySelector('.modal-body');

        titleTarget.textContent = titleSource;
        headerActionsTarget.innerHTML = headerActionsSource?.innerHTML || '';
        bodyTarget.innerHTML = bodySource?.innerHTML || '<p>Помилка: вміст не знайдено.</p>';
        
        // Додаємо обов'язкову кнопку закриття
        const closeButton = document.createElement('button');
        closeButton.className = 'segment modal-close-btn';
        closeButton.innerHTML = `<div class="btn-icon state-layer"><span class="material-symbols-outlined">close</span></div>`;
        closeButton.onclick = closeModal;
        headerActionsTarget.appendChild(closeButton);

        // Показуємо модальне вікно
        document.body.classList.add('is-modal-open');
        modalWrapper.classList.add('is-open');
        
        // Ініціалізуємо вкладки всередині нового контенту
        initTabs(bodyTarget);

    } catch (error) {
        console.error('Помилка при відображенні модального вікна:', error);
    }
}

/**
 * Закриває активне модальне вікно.
 */
function closeModal() {
    if (!modalWrapper) return;
    document.body.classList.remove('is-modal-open');
    modalWrapper.classList.remove('is-open');
}

/**
 * Ініціалізує глобальні слухачі для модальних вікон.
 */
export function initModals() {
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-trigger]');
        if (trigger) {
            e.preventDefault();
            const modalId = trigger.dataset.modalTrigger;
            showModal(modalId);
        }

        // === ДОДАНО: Обробка кнопок закриття всередині модалу ===
        const closeTrigger = e.target.closest('[data-modal-close]');
        if (closeTrigger && closeTrigger.closest('.modal-container')) {
             e.preventDefault();
             closeModal();
        }
        // ========================================================
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('is-modal-open')) {
            closeModal();
        }
    });
}