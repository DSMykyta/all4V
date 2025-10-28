// js/generators/generator-entities/ge-data.js

/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║                   МОДУЛЬ РОБОТИ З ДАНИМИ СУТНОСТЕЙ                       ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 * Відповідає за:
 * - Завантаження даних з Google Sheets API
 * - CRUD операції (Create, Read, Update, Delete)
 * - Кешування даних в пам'яті
 */

const SPREADSHEET_ID = '1iFOCQUbisLprSfIkfCar3Oc5f8JW12kA0dpHzjEXSsk';

// Локальне сховище даних
let categoriesData = [];
let characteristicsData = [];
let optionsData = [];
let marketplacesData = [];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * READ - ЗАВАНТАЖЕННЯ ДАНИХ
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Завантажує всі дані з Google Sheets (Categories, Characteristics, Options, Marketplaces)
 */
export async function fetchAllData() {
    try {
        const token = gapi.client.getToken()?.access_token;
        
        if (!token) {
            throw new Error('❌ Немає токена авторизації');
        }
        
        console.log('📡 Завантаження даних з Google Sheets...');
        
        // Паралельно завантажуємо всі 4 аркуші
        const [categoriesResult, characteristicsResult, optionsResult, marketplacesResult] = 
            await Promise.allSettled([
                fetchSheetData('Categories', token),
                fetchSheetData('Characteristics', token),
                fetchSheetData('Options', token),
                fetchSheetData('Marketplaces', token)
            ]);

        // Обробляємо результати завантаження
        categoriesData = categoriesResult.status === 'fulfilled' 
            ? parseSheetData(categoriesResult.value, ['local_id', 'parent_local_id', 'name_uk', 'name_ru', 'category_type'])
            : [];
            
        characteristicsData = characteristicsResult.status === 'fulfilled'
            ? parseSheetData(characteristicsResult.value, ['local_id', 'name_uk', 'name_ru', 'param_type', 'unit', 'filter_type', 'is_global', 'notes'])
            : [];
            
        optionsData = optionsResult.status === 'fulfilled'
            ? parseSheetData(optionsResult.value, ['local_id', 'char_local_id', 'name_uk', 'name_ru'])
            : [];
            
        marketplacesData = marketplacesResult.status === 'fulfilled'
            ? parseSheetData(marketplacesResult.value, ['marketplace_id', 'display_name', 'icon_svg', 'primary_color'])
            : [];

        // Логування помилок
        if (categoriesResult.status === 'rejected') {
            console.warn('⚠️ Помилка завантаження Categories:', categoriesResult.reason);
        }
        if (characteristicsResult.status === 'rejected') {
            console.warn('⚠️ Помилка завантаження Characteristics:', characteristicsResult.reason);
        }
        if (optionsResult.status === 'rejected') {
            console.warn('⚠️ Помилка завантаження Options:', optionsResult.reason);
        }
        if (marketplacesResult.status === 'rejected') {
            console.warn('⚠️ Помилка завантаження Marketplaces:', marketplacesResult.reason);
        }

        console.log('✅ Дані завантажено:', {
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
        console.error('❌ Критична помилка завантаження даних:', error);
        throw error;
    }
}

/**
 * Завантажує дані з одного аркуша Google Sheets
 */
async function fetchSheetData(sheetName, token) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(sheetName)}`;
    
    console.log(`📄 Завантаження аркуша: ${sheetName}`);
    
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Помилка ${response.status} для ${sheetName}:`, errorText);
        throw new Error(`Failed to fetch ${sheetName}: ${response.status}`);
    }

    const data = await response.json();
    
    console.log(`✅ Аркуш ${sheetName} завантажено:`, data.values?.length || 0, 'рядків');
    
    return data.values || [];
}

/**
 * Парсить дані з аркуша (масив масивів) в масив об'єктів
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
        const item = { _rowIndex: index + 2 }; // +2 тому що: 1 (заголовок) + 1 (індексація з 1)
        
        columns.forEach((col, i) => {
            item[col] = row[i] || '';
        });

        return item;
    }).filter(item => {
        // Фільтруємо порожні рядки
        const hasId = item.local_id || item.marketplace_id || item.brand_id;
        return hasId && hasId.trim() !== '';
    });

    console.log(`📊 Розпарсено ${parsed.length} записів`);
    
    return parsed;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ГЕТТЕРИ - ДОСТУП ДО ДАНИХ
 * ═══════════════════════════════════════════════════════════════════════════
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
 * Отримує одну сутність за ID
 */
export function getEntityById(type, id) {
    const dataMap = {
        'categories': categoriesData,
        'characteristics': characteristicsData,
        'options': optionsData,
        'marketplaces': marketplacesData
    };
    
    const data = dataMap[type];
    if (!data) return null;
    
    const idField = type === 'marketplaces' ? 'marketplace_id' : 'local_id';
    return data.find(item => item[idField] === id);
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CREATE - ДОДАВАННЯ НОВОГО ЗАПИСУ
 * ═══════════════════════════════════════════════════════════════════════════
 */

export async function addEntity(sheetName, values) {
    try {
        const token = gapi.client.getToken()?.access_token;
        if (!token) throw new Error('Немає токена авторизації');

        const range = `${sheetName}!A:Z`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW`;

        console.log(`➕ Додавання запису до ${sheetName}:`, values);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [values]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Помилка додавання: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ Запис додано до ${sheetName}`);
        
        // Оновлюємо локальні дані
        await fetchAllData();
        
        return result;

    } catch (error) {
        console.error('❌ Помилка додавання запису:', error);
        throw error;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UPDATE - ОНОВЛЕННЯ ЗАПИСУ
 * ═══════════════════════════════════════════════════════════════════════════
 */

export async function updateEntity(sheetName, rowIndex, values) {
    try {
        const token = gapi.client.getToken()?.access_token;
        if (!token) throw new Error('Немає токена авторизації');

        const range = `${sheetName}!A${rowIndex}:Z${rowIndex}`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;

        console.log(`✏️ Оновлення запису в ${sheetName} (рядок ${rowIndex}):`, values);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [values]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Помилка оновлення: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ Запис оновлено в ${sheetName}`);
        
        // Оновлюємо локальні дані
        await fetchAllData();
        
        return result;

    } catch (error) {
        console.error('❌ Помилка оновлення запису:', error);
        throw error;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DELETE - ВИДАЛЕННЯ ЗАПИСУ
 * ═══════════════════════════════════════════════════════════════════════════
 */

export async function deleteEntity(sheetName, rowIndex) {
    try {
        const token = gapi.client.getToken()?.access_token;
        if (!token) throw new Error('Немає токена авторизації');

        console.log(`🗑️ Видалення запису з ${sheetName} (рядок ${rowIndex})`);

        // Отримуємо sheetId
        const spreadsheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;
        const spreadsheetResponse = await fetch(spreadsheetUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!spreadsheetResponse.ok) {
            throw new Error('Помилка отримання інформації про таблицю');
        }

        const spreadsheetData = await spreadsheetResponse.json();
        const sheet = spreadsheetData.sheets.find(s => s.properties.title === sheetName);
        
        if (!sheet) {
            throw new Error(`Аркуш ${sheetName} не знайдено`);
        }

        const sheetId = sheet.properties.sheetId;

        // Видаляємо рядок
        const deleteUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`;
        const response = await fetch(deleteUrl, {
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
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Помилка видалення: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log(`✅ Запис видалено з ${sheetName}`);
        
        // Оновлюємо локальні дані
        await fetchAllData();
        
        return result;

    } catch (error) {
        console.error('❌ Помилка видалення запису:', error);
        throw error;
    }
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🆕 СТВОРЕННЯ НОВОГО АРКУША В GOOGLE SHEETS
 * ═══════════════════════════════════════════════════════════════════════════
 */

export async function createMarketplaceSheet(marketplaceId, headers = null) {
    try {
        const token = gapi.client.getToken()?.access_token;
        if (!token) throw new Error('Немає токена авторизації');

        const sheetTitle = `MP_${marketplaceId}`;
        
        console.log(`📄 Створення нового аркуша: ${sheetTitle}`);

        // Стандартні заголовки для аркуша маркетплейсу
        const defaultHeaders = headers || [
            'ID характеристики',
            'Назва характеристики',
            'Тип параметра',
            'Код атрибута',
            'Суфікс',
            'Префікс',
            'Примітки'
        ];

        // Створюємо новий аркуш через batchUpdate
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requests: [
                    {
                        addSheet: {
                            properties: {
                                title: sheetTitle,
                                gridProperties: {
                                    rowCount: 1000,
                                    columnCount: defaultHeaders.length,
                                    frozenRowCount: 1 // Закріплюємо перший рядок (заголовки)
                                },
                                tabColor: {
                                    red: 0.2,
                                    green: 0.6,
                                    blue: 1.0
                                }
                            }
                        }
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Помилка створення аркуша: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        const newSheetId = result.replies[0].addSheet.properties.sheetId;

        console.log(`✅ Аркуш ${sheetTitle} створено з ID: ${newSheetId}`);

        // Додаємо заголовки до нового аркуша
        await addHeadersToSheet(sheetTitle, defaultHeaders);

        return { sheetTitle, sheetId: newSheetId };

    } catch (error) {
        console.error('❌ Помилка створення аркуша маркетплейсу:', error);
        throw error;
    }
}

/**
 * Додає заголовки до аркуша
 */
async function addHeadersToSheet(sheetTitle, headers) {
    try {
        const token = gapi.client.getToken()?.access_token;
        if (!token) throw new Error('Немає токена авторизації');

        const range = `${sheetTitle}!A1`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=RAW`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                values: [headers]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Помилка додавання заголовків: ${response.status} - ${errorText}`);
        }

        console.log(`✅ Заголовки додано до аркуша ${sheetTitle}`);

    } catch (error) {
        console.error('❌ Помилка додавання заголовків:', error);
        throw error;
    }
}
