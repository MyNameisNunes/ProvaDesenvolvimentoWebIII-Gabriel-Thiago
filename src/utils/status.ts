export const DURACAO_MIN = 90; // duração padrão: 1h30

export type StatusReserva = "reservado" | "ocupado" | "finalizado" | "cancelado";

export function fimDaReserva(inicio: Date): Date {
  return new Date(inicio.getTime() + DURACAO_MIN * 60 * 1000);
}

export function statusAtual(reserva: { dataHora: Date; status: string }): StatusReserva {
  if (reserva.status === "cancelado") return "cancelado";
  const agora = new Date();
  const inicio = new Date(reserva.dataHora);
  if (agora < inicio) return "reservado";
  if (agora < fimDaReserva(inicio)) return "ocupado";
  return "finalizado";
}