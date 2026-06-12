import mongoose from "mongoose";
import { Mesa } from "./models/Mesa";

const mesas = [
  { numero: 1, capacidade: 2, localizacao: "salão" },
  { numero: 2, capacidade: 2, localizacao: "salão" },
  { numero: 3, capacidade: 4, localizacao: "salão" },
  { numero: 4, capacidade: 4, localizacao: "área interna" },
  { numero: 5, capacidade: 6, localizacao: "área interna" },
  { numero: 6, capacidade: 4, localizacao: "varanda" },
  { numero: 7, capacidade: 8, localizacao: "varanda" },
  { numero: 8, capacidade: 2, localizacao: "varanda" }
];

mongoose.connect("mongodb://localhost:27017/reserva").then(async () => {
  await Mesa.deleteMany({});
  await Mesa.insertMany(mesas);
  console.log("Mesas cadastradas com sucesso!");
  await mongoose.disconnect();
});