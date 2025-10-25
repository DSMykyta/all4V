// js/generators/generator-entities/ge-data.js

const SPREADSHEET_ID = '1iFOCQUbisLprSfIkfCar3Oc5f8JW12kA0dpHzjEXSsk';

// Зберігаємо дані в пам'яті
let categoriesData = [];
let characteristicsData = [];
let optionsData = [];
let marketplacesData = [];

/**
 * Завантажує всі дані з Google Sheets
 */
export async function fetchAllData() {
    try {
        const token = gapi.client.getToken()?.access_token;
        
        if (!token) {
            throw new Error('Немає токена авторизації');
        }
        
        console.log('📡 Завантаження даних з Google Sheets...');
        
        // Паралельно завантажуємо всі аркуші з обробкою помилок
        const results = await Promise.allSettled([
            fetchSheetData('Categories', token),
            fetchSheetData('Characteristics', token),
            fetchSheetData('Options', token),
            fetchSheetData('Marketplaces', token)
        ]);

        // Обробляємо результати
        const names = ['Categories', 'Characteristics', 'Options', 'Marketplaces'];
        const [categories, characteristics, options, marketplaces] = results.map((result, index) => {
            if (result.status === 'rejected') {
                console.warn(`⚠️ Не вдалося завантажити ${names[index]}:`, result.reason);
                return [];
            }
            return result.value;
        });

        categoriesData = parseSheetData(categories, [
            'local_id', 'parent_local_id', 'name_uk', 'name_ru', 'category_type'
        ]);

        characteristicsData = parseSheetData(characteristics, [
            'local_id', 'name_uk', 'name_ru', 'param_type', 'unit', 'filter_type', 'is_global', 'notes'
        ]);

        optionsData = parseSheetData(options, [
            'local_id', 'char_local_id', 'name_uk', 'name_ru'
        ]);

        marketplacesData = parseSheetData(marketplaces, [
            'marketplace_id', 'display_name', 'icon_svg', 'primary_color'
        ]);

        console.log('✅ Дані успішно завантажено:', {
            categories: categoriesData.length,
            characteristics: characteristicsData.length,
            options: optionsData.length,
            marketplaces: marketplacesData.length
        });

        return {
            categories: categoriesData,
            characteristics: characteristicsData,
            options: optionsData,
            marketplaces: marketplacesData
        };

    } catch (error) {
        console.error('❌ Помилка завантаження даних:', error);
        // Повертаємо порожні масиви замість throw
        return {
            categories: [],
            characteristics: [],
            options: [],
            marketplaces: []
        };
    }
}

/**
 * Завантажує дані з одного аркуша
 */
async function fetchSheetData(sheetName, token) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}`;
    
    console.log(`📄 Завантаження аркуша: ${sheetName}`);
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Помилка відповіді для ${sheetName}:`, response.status, errorText);
        throw new Error(`Помилка завантаження аркуша ${sheetName}: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`✅ Аркуш ${sheetName} завантажено:`, data.values?.length || 0, 'рядків');
    
    return data.values || [];
}

/**
 * Парсить дані з аркуша в масив об'єктів
 */
function parseSheetData(values, columns) {
    if (!values || values.length === 0) {
        console.warn('⚠️ Аркуш порожній');
        return [];
    }

    if (values.length === 1) {
        console.warn('⚠️ Аркуш має тільки заголовки');
        return [];
    }

    // Перший рядок - заголовки, пропускаємо
    const rows = values.slice(1);

    const parsed = rows.map((row, index) => {
        const item = { _rowIndex: index + 2 }; // +2 тому що: 1 заголовок + 1 індексація з 1
        
        columns.forEach((col, i) => {
            item[col] = row[i] || '';
        });

        return item;
    }).filter(item => {
        // Фільтруємо порожні рядки
        return item.local_id || item.marketplace_id || item.brand_id;
    });

    console.log(`📊 Розпарсено ${parsed.length} записів`);
    
    return parsed;
}



/**
 * Геттери для даних
 */
export function getCategoriesData() {
    return categoriesData;
}

export function getCharacteristicsData() {
    return characteristicsData;
}

export function getOptionsData() {
    return optionsData;
}

export function getMarketplacesData() {
    return marketplacesData;
}

/**
 * Додає новий запис в Google Sheets
 */
export async function addEntityToSheet(sheetName, values) {
    try {
        const token = gapi.auth.getToken().access_token;
        const range = `${sheetName}!A:Z`;

        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=RAW`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [values]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Помилка додавання запису: ${response.statusText}`);
        }

        console.log(`✅ Запис додано до ${sheetName}`);
        return await response.json();

    } catch (error) {
        console.error('❌ Помилка додавання запису:', error);
        throw error;
    }
}

/**
 * Оновлює запис в Google Sheets
 */
export async function updateEntityInSheet(sheetName, rowIndex, values) {
    try {
        const token = gapi.auth.getToken().access_token;
        const range = `${sheetName}!A${rowIndex}:Z${rowIndex}`;

        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW`,
            {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    values: [values]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Помилка оновлення запису: ${response.statusText}`);
        }

        console.log(`✅ Запис оновлено в ${sheetName} (рядок ${rowIndex})`);
        return await response.json();

    } catch (error) {
        console.error('❌ Помилка оновлення запису:', error);
        throw error;
    }
}

/**
 * Видаляє рядок з Google Sheets
 */
export async function deleteEntityFromSheet(sheetName, rowIndex) {
    try {
        const token = gapi.auth.getToken().access_token;

        // Отримуємо sheetId
        const spreadsheetResponse = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            }
        );

        const spreadsheetData = await spreadsheetResponse.json();
        const sheet = spreadsheetData.sheets.find(s => s.properties.title === sheetName);
        
        if (!sheet) {
            throw new Error(`Аркуш ${sheetName} не знайдено`);
        }

        const sheetId = sheet.properties.sheetId;

        // Видаляємо рядок
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    requests: [{
                        deleteDimension: {
                            range: {
                                sheetId: sheetId,
                                dimension: 'ROWS',
                                startIndex: rowIndex - 1,
                                endIndex: rowIndex
                            }
                        }
                    }]
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Помилка видалення запису: ${response.statusText}`);
        }

        console.log(`✅ Запис видалено з ${sheetName} (рядок ${rowIndex})`);
        return await response.json();

    } catch (error) {
        console.error('❌ Помилка видалення запису:', error);
        throw error;
    }
}
