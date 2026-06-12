/**
 * Serviço de mesas — integra ao backend via api.js usando state como cache.
 * carregarMesas() é assíncrono (GET /mesas); as demais funções continuam SÍNCRONAS
 * lendo do cache, para que os componentes não precisem mudar.
 */
import { state, notify } from '../state.js';
import { DURACAO_PADRAO } from '../config.js';
import { apiListarMesas } from './api.js';

/** Busca as mesas no backend e atualiza o cache. */
export async function carregarMesas() {
    state.mesas = await apiListarMesas();
    notify();
}

export function listarMesas() {
    return state.mesas;
}

export function mesaById(id) {
    return state.mesas.find((m) => m._id === id);
}

/** Localiza a mesa pelo seu número (usado para normalizar reservas do backend). */
export function mesaByNumero(numero) {
    return state.mesas.find((m) => m.numero === numero);
}

/**
 * Deriva o status atual de uma mesa a partir das reservas ativas.
 * Regra: ocupado (reserva acontecendo agora) > reservado (reserva futura) > livre.
 */
export function statusDaMesa(mesaId) {
    const agora = Date.now();
    const ativas = state.reservas.filter(
        (r) => r.mesaId === mesaId && r.status !== 'cancelado' && r.status !== 'finalizado'
    );

    for (const r of ativas) {
        const inicio = new Date(r.dataHora).getTime();
        const fim = inicio + (r.duracaoMinutos || DURACAO_PADRAO) * 60000;
        if (agora >= inicio && agora < fim) return 'ocupado';
    }

    if (ativas.some((r) => new Date(r.dataHora).getTime() > agora)) return 'reservado';
    return 'livre';
}

/** Reserva ativa (não cancelada/finalizada) de uma mesa, se houver. */
export function reservaAtivaDaMesa(mesaId) {
    return state.reservas.find(
        (r) => r.mesaId === mesaId && r.status !== 'cancelado' && r.status !== 'finalizado'
    );
}
