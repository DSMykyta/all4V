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

// js/common/ui-modal.js

import { initTabs } from './ui-tabs.js';

let modalWrapper = null;
const modalTemplateCache = new Map();

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

    modalWrapper.addEventListener('click', (e) => {
        if (e.target === modalWrapper) {
            closeModal();
        }
    });
}

/**
 * Завантажує та відображає модальне вікно.
 * @param {string} modalId - Ідентифікатор модального вікна
 * @param {HTMLElement} triggerElement - Елемент що викликав modal
 */
export async function showModal(modalId, triggerElement = null) {
    if (!modalWrapper) createModalStructure();

    try {
        let templateHtml;
        if (modalTemplateCache.has(modalId)) {
            templateHtml = modalTemplateCache.get(modalId);
        } else {
            const response = await fetch(`/templates/modals/${modalId}.html`);
            if (!response.ok) throw new Error(`Не вдалося завантажити шаблон: ${modalId}`);
            templateHtml = await response.text();
            modalTemplateCache.set(modalId, templateHtml);
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(templateHtml, 'text/html');

        const titleSource = doc.querySelector('.modal-title-source')?.textContent || 'Заголовок';
        const headerActionsSource = doc.querySelector('.modal-header-actions-source');
        const bodySource = doc.querySelector('.modal-body-source');

        const titleTarget = modalWrapper.querySelector('.modal-title');
        const headerActionsTarget = modalWrapper.querySelector('#modal-header-actions');
        const bodyTarget = modalWrapper.querySelector('.modal-body');

        titleTarget.textContent = titleSource;
        headerActionsTarget.innerHTML = headerActionsSource?.innerHTML || '';
        bodyTarget.innerHTML = bodySource?.innerHTML || '<p>Помилка: вміст не знайдено.</p>';
        
        const closeButton = document.createElement('button');
        closeButton.className = 'segment modal-close-btn';
        closeButton.innerHTML = `<div class="btn-icon state-layer"><span class="material-symbols-outlined">close</span></div>`;
        closeButton.onclick = closeModal;
        headerActionsTarget.appendChild(closeButton);

        document.body.classList.add('is-modal-open');
        modalWrapper.classList.add('is-open');
        
        initTabs(bodyTarget);

        // ДОДАНО: Диспатчимо custom event після відкриття модалу
        const modalOpenEvent = new CustomEvent('modal-opened', {
            detail: {
                modalId: modalId,
                trigger: triggerElement,
                bodyTarget: bodyTarget
            }
        });
        document.dispatchEvent(modalOpenEvent);

    } catch (error) {
        console.error('Помилка при відображенні модального вікна:', error);
    }
}

function closeModal() {
    if (!modalWrapper) return;
    document.body.classList.remove('is-modal-open');
    modalWrapper.classList.remove('is-open');
}

export function initModals() {
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-trigger]');
        if (trigger) {
            e.preventDefault();
            const modalId = trigger.dataset.modalTrigger;
            showModal(modalId, trigger); // Передаємо trigger
        }

        const closeTrigger = e.target.closest('[data-modal-close]');
        if (closeTrigger && closeTrigger.closest('.modal-container')) {
             e.preventDefault();
             closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('is-modal-open')) {
            closeModal();
        }
    });
}
