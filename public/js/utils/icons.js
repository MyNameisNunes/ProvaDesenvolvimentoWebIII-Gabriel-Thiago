/**
 * Renderiza/atualiza os ícones Lucide presentes no DOM.
 * Deve ser chamado sempre que HTML novo com <i data-lucide="..."> é inserido.
 */
export function refreshIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}
