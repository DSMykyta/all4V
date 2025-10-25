// js/auth/google-auth.js

const CLIENT_ID = '431864072155-l006mvdsf5d67ilevfica0elcc1d0fl8.apps.googleusercontent.com';
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let isAuthorized = false;
let tokenClient = null;
let onAuthSuccessCallback = null;

/**
 * Ініціалізує Google API (викликається один раз)
 */
export function initGoogleAuth(onSuccess) {
    onAuthSuccessCallback = onSuccess;

    // Чекаємо поки gapi завантажиться
    const checkGapi = setInterval(() => {
        if (typeof gapi !== 'undefined') {
            clearInterval(checkGapi);
            loadGapiClient();
        }
    }, 100);
}

/**
 * Завантажує GAPI client
 */
function loadGapiClient() {
    gapi.load('client', async () => {
        await gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS
        });

        console.log('✅ Google API Client ініціалізовано');

        // Перевіряємо збережений токен
        checkStoredToken();

        // Ініціалізуємо Google Identity Services після завантаження
        initTokenClient();
    });
}

/**
 * Ініціалізує Token Client для OAuth
 */
function initTokenClient() {
    const checkGoogle = setInterval(() => {
        if (typeof google !== 'undefined' && google.accounts) {
            clearInterval(checkGoogle);

            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: handleAuthResponse
            });

            console.log('✅ Google Token Client ініціалізовано');
            updateAllAuthButtons(false);
        }
    }, 100);
}

/**
 * Обробляє відповідь авторизації
 */
function handleAuthResponse(response) {
    if (response.error) {
        console.error('❌ Помилка авторизації:', response);
        alert('Помилка авторизації. Спробуйте ще раз.');
        return;
    }

    // Зберігаємо токен
    const tokenData = {
        access_token: response.access_token,
        expires_at: Date.now() + (response.expires_in * 1000)
    };

    sessionStorage.setItem('google_auth_token', JSON.stringify(tokenData));
    gapi.client.setToken({ access_token: response.access_token });

    isAuthorized = true;
    console.log('✅ Авторизація успішна');

    updateAllAuthButtons(true);

    // Викликаємо callback
    if (onAuthSuccessCallback) {
        onAuthSuccessCallback();
    }
}

/**
 * Перевіряє збережений токен
 */
function checkStoredToken() {
    const storedToken = sessionStorage.getItem('google_auth_token');

    if (storedToken) {
        try {
            const tokenData = JSON.parse(storedToken);

            if (tokenData.expires_at > Date.now()) {
                gapi.client.setToken({ access_token: tokenData.access_token });
                isAuthorized = true;
                
                console.log('✅ Використано збережений токен');
                
                updateAllAuthButtons(true);

                if (onAuthSuccessCallback) {
                    onAuthSuccessCallback();
                }
                
                return true;
            } else {
                sessionStorage.removeItem('google_auth_token');
                console.log('ℹ️ Токен прострочений');
            }
        } catch (e) {
            console.error('Помилка парсингу токена:', e);
            sessionStorage.removeItem('google_auth_token');
        }
    }

    return false;
}

/**
 * Авторизація
 */
export function signIn() {
    if (isAuthorized) {
        console.log('ℹ️ Вже авторизовано');
        return;
    }

    if (!tokenClient) {
        console.error('❌ Token client не готовий');
        alert('Google API ще не завантажено. Зачекайте...');
        return;
    }

    tokenClient.requestAccessToken({ prompt: 'consent' });
}

/**
 * Вихід
 */
export function signOut() {
    const token = gapi.client.getToken();

    if (token) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken(null);
    }

    sessionStorage.removeItem('google_auth_token');
    isAuthorized = false;

    console.log('✅ Вихід виконано');

    updateAllAuthButtons(false);
    
    // Перезавантажуємо сторінку
    setTimeout(() => window.location.reload(), 300);
}

/**
 * Оновлює всі кнопки авторизації на сторінці
 */
function updateAllAuthButtons(authorized) {
    // Додаємо невелику затримку щоб DOM встиг завантажитись
    setTimeout(() => {
        const authBtns = document.querySelectorAll('#auth-btn');
        
        console.log(`🔄 Оновлення кнопок авторизації (знайдено ${authBtns.length}), authorized: ${authorized}`);

        authBtns.forEach(btn => {
            const icon = btn.querySelector('.material-symbols-outlined');
            const text = btn.querySelector('.panel-item-text');

            if (authorized) {
                icon.textContent = 'logout';
                text.textContent = 'Вийти';
                btn.onclick = signOut;
                btn.style.cursor = 'pointer';
            } else {
                icon.textContent = 'login';
                text.textContent = 'Авторизація';
                btn.onclick = signIn;
                btn.style.cursor = 'pointer';
            }
        });
    }, 100);
}


/**
 * Перевіряє чи авторизований
 */
export function isUserAuthorized() {
    return isAuthorized;
}

/**
 * Отримує токен
 */
export function getAccessToken() {
    const token = gapi.client.getToken();
    return token ? token.access_token : null;
}


function handleAuthResponse(response) {
    if (response.error) {
        console.error('❌ Помилка авторизації:', response);
        alert('Помилка авторизації. Спробуйте ще раз.');
        return;
    }

    const tokenData = {
        access_token: response.access_token,
        expires_at: Date.now() + (response.expires_in * 1000)
    };

    sessionStorage.setItem('google_auth_token', JSON.stringify(tokenData));
    gapi.client.setToken({ access_token: response.access_token });

    isAuthorized = true;
    console.log('✅ Авторизація успішна');

    updateAllAuthButtons(true);

    // Викликаємо callback
    if (onAuthSuccessCallback) {
        onAuthSuccessCallback();
    }
    
    // ДОДАНО: Диспатчимо подію для інших модулів
    window.dispatchEvent(new Event('google-auth-success'));
}

// В кінці функції checkStoredToken додайте:
function checkStoredToken() {
    const storedToken = sessionStorage.getItem('google_auth_token');

    if (storedToken) {
        try {
            const tokenData = JSON.parse(storedToken);

            if (tokenData.expires_at > Date.now()) {
                gapi.client.setToken({ access_token: tokenData.access_token });
                isAuthorized = true;
                
                console.log('✅ Використано збережений токен');
                
                updateAllAuthButtons(true);

                if (onAuthSuccessCallback) {
                    onAuthSuccessCallback();
                }
                
                // ДОДАНО: Диспатчимо подію
                setTimeout(() => {
                    window.dispatchEvent(new Event('google-auth-success'));
                }, 100);
                
                return true;
            } else {
                sessionStorage.removeItem('google_auth_token');
                console.log('ℹ️ Токен прострочений');
            }
        } catch (e) {
            console.error('Помилка парсингу токена:', e);
            sessionStorage.removeItem('google_auth_token');
        }
    }

    return false;
}
