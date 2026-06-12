import express from "express";
import mongoose from "mongoose";
import reservasRouter from "./routes/reservas";
import mesasRouter from "./routes/mesas";

const app = express();
app.use(express.json());
app.use(express.static("public")); // frontend

app.use("/api/reservas", reservasRouter);
app.use("/api/mesas", mesasRouter);

const MONGO_URL = "mongodb://localhost:27017/reserva";
const PORT = 3000;

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log(`[${new Date().toISOString()}] Conectado ao MongoDB (banco: reserva)`);
    app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err.message);
    process.exit(1);
  });