/** Painel de data e hora ao vivo (atualiza a cada segundo). */
import { $ } from '../utils/format.js';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export function iniciarRelogio() {
    const elTime = $('#relogio .clock__time');
    const elDate = $('#relogio .clock__date');
    if (!elTime || !elDate) return;

    function tick() {
        const agora = new Date();
        elTime.textContent = agora.toLocaleTimeString('pt-BR');
        elDate.textContent = cap(
            agora.toLocaleDateString('pt-BR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            })
        );
    }

    tick();
    setInterval(tick, 1000);
}
