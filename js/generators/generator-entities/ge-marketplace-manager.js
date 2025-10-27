// js/generators/generator-entities/ge-marketplace-manager.js

/**
 * Створює аркуші для нового маркетплейсу
 * @param {string} marketplaceId - ID маркетплейсу (англ, lowercase)
 * @param {string} displayName - Відображувана назва (укр)
 * @param {Object} fieldConfig - Конфігурація полів
 */
export async function createMarketplaceSheets(marketplaceId, displayName, fieldConfig) {
    const spreadsheetId = '1iFOCQUbisLprSfIkfCar3Oc5f8JW12kA0dpHzjEXSsk';
    
    // Отримуємо токен авторизації
    const token = gapi.auth.getToken().access_token;
    
    // Створюємо 3 аркуші: Categories, Characteristics, Options
    const requests = [
        createSheetRequest(`Categories_${marketplaceId}`, fieldConfig.categories),
        createSheetRequest(`Characteristics_${marketplaceId}`, fieldConfig.characteristics),
        createSheetRequest(`Options_${marketplaceId}`, fieldConfig.options)
    ];
    
    try {
        // Виконуємо batch update
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ requests })
            }
        );
        
        if (!response.ok) throw new Error('Помилка створення аркушів');
        
        const result = await response.json();
        
        // Після створення аркушів, додаємо заголовки
        await addHeadersToSheets(spreadsheetId, marketplaceId, fieldConfig);
        
        // Форматуємо аркуші (колір заголовків, ширина колонок)
        await formatMarketplaceSheets(spreadsheetId, marketplaceId);
        
        console.log(`✅ Маркетплейс "${displayName}" успішно створено!`);
        return result;
        
    } catch (error) {
        console.error('❌ Помилка створення маркетплейсу:', error);
        throw error;
    }
}

/**
 * Генерує запит для створення аркуша
 */
function createSheetRequest(sheetTitle, fields) {
    return {
        addSheet: {
            properties: {
                title: sheetTitle,
                gridProperties: {
                    rowCount: 1000,
                    columnCount: fields.length + 2, // +2 для local_id та is_active
                    frozenRowCount: 1 // Заморожуємо заголовок
                },
                tabColor: {
                    red: 0.2,
                    green: 0.6,
                    blue: 1.0
                }
            }
        }
    };
}

/**
 * Додає заголовки колонок
 */
async function addHeadersToSheets(spreadsheetId, marketplaceId, fieldConfig) {
    const token = gapi.auth.getToken().access_token;
    
    // Формуємо заголовки для кожного типу
    const headersData = [
        {
            range: `Categories_${marketplaceId}!A1:Z1`,
            values: [['local_id', ...fieldConfig.categories.map(f => f.name), 'is_active']]
        },
        {
            range: `Characteristics_${marketplaceId}!A1:Z1`,
            values: [['local_id', ...fieldConfig.characteristics.map(f => f.name), 'is_active']]
        },
        {
            range: `Options_${marketplaceId}!A1:Z1`,
            values: [['local_id', ...fieldConfig.options.map(f => f.name), 'is_active']]
        }
    ];
    
    await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                valueInputOption: 'RAW',
                data: headersData
            })
        }
    );
}

/**
 * Форматує аркуші (жирний шрифт, колір фону для заголовків)
 */
async function formatMarketplaceSheets(spreadsheetId, marketplaceId) {
    const token = gapi.auth.getToken().access_token;
    
    // Отримуємо ID створених аркушів
    const sheetsResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
        {
            headers: { 'Authorization': `Bearer ${token}` }
        }
    );
    
    const data = await sheetsResponse.json();
    const sheets = data.sheets.filter(s => 
        s.properties.title.includes(`_${marketplaceId}`)
    );
    
    // Форматування заголовків
    const formatRequests = sheets.map(sheet => ({
        repeatCell: {
            range: {
                sheetId: sheet.properties.sheetId,
                startRowIndex: 0,
                endRowIndex: 1
            },
            cell: {
                userEnteredFormat: {
                    backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                    textFormat: { bold: true, fontSize: 10 },
                    horizontalAlignment: 'CENTER'
                }
            },
            fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
        }
    }));
    
    await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requests: formatRequests })
        }
    );
}

export async function deleteMarketplaceSheets(marketplaceId) {
    const spreadsheetId = '1iFOCQUbisLprSfIkfCar3Oc5f8JW12kA0dpHzjEXSsk';
    const token = gapi.auth.getToken().access_token;
    
    // Отримуємо список аркушів
    const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
        { headers: { 'Authorization': `Bearer ${token}` }}
    );
    
    const data = await response.json();
    const sheetsToDelete = data.sheets.filter(s => 
        s.properties.title.includes(`_${marketplaceId}`)
    );
    
    // Видаляємо всі аркуші маркетплейсу
    const deleteRequests = sheetsToDelete.map(sheet => ({
        deleteSheet: {
            sheetId: sheet.properties.sheetId
        }
    }));
    
    await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requests: deleteRequests })
        }
    );
    
    console.log(`🗑️ Маркетплейс "${marketplaceId}" видалено`);
}
