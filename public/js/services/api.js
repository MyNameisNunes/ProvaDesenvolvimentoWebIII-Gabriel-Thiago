/**
 * Camada de comunicação com o backend (Express + MongoDB).
 * Todas as rotas vivem sob /api. As respostas de erro seguem o formato { erro: "..." }.
 */

const BASE = '/api';

async function request(url, options = {}) {
    let res;
    try {
        res = await fetch(BASE + url, {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        });
    } catch {
        throw new Error('Não foi possível conectar ao servidor.');
    }

    let body = null;
    try {
        body = await res.json();
    } catch {
        /* resposta sem corpo JSON */
    }

    if (!res.ok) {
        throw new Error((body && body.erro) || 'Erro ao processar a solicitação.');
    }
    return body;
}

// ===== Mesas =====
export const apiListarMesas = () => request('/mesas');
export const apiStatusMesas = () => request('/mesas/status');
export const apiCriarMesa = (mesa) =>
    request('/mesas', { method: 'POST', body: JSON.stringify(mesa) });

// ===== Reservas =====
export const apiListarReservas = (query = '') => request('/reservas' + query);
export const apiCriarReserva = (dados) =>
    request('/reservas', { method: 'POST', body: JSON.stringify(dados) });
export const apiAtualizarReserva = (id, dados) =>
    request('/reservas/' + id, { method: 'PUT', body: JSON.stringify(dados) });
export const apiCancelarReserva = (id) =>
    request('/reservas/' + id, { method: 'DELETE' });
