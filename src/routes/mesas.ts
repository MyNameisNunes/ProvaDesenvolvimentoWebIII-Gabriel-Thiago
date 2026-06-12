import { Router } from "express";
import { Mesa } from "../models/Mesa";
import { Reserva } from "../models/Reserva";
import { fimDaReserva } from "../utils/status";

const router = Router();

router.get("/", async (_req, res) => {
  const mesas = await Mesa.find().sort({ numero: 1 });
  return res.json(mesas);
});

router.post("/", async (req, res) => {
  try {
    const mesa = await Mesa.create(req.body);
    console.log(`[${new Date().toISOString()}] LOG criação: mesa ${mesa.numero}`);
    return res.status(201).json({ mensagem: "Mesa cadastrada com sucesso!", mesa });
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
});

router.get("/status", async (_req, res) => {
  const mesas = await Mesa.find().sort({ numero: 1 });
  const agora = new Date();
  const resultado = [];

  for (const mesa of mesas) {
    const reservas = await Reserva.find({ numeroMesa: mesa.numero, status: { $ne: "cancelado" } });
    let estado = "disponivel";
    for (const r of reservas) {
      const inicio = new Date(r.dataHora);
      const fim = fimDaReserva(inicio);
      if (agora >= inicio && agora < fim) { estado = "ocupado"; break; }
      if (inicio > agora) estado = "reservado";
    }
    resultado.push({ numero: mesa.numero, capacidade: mesa.capacidade, localizacao: mesa.localizacao, estado });
  }
  return res.json(resultado);
});

export default router;