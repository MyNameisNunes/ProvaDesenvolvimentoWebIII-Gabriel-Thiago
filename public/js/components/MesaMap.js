/** Mapa visual das mesas + contadores de status. */
import { listarMesas, statusDaMesa } from '../services/mesaService.js';
import { mesaCardHTML } from './MesaCard.js';
import { $ } from '../utils/format.js';

export function renderMesaMap() {
    const grid = $('#mapaMesas');
    const contadores = { livre: 0, reservado: 0, ocupado: 0 };

    grid.innerHTML = listarMesas()
        .map((mesa) => {
            const status = statusDaMesa(mesa._id);
            contadores[status]++;
            return mesaCardHTML(mesa, status);
        })
        .join('');

    $('#statLivre').textContent = contadores.livre;
    $('#statReservado').textContent = contadores.reservado;
    $('#statOcupado').textContent = contadores.ocupado;
}
