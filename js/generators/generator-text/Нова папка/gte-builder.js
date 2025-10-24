// js/generators/generator-text/gte-builder.js

// Ця функція є внутрішньою і не експортується
function autoTag(text) {
    const lines = text.split('\n');
    let result = '';
    let isList = false;
    let isParagraph = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.length === 0) {
            if (isList) { result += '</ul>'; isList = false; }
            if (isParagraph) { result += '</p>'; isParagraph = false; }
            continue;
        }

        if (line.endsWith(':')) {
            if (isList) { result += '</ul>'; isList = false; }
            if (isParagraph) { result += '</p>'; isParagraph = false; }
            result += `<h3>${line}</h3>`;
            continue;
        }

        if (i < lines.length - 1 && lines[i + 1].trim().length > 0 && !lines[i+1].trim().endsWith(':')) {
            if (!isList) { result += '<ul>'; isList = true; }
            result += `<li>${line}</li>`;
        } else {
            if (isList) {
                result += `<li>${line}</li></ul>`;
                isList = false;
            } else {
                result += `<p>${line}</p>`;
            }
        }
    }
    if (isList) result += '</ul>';
    if (isParagraph) result += '</p>';
    return result;
}


export function generateTextHtml(rawText) {
    const text = (rawText || '').trim();
    if (!text) return '';
    let marked = autoTag(text);
    return marked
        .replace(/<\/strong><strong>/g, '')
        .replace(/<\/strong> <strong>/g, ' ')
        .replace(/<p><p>/g, '<p>')
        .replace(/<\/p><\/p>/g, '</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<\/p>/g, '</p>\n\n')
        .replace(/<\/li>/g, '</li>\n')
        .replace(/<ul>/g, '<ul>\n')
        .replace(/<ol>/g, '<ol>\n')
        .replace(/<\/ul>/g, '</ul>\n\n')
        .replace(/<\/ol>/g, '</ol>\n\n')
        .replace(/<\/h3>/g, '</h3>\n\n')
        .replace(/<\/h2>/g, '</h2>\n\n')
        .replace(/<\/h1>/g, '</h1>\n\n')
        .trim();
}

export function generateTextBr(rawText) {
    return (rawText || '')
        .replace(/<\/?(table|thead|tbody|tr|th|td|strong|em|b|u|h2)\b[^>]*>/gi, '')
        .replace(/&nbsp;|\n|\r|\t/g, ' ')
        .replace(/<h2\b[^>]*>(.*?)<\/h2>/gi, '<strong>$1</strong>')
        .replace(/<th\b[^>]*>(.*?)<\/th>/gi, '<strong>$1</strong>')
        .replace(/ +/g, ' ')
        .replace(/>\s+</g, '><')
        .replace(/Харчова цінність|Пищевая ценность/g, '')
        .replace(/Состав может незначительно отличаться в зависимости от вкуса/g, '<strong>Состав может незначительно отличаться в зависимости от вкуса</strong>')
        .replace(/<\/(p|tr|table)>/g, '<br/>')
        .replace(/<br\s*\/?>/gi, '<br/>')
        .trim()
        .replace(/(<br\/>)+$/, '');
}

export function generateTextClean(rawText) {
    return (rawText || '')
        .replace(/<\/?(table|tbody|thead|tr|th|td|h1|h2|h3|p|em|ul|ol|li|b|pre|u|strong|hr|br|span|img|script)\b[^>]*>|\s*особливості:\s*|\n{3,}|\r|\t|&nbsp;|\x01/gi, (m) => {
            if (m.startsWith('<h') && m.endsWith('>')) return '\n\n';
            if (m.toLowerCase().includes('особливості:')) return 'Особливості:';
            return '';
        })
        .replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi, '$3')
        .replace(/:contentReference\[oaicite:\d+\]\{index=\d+\}/g, '')
        .replace(/ +/g, ' ')
        .replace(/\n\s+\n/g, '\n\n')
        .trim();
}

export function generateTextKeepTags(rawText) {
    return (rawText || '')
        .replace(/<([a-z0-9]+)\b[^>]*>/gi, '<$1>')
        .replace(/<\/?pre>/gi, '<p>')
        .replace(/<a[^>]*>(.*?)<\/a>/gi, '$1')
        .replace(/:contentReference\[oaicite:\d+\]\{index=\d+\}/g, '')
        .replace(/&nbsp;|<br\s*\/?>/gi, m => m === '&nbsp;' ? ' ' : '</p><p>')
        .replace(/<p>\s*<\/p>/gi, '')
        .replace(/(<\/p><p>)+/g, '</p><p>')
        .replace(/[•·●]/g, '')
        .replace(/<img[^>]+>/gi, '')
        .replace(/<h3>\s*особливості:<\/h3>/gi, '<h3>Особливості:</h3>')
        .replace(/<\/?(span|script)[^>]*>/gi, '')
        .replace(/\x01/g, '')
        .replace(/ +/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
}