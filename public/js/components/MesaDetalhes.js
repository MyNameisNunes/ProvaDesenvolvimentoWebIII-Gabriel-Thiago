/** Detalhes de uma mesa reservada/ocupada (conteúdo do modal). */
import { STATUS_LABEL } from '../config.js';
import { fmtData } from '../utils/format.js';

export function mesaDetalhesHTML(mesa, status, reserva) {
    return `
        <h3>Mesa ${mesa.numero}</h3>
        <p class="modal__sub">${STATUS_LABEL[status]} · ${mesa.capacidade} lugares · ${mesa.localizacao}</p>
        ${
            reserva
                ? `<div class="detail-line"><span>Cliente</span><span>${reserva.cliente}</span></div>
                   <div class="detail-line"><span>Contato</span><span>${reserva.contato || '—'}</span></div>
                   <div class="detail-line"><span>Pessoas</span><span>${reserva.quantidadePessoas}</span></div>
                   <div class="detail-line"><span>Horário</span><span>${fmtData(reserva.dataHora)}</span></div>
                   ${reserva.observacoes ? `<div class="detail-line"><span>Obs.</span><span>${reserva.observacoes}</span></div>` : ''}
                   <div style="margin-top:18px">
                       <button class="btn btn--ghost btn--block" data-cancelar="${reserva._id}"><i data-lucide="x-circle" class="icon"></i> Cancelar reserva</button>
                   </div>`
                : '<p class="modal__sub">Sem reserva ativa.</p>'
        }`;
}
