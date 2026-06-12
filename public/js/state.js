
export const state = {
    mesas: [],
    reservas: [],
    filtro: 'todas',
};

const listeners = [];

export function onChange(fn) {
    listeners.push(fn);
}

export function notify() {
    listeners.forEach((fn) => fn());
}

export function setFiltro(filtro) {
    state.filtro = filtro;
    notify();
}
