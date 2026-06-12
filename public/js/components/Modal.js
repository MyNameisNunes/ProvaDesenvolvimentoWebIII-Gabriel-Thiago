/** Controle do modal genérico. */
import { $ } from '../utils/format.js';
import { refreshIcons } from '../utils/icons.js';

export function openModal(html) {
    $('#modalBody').innerHTML = html;
    $('#modal').hidden = false;
    refreshIcons(); // renderiza ícones do conteúdo recém-inserido
}

export function closeModal() {
    $('#modal').hidden = true;
}
