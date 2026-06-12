import { Schema, model } from "mongoose";

const reservaSchema = new Schema({
  nomeCliente: { type: String, required: [true, "Nome do cliente é obrigatório."], trim: true },
  contato:     { type: String, required: [true, "Contato do cliente é obrigatório."], trim: true },
  numeroMesa:  { type: Number, required: [true, "Número da mesa é obrigatório."] },
  qtdPessoas:  { type: Number, required: [true, "Quantidade de pessoas é obrigatória."], min: [1, "Mínimo 1 pessoa."] },
  dataHora:    { type: Date,   required: [true, "Data e hora são obrigatórias."] },
  observacoes: { type: String, trim: true },
  status: {
    type: String,
    enum: ["reservado", "ocupado", "finalizado", "cancelado"],
    default: "reservado"
  }
}, { timestamps: true });

export const Reserva = model("Reserva", reservaSchema);