/** Lista de reservas com filtro por status. */
import { listarReservas } from '../services/reservaService.js';
import { mesaById } from '../services/mesaService.js';
import { STATUS_LABEL } from '../config.js';
import { fmtData, $ } from '../utils/format.js';
import { state } from '../state.js';

function reservaItemHTML(r) {
    const mesa = mesaById(r.mesaId);
    const cancelavel = r.status === 'reservado' || r.status === 'ocupado';
    return `
        <li class="reserva">
            <div class="reserva__top">
                <span class="reserva__cliente">${r.cliente}</span>
                <span class="badge badge--${r.status}">${STATUS_LABEL[r.status]}</span>
            </div>
            <div class="reserva__meta">
                <span><i data-lucide="armchair" class="icon"></i> Mesa ${mesa ? mesa.numero : '?'} · ${r.quantidadePessoas} pessoa(s)</span>
                <span><i data-lucide="clock" class="icon"></i> ${fmtData(r.dataHora)}</span>
                ${r.observacoes ? `<span><i data-lucide="sticky-note" class="icon"></i> ${r.observacoes}</span>` : ''}
            </div>
            ${
                cancelavel
                    ? `<div class="reserva__actions"><button class="btn btn--ghost" data-cancelar="${r._id}"><i data-lucide="x-circle" class="icon"></i> Cancelar</button></div>`
                    : ''
            }
        </li>`;
}

export function renderReservaList() {
    const ul = $('#listaReservas');
    const lista = listarReservas(state.filtro);

    ul.innerHTML = lista.length
        ? lista.map(reservaItemHTML).join('')
        : `<li class="empty">Nenhuma reserva encontrada.</li>`;
}
