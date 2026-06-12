import { Schema, model } from "mongoose";

const mesaSchema = new Schema({
  numero:      { type: Number, required: [true, "Número da mesa é obrigatório."], unique: true },
  capacidade:  { type: Number, required: [true, "Capacidade é obrigatória."], min: [1, "Capacidade mínima é 1."] },
  localizacao: { type: String, required: [true, "Localização é obrigatória."], trim: true }
});

export const Mesa = model("Mesa", mesaSchema);