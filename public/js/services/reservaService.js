/**
 * Serviço de reservas — integra ao backend via api.js usando state como cache.
 *
 * As regras de negócio (antecedência, capacidade, conflito de horário) são validadas
 * no BACKEND. Aqui apenas traduzimos os campos entre o formato do frontend
 * (cliente/mesaId/quantidadePessoas) e o do backend (nomeCliente/numeroMesa/qtdPessoas)
 * e repassamos a mensagem de erro da API para o toast.
 *
 * listarReservas()/reservaById() continuam SÍNCRONOS (leem do cache);
 * criarReserva()/cancelarReserva() são ASSÍNCRONOS e recarregam o cache no sucesso.
 */
import { state, notify } from '../state.js';
import { DURACAO_PADRAO } from '../config.js';
import { mesaById, mesaByNumero, carregarMesas } from './mesaService.js';
import { apiListarReservas, apiCriarReserva, apiCancelarReserva } from './api.js';

/** Converte uma reserva do backend para o formato esperado pelos componentes. */
function normalizar(r) {
    const mesa = mesaByNumero(r.numeroMesa);
    return {
        _id: r._id,
        cliente: r.nomeCliente,
        contato: r.contato,
        // os componentes casam reserva.mesaId com mesa._id
        mesaId: mesa ? mesa._id : r.numeroMesa,
        numeroMesa: r.numeroMesa,
        quantidadePessoas: r.qtdPessoas,
        dataHora: r.dataHora,
        duracaoMinutos: DURACAO_PADRAO,
        observacoes: r.observacoes || '',
        status: r.status,
    };
}

/** Busca as reservas no backend e atualiza o cache (mesas devem já estar carregadas). */
export async function carregarReservas() {
    const dados = await apiListarReservas();
    state.reservas = dados.map(normalizar);
    notify();
}

export function listarReservas(filtro = 'todas') {
    let lista = [...state.reservas].sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
    if (filtro !== 'todas') lista = lista.filter((r) => r.status === filtro);
    return lista;
}

export function reservaById(id) {
    return state.reservas.find((r) => r._id === id);
}

/**
 * Cria uma reserva via API. As validações ocorrem no backend.
 * @returns {Promise<{ ok: boolean, erro?: string }>}
 */
export async function criarReserva(dados) {
    if (!dados.cliente || !dados.contato || !dados.mesaId || !dados.dataHora) {
        return { ok: false, erro: 'Preencha todos os campos obrigatórios.' };
    }

    const mesa = mesaById(dados.mesaId);
    if (!mesa) return { ok: false, erro: 'Selecione uma mesa válida.' };

    const payload = {
        nomeCliente: dados.cliente,
        contato: dados.contato,
        numeroMesa: mesa.numero,
        qtdPessoas: dados.quantidadePessoas,
        dataHora: dados.dataHora,
        observacoes: dados.observacoes,
    };

    try {
        await apiCriarReserva(payload);
        // recarrega para refletir a nova reserva e recalcular o status das mesas
        await carregarMesas();
        await carregarReservas();
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: e.message };
    }
}

export async function cancelarReserva(id) {
    try {
        await apiCancelarReserva(id);
        await carregarReservas();
        return { ok: true };
    } catch (e) {
        return { ok: false, erro: e.message };
    }
}
