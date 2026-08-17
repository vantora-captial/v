import { LANGUAGE_STORAGE_KEY, equivalentLanguagePath } from "/assets/site-language.mjs";
const menu=document.querySelector('.menu-button');const nav=document.querySelector('#primary-nav');
function close(){if(!menu||!nav)return;menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');}
if(menu&&nav){menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.classList.toggle('is-open',!open);});nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});}
document.querySelectorAll('[data-language-choice]').forEach(link=>link.addEventListener('click',event=>{const lang=link.dataset.languageChoice;try{localStorage.setItem(LANGUAGE_STORAGE_KEY,lang);}catch{}event.preventDefault();location.href=equivalentLanguagePath(location.pathname,lang)+location.search;}));
