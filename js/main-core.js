// js/main-core.js

import { initPanelLeft } from './panel/panel-left.js';
import { initPanelRight } from './panel/panel-right.js';
import { initDropdowns } from './common/ui-dropdown.js';
import { initModals } from './common/ui-modal.js';
import { initEventHandlers } from './utils/event-handlers.js';
import { initGoogleAuth } from './auth/google-auth.js';


export function initCore() {
    initPanelLeft();
    initPanelRight();
    initDropdowns();
    initModals();
    initEventHandlers();
    
    // Ініціалізуємо Google Auth (без callback, бо на сторінці інструментів дані не завантажуються автоматично)
    initGoogleAuth(() => {
        console.log('✅ Авторизація на сторінці інструментів готова');
    });
}
