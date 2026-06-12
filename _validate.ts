// Harness temporário só para validar as rotas (porta 3001). Não é commitado.
import express from "express";
import mongoose from "mongoose";
import reservasRouter from "./src/routes/reservas";
import mesasRouter from "./src/routes/mesas";

const app = express();
app.use(express.json());
app.use("/api/reservas", reservasRouter);
app.use("/api/mesas", mesasRouter);

mongoose.connect("mongodb://localhost:27017/reserva").then(() => {
  app.listen(3001, () => console.log("VALIDATE up on 3001"));
});
