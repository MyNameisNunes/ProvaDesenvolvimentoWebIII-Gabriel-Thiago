/** Utilidades de DOM e formatação. */

export const $ = (sel, root = document) => root.querySelector(sel);

export const fmtData = (iso) =>
    new Date(iso).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
