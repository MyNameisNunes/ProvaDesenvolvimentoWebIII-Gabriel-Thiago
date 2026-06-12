/** Formulário de nova reserva (conteúdo do modal). */
import { listarMesas } from '../services/mesaService.js';

export function reservaFormHTML(mesaPre = null) {
    const opcoes = listarMesas()
        .map(
            (m) =>
                `<option value="${m._id}" ${mesaPre && m._id === mesaPre._id ? 'selected' : ''}>Mesa ${m.numero} (${m.capacidade} lugares · ${m.localizacao})</option>`
        )
        .join('');

    return `
        <h3>Nova reserva</h3>
        <p class="modal__sub">Preencha os dados para reservar a mesa.</p>
        <form id="formReserva">
            <div class="field">
                <label>Cliente</label>
                <input name="cliente" required placeholder="Nome do cliente" />
            </div>
            <div class="field">
                <label>Contato</label>
                <input name="contato" required placeholder="(00) 00000-0000" />
            </div>
            <div class="field">
                <label>Mesa</label>
                <select name="mesaId" required>${opcoes}</select>
            </div>
            <div class="field--row">
                <div class="field">
                    <label>Pessoas</label>
                    <input name="quantidadePessoas" type="number" min="1" required value="2" />
                </div>
                <div class="field">
                    <label>Data e hora</label>
                    <input name="dataHora" type="datetime-local" required />
                </div>
            </div>
            <div class="field">
                <label>Observações (opcional)</label>
                <textarea name="observacoes" placeholder="Ex.: mesa perto da janela"></textarea>
            </div>
            <button type="submit" class="btn btn--primary btn--block">Confirmar reserva</button>
        </form>`;
}

/** Extrai e normaliza os dados do formulário. */
export function lerFormReserva(form) {
    return {
        cliente: form.cliente.value.trim(),
        contato: form.contato.value.trim(),
        mesaId: form.mesaId.value,
        quantidadePessoas: Number(form.quantidadePessoas.value),
        dataHora: form.dataHora.value ? new Date(form.dataHora.value).toISOString() : '',
        observacoes: form.observacoes.value.trim(),
    };
}
