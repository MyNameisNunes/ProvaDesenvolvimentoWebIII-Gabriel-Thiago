/** Notificação flutuante (toast). */
import { $ } from '../utils/format.js';

let timer;

export function toast(msg, tipo = '') {
    const el = $('#toast');
    el.textContent = msg;
    el.className = 'toast' + (tipo ? ` toast--${tipo}` : '');
    el.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(() => (el.hidden = true), 3200);
}
