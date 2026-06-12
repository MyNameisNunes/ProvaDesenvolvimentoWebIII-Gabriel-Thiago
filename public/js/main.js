import { onChange, setFiltro } from './state.js';
import { renderMesaMap } from './components/MesaMap.js';
import { renderReservaList } from './components/ReservaList.js';
import { openModal, closeModal } from './components/Modal.js';
import { toast } from './components/Toast.js';
import { reservaFormHTML, lerFormReserva } from './components/ReservaForm.js';
import { mesaDetalhesHTML } from './components/MesaDetalhes.js';
import { mesaById, statusDaMesa, reservaAtivaDaMesa, carregarMesas } from './services/mesaService.js';
import { criarReserva, cancelarReserva, carregarReservas } from './services/reservaService.js';
import { iniciarRelogio } from './components/Relogio.js';
import { refreshIcons } from './utils/icons.js';
import { $ } from './utils/format.js';

// ===== Render principal (reage a notify()) =====
function render() {
    renderMesaMap();
    renderReservaList();
    refreshIcons(); // ícones Lucide do conteúdo recém-renderizado
}
onChange(render);

// ===== Abrir modais =====
function abrirFormulario(mesaPre = null) {
    openModal(reservaFormHTML(mesaPre));
}

function abrirMesa(mesaId) {
    const mesa = mesaById(mesaId);
    const status = statusDaMesa(mesaId);

    if (status === 'livre') return abrirFormulario(mesa);

    openModal(mesaDetalhesHTML(mesa, status, reservaAtivaDaMesa(mesaId)));
}

// ===== Eventos =====

// Clique numa mesa do mapa
$('#mapaMesas').addEventListener('click', (e) => {
    const card = e.target.closest('[data-mesa]');
    if (card) abrirMesa(card.dataset.mesa);
});

// Botão "Nova reserva"
$('#btnNovaReserva').addEventListener('click', () => abrirFormulario(null));

// Filtros da lista de reservas
$('#filtros').addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    document.querySelectorAll('.chip').forEach((c) => c.classList.remove('is-active'));
    chip.classList.add('is-active');
    setFiltro(chip.dataset.status);
});

// Delegação global: fechar modal e cancelar reserva
document.addEventListener('click', async (e) => {
    if (e.target.matches('[data-close]')) closeModal();

    const btnCancelar = e.target.closest('[data-cancelar]');
    if (btnCancelar) {
        btnCancelar.disabled = true;
        const { ok, erro } = await cancelarReserva(btnCancelar.dataset.cancelar);
        closeModal();
        toast(ok ? 'Reserva cancelada.' : erro, ok ? 'ok' : 'erro');
    }
});

// Submit do formulário de reserva
document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'formReserva') return;
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;

    const { ok, erro } = await criarReserva(lerFormReserva(e.target));
    if (!ok) {
        if (btn) btn.disabled = false;
        return toast(erro, 'erro');
    }
    closeModal();
    toast('Reserva criada com sucesso!', 'ok');
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ===== Init =====
async function init() {
    iniciarRelogio();
    refreshIcons(); // ícones estáticos do cabeçalho (relógio, botão, dica)
    try {
        await carregarMesas();      // GET /api/mesas
        await carregarReservas();   // GET /api/reservas (normaliza p/ os componentes)
    } catch {
        toast('Não foi possível carregar os dados do servidor.', 'erro');
    }
    render(); // carregar*() já chamam notify(); este garante o 1º render mesmo se falhar
}

init();
