const CLIENT_ID = '431864072155-l006mvdsf5d67ilevfica0elcc1d0fl8.apps.googleusercontent.com';
const DISCOVERY_DOCS = ['https://sheets.googleapis.com/$discovery/rest?version=v4'];
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

let isAuthorized = false;
let tokenClient = null;
let onAuthSuccessCallback = null;

export function initGoogleAuth(onSuccess) {
    onAuthSuccessCallback = onSuccess;
    window.addEventListener('storage', handleStorageChange);

    const checkGapi = setInterval(() => {
        if (typeof gapi !== 'undefined') {
            clearInterval(checkGapi);
            loadGapiClient();
        }
    }, 100);
}

function handleStorageChange(event) {
    if (event.key === 'google_auth_token') {
        if (event.newValue === null) {
            console.log('🔄 Токен видалено в іншій вкладці - виконую вихід');
            performLocalSignOut();
        } else if (event.oldValue === null && event.newValue !== null) {
            console.log('🔄 Токен додано в іншій вкладці - виконую вхід');
            checkStoredToken();
        }
    }
}

function performLocalSignOut() {
    const token = gapi.client.getToken();
    if (token) {
        gapi.client.setToken(null);
    }
    isAuthorized = false;
    updateAllAuthButtons(false);
    window.dispatchEvent(new Event('google-auth-signout'));
    console.log('✅ Локальний вихід виконано');
}

function loadGapiClient() {
    gapi.load('client', async () => {
        await gapi.client.init({
            discoveryDocs: DISCOVERY_DOCS
        });
        console.log('✅ Google API Client ініціалізовано');
        checkStoredToken();
        initTokenClient();
    });
}

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
            if (!isAuthorized) {
                updateAllAuthButtons(false);
            }
        }
    }, 100);
}

function handleAuthResponse(response) {
    if (response.error) {
        console.error('❌ Помилка авторизації:', response);
        alert('Помилка авторізації. Спробуйте ще раз.');
        return;
    }

    const tokenData = {
        access_token: response.access_token,
        expires_at: Date.now() + (response.expires_in * 1000)
    };

    localStorage.setItem('google_auth_token', JSON.stringify(tokenData));
    gapi.client.setToken({ access_token: response.access_token });

    isAuthorized = true;
    console.log('✅ Авторізація успішна');

    updateAllAuthButtons(true);

    if (onAuthSuccessCallback) {
        onAuthSuccessCallback();
    }
    
    window.dispatchEvent(new Event('google-auth-success'));
}

function checkStoredToken() {
    const storedToken = localStorage.getItem('google_auth_token');

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
                
                setTimeout(() => {
                    window.dispatchEvent(new Event('google-auth-success'));
                }, 100);
                
                return true;
            } else {
                localStorage.removeItem('google_auth_token');
                console.log('ℹ️ Токен прострочений');
            }
        } catch (e) {
            console.error('Помилка парсингу токена:', e);
            localStorage.removeItem('google_auth_token');
        }
    }

    return false;
}

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

export function signOut() {
    const token = gapi.client.getToken();

    if (token) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken(null);
    }

    localStorage.removeItem('google_auth_token');
    isAuthorized = false;

    console.log('✅ Вихід виконано');

    updateAllAuthButtons(false);
    window.dispatchEvent(new Event('google-auth-signout'));
    
    setTimeout(() => window.location.reload(), 300);
}

function updateAllAuthButtons(authorized) {
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

export function isUserAuthorized() {
    return isAuthorized;
}

export function getAccessToken() {
    const token = gapi.client.getToken();
    return token ? token.access_token : null;
}