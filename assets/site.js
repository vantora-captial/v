const pageTranslations = window.PAGE_TRANSLATIONS || {};
const selector = document.querySelector('[data-language-selector]');
const stored = localStorage.getItem('vantoraLang') || 'en';

function applyLanguage(language) {
  const dictionary = pageTranslations[language] || pageTranslations.en || {};
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = dictionary[element.dataset.i18n];
    if (value !== undefined) element.innerHTML = value;
  });
  if (dictionary.pageTitle) document.title = dictionary.pageTitle;
  localStorage.setItem('vantoraLang', language);
  if (selector) selector.value = language;
}

if (selector) selector.addEventListener('change', (event) => applyLanguage(event.target.value));
applyLanguage(stored);
