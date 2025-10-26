// js/generators/generator-entities/ge-data.js

/**
 * Модуль для роботи з Google Sheets API
 */

const SPREADSHEET_ID = '1iFOCQUbisLprSfIkfCar3Oc5f8JW12kA0dpHzjEXSsk';
const API_KEY = 'AIzaSyDHV7KNmcHom_TwCawPYdBxm6rnewKCZko';

// Локальне сховище даних
let categoriesData = [];
let characteristicsData = [];
let optionsData = [];
let marketplacesData = [];

/**
 * Отримує дані з конкретного аркуша
 */
async function fetchSheetData(sheetName, token) {
    const range = `${sheetName}!A2:Z`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${sheetName}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.values || [];
}

/**
 * Завантажує всі дані з Google Sheets
 */
export async function fetchAllData() {
    const token = localStorage.getItem('google_auth_token');
    if (!token) {
        throw new Error('Не авторизовано');
    }

    try {
        const results = await Promise.allSettled([
            fetchSheetData('Categories', token),
            fetchSheetData('Characteristics', token),
            fetchSheetData('Options', token),
            fetchSheetData('Marketplaces', token)
        ]);

        // Categories
        if (results[0].status === 'fulfilled') {
            categoriesData = results[0].value.map((row, index) => ({
                id: row[0] || `cat_${index + 1}`,
                name: row[1] || ''
            }));
        } else {
            console.error('Помилка завантаження категорій:', results[0].reason);
            categoriesData = [];
        }

        // Characteristics
        if (results[1].status === 'fulfilled') {
            characteristicsData = results[1].value.map((row, index) => ({
                id: row[0] || `char_${index + 1}`,
                name: row[1] || '',
                categoryId: row[2] || ''
            }));
        } else {
            console.error('Помилка завантаження характеристик:', results[1].reason);
            characteristicsData = [];
        }

        // Options
        if (results[2].status === 'fulfilled') {
            optionsData = results[2].value.map((row, index) => ({
                id: row[0] || `opt_${index + 1}`,
                name: row[1] || '',
                characteristicId: row[2] || ''
            }));
        } else {
            console.error('Помилка завантаження опцій:', results[2].reason);
            optionsData = [];
        }

        // Marketplaces
        if (results[3].status === 'fulfilled') {
            marketplacesData = results[3].value.map((row, index) => ({
                id: row[0] || `mp_${index + 1}`,
                name: row[1] || ''
            }));
        } else {
            console.error('Помилка завантаження маркетплейсів:', results[3].reason);
            marketplacesData = [];
        }

        console.log('✅ Дані завантажено:', {
            categories: categoriesData.length,
            characteristics: characteristicsData.length,
            options: optionsData.length,
            marketplaces: marketplacesData.length
        });

    } catch (error) {
        console.error('Помилка завантаження даних:', error);
        throw error;
    }
}

/**
 * Getters для даних
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
 * Знаходить категорію за ID
 */
export function getCategoryById(categoryId) {
    return categoriesData.find(cat => cat.id === categoryId);
}

/**
 * Знаходить характеристику за ID
 */
export function getCharacteristicById(charId) {
    return characteristicsData.find(char => char.id === charId);
}
