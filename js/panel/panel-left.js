import { initDropdowns } from '../common/ui-dropdown.js';

/**
 * Встановлює клас 'is-active' для посилання, що відповідає поточній сторінці.
 * @param {HTMLElement} panel - Елемент панелі для пошуку посилань.
 */
function setActivePageLink(panel) {
    // Отримуємо шлях поточної сторінки (напр. "/p_tables.html" або "/index.html")
    const currentPagePath = window.location.pathname;
    const links = panel.querySelectorAll('a.panel-item');

    links.forEach(link => {
        // ✨ ОСЬ ТУТ ВИПРАВЛЕННЯ ✨
        // Ігноруємо посилання, які є просто заглушками (href="#")
        if (link.getAttribute('href') === '#') {
            return; // Переходимо до наступного посилання
        }

        const linkPath = new URL(link.href).pathname;

        // Робимо посилання активним, якщо його шлях точно збігається з поточним
        if (currentPagePath === linkPath) {
            link.classList.add('is-active');
        }
    });
}

/**
 * Ініціалізує відстеження прокрутки, щоб виділяти активну секцію в меню.
 * Це називається "Scroll Spy".
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('main > section[id]');
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                document.querySelectorAll('.panel-item[data-scroll-to]').forEach(item => {
                    item.classList.remove('is-active');
                });

                const activeItem = document.querySelector(`.panel-item[data-scroll-to="#${sectionId}"]`);
                if (activeItem) {
                    activeItem.classList.add('is-active');
                }
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
}


export function initPanelLeft() {
    const panel = document.getElementById('panel-left');
    if (!panel) return;
    
    // Ваша існуюча логіка для дропдаунів
    initDropdowns();
    panel.addEventListener('mouseenter', () => {
        const dropdownWrappers = panel.querySelectorAll('.dropdown-wrapper');
        dropdownWrappers.forEach(wrapper => {
            wrapper.style.overflow = 'visible';
            const menu = wrapper.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.position = 'absolute';
            }
        });
    });
    panel.addEventListener('mouseleave', () => {
        const menus = panel.querySelectorAll('.dropdown-menu.is-open');
        menus.forEach(menu => menu.classList.remove('is-open'));
    });
    
    // Оновлена логіка
    setActivePageLink(panel); // Виділяє активну сторінку при завантаженні
    initScrollSpy();          // Вмикає підсвічування активної секції при скролі
}