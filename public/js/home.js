/**
 * Script da home de espera.
 * Relógio ao vivo + indicadores de fila/espera (simulados, só para apresentação).
 * Carregado como script clássico (não-módulo); o app real fica em mesas.html.
 */
(function () {
    // Ícones
    if (window.lucide) window.lucide.createIcons();

    // Relógio
    const elHora = document.getElementById('heroHora');
    function tickHora() {
        const agora = new Date();
        elHora.textContent = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    tickHora();
    setInterval(tickHora, 1000 * 30);

    // Indicadores de fila/espera (variação leve para dar vida à página)
    const elEspera = document.getElementById('heroEspera');
    const elFila = document.getElementById('heroFila');
    function atualizarFila() {
        const fila = 4 + Math.floor(Math.random() * 9); // 4 a 12 grupos
        const espera = fila * 3 + Math.floor(Math.random() * 6); // ~min
        elFila.textContent = fila;
        elEspera.textContent = '~' + espera + ' min';
    }
    atualizarFila();
    setInterval(atualizarFila, 1000 * 8);
})();
