/** Card de uma mesa no mapa visual. */
import { STATUS_LABEL } from '../config.js';

export function mesaCardHTML(mesa, status) {
    return `
        <div class="mesa mesa--${status}" data-mesa="${mesa._id}">
            <div class="mesa__top">
                <span class="mesa__num">${mesa.numero}<small> mesa</small></span>
            </div>
            <div class="mesa__info">
                <span><i data-lucide="users" class="icon"></i> ${mesa.capacidade} lugares</span>
                <span><i data-lucide="map-pin" class="icon"></i> ${mesa.localizacao}</span>
            </div>
            <span class="mesa__status status--${status}">${STATUS_LABEL[status]}</span>
        </div>`;
}
