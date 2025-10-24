// js/generators/generator-text/gte-builder.js

// Цей файл тепер ПРАВИЛЬНО використовує текст, який йому передають.

function autoTag(text) {
  const lines = text.split('\n');
  let result = '';
  let isList = false;
  let isParagraph = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.length === 0) {
      if (isList)  { result += '</ul>'; isList = false; }
      if (isParagraph) { result += '</p>'; isParagraph = false; }
      continue;
    }

    if (line.endsWith(':')) {
      if (isList)  { result += '</ul>'; isList = false; }
      if (isParagraph) { result += '</p>'; isParagraph = false; }
      result += `<h3>${line}</h3>`;
      continue;
    }

    if (i < lines.length - 1 && lines[i + 1].trim().length > 0) {
      if (!isList) { result += '<ul>'; isList = true; }
      result += `<li>${line}</li>`;
    } else {
      if (isList) {
        result += `<li>${line}</li></ul>`;
        isList = false;
      } else {
        if (isParagraph && !line.startsWith('<h1') && !line.startsWith('<h2') && !line.startsWith('<h3')) {
          result += `${line}</p>`;
          isParagraph = false;
        } else {
          if (!line.startsWith('<h1') && !line.startsWith('<h2') && !line.startsWith('<h3')) {
            result += `<p>${line}`;
            isParagraph = true;
          } else {
            result += `${line}`;
          }
        }
      }
    }
  }
  if (isList) result += '</ul>';
  if (isParagraph) result += '</p>';
  return result;
}

// 1) Автоформатування
export function generateTextHtml(rawText) {
  const text = (rawText || '').trim(); 
  if (!text) return '';
  let marked = autoTag(text);
  marked = marked
    .replace(/<\/strong><strong>/g, '')
    .replace(/<\/strong> <strong>/g, '')
    .replace(/<p><p>/g, '<p>')
    .replace(/<\/p><\/p>/g, '</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<\/p>/g, '</p>\n\n')
    .replace(/<h3><h3>/g, '<h3>')
    .replace(/<\/h3><\/h3>/g, '</h3>')
    .replace(/<\/li>/g, '</li>\n')
    .replace(/<ul>/g, '<ul>\n')
    .replace(/<ol>/g, '<ol>\n')
    .replace(/<\/ul>/g, '</ul>\n\n')
    .replace(/<\/ol>/g, '</ol>\n\n')
    .replace(/<\/h3>/g, '</h3>\n\n')
    .replace(/<\/h2>/g, '</h2>\n\n')
    .replace(/<\/h1>/g, '</h1>\n\n');
  return marked;
}

// 2) BR-ізація
export function generateTextBr(rawText) {
  const text = (rawText || ''); 
  return text
    .replace(/<\/?(table|thead|tbody|tr|th|td)\b[^>]*>/gi, '')
    .replace(/<\/?(strong|em|b|u|h2)\b[^>]*>/gi, '')
    .replace(/&nbsp;|\n|\r|\t/g, ' ')
    .replace(/<h2\b[^>]*>(.*?)<\/h2>/gi, '<strong>$1</strong>')
    .replace(/<th\b[^>]*>(.*?)<\/th>/gi, '<strong>$1</strong>')
    .replace(/ +/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/Харчова цінність|Пищевая ценность/g, '')
    .replace(/Состав может незначительно отличаться в зависимости от вкуса/g, '<strong>Состав может незначительно отличаться в зависимости от вкуса</strong>')
    .replace(/<\/(tr|table)>/g, '<br/>')
    .trim()
    .replace(/(<br\/>)+$/, '');
}

// 3) Повне очищення
export function generateTextClean(rawText) {
  const text = (rawText || ''); 
  const cleaned = text
    .replace(/<\/?(table|tbody|thead|tr|th|td|h1|h2|h3|p|em|ul|ol|li|b|pre|u|strong|hr|br|span|img|script)\b[^>]*>|\s*особливості:\s*|\n\n\n+|\n{3}|\r|\t|&nbsp;|\x01/gi, (m) => {
      if (m.startsWith('<h') && m.endsWith('>')) return '\n\n';
      if (m === 'особливості:') return 'Особливості:';
      return '';
    })
    .replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi, '$3')
    .replace(/:contentReference\[oaicite:\d+\]\{index=\d+\}/g, '')
    .replace(/ +/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
  return cleaned;
}

// 4) Часткове очищення
export function generateTextKeepTags(rawText) {
  const text = (rawText || ''); 
  return text
    .replace(/<([a-z0-9]+)\b[^>]*>/gi, '<$1>')
    .replace(/<\/?pre>/gi, '<p>')
    .replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi, '$3')
    .replace(/:contentReference\[oaicite:\d+\]\{index=\d+\}/g, '')
    .replace(/&nbsp;|<br\s*\/?>/gi, (m) => m === '&nbsp;' ? ' ' : '</p><p>')
    .replace(/<p(?:>|\s[^>]*>)(\s|&nbsp;)*<\/p>/gi, '')
    .replace(/(<\/p><p>)+/g, '</p><p>')
    .replace(/[•·●]/g, '')
    .replace(/<img[^>]+>/gi, '')
    .replace(/<h3>\s*особливості:<\/h3>/gi, '<h3>Особливості:</h3>')
    .replace(/<\/?span[^>]*>|<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\x01/g, '')
    .replace(/ +/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}