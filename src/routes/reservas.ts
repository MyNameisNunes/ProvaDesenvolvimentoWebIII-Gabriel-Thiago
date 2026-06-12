import { Router } from "express";
import { Reserva } from "../models/Reserva";
import { Mesa } from "../models/Mesa";
import { DURACAO_MIN, fimDaReserva, statusAtual } from "../utils/status";

const router = Router();

async function temConflito(numeroMesa: number, inicio: Date, ignorarId?: string) {
  const janelaInicio = new Date(inicio.getTime() - DURACAO_MIN * 60 * 1000);
  const janelaFim = fimDaReserva(inicio);
  return Reserva.findOne({
    ...(ignorarId ? { _id: { $ne: ignorarId } } : {}),
    numeroMesa,
    status: { $ne: "cancelado" },
    dataHora: { $gt: janelaInicio, $lt: janelaFim }
  });
}

router.post("/", async (req, res) => {
  try {
    const { numeroMesa, qtdPessoas, dataHora } = req.body;
    const inicio = new Date(dataHora);

    const mesa = await Mesa.findOne({ numero: numeroMesa });
    if (!mesa) return res.status(404).json({ erro: "Mesa não encontrada." });

    if (qtdPessoas > mesa.capacidade)
      return res.status(400).json({ erro: `A mesa ${mesa.numero} comporta no máximo ${mesa.capacidade} pessoas.` });

    if (inicio < new Date(Date.now() + 60 * 60 * 1000))
      return res.status(400).json({ erro: "Reservas devem ser feitas com antecedência mínima de 1 hora." });

    if (await temConflito(numeroMesa, inicio))
      return res.status(409).json({ erro: "Já existe uma reserva para esta mesa neste horário." });

    const reserva = await Reserva.create(req.body);
    console.log(`[${new Date().toISOString()}] LOG criação: reserva ${reserva._id} | mesa ${numeroMesa} | ${reserva.nomeCliente}`);
    return res.status(201).json({ mensagem: "Reserva criada com sucesso!", reserva });
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
});

router.get("/", async (req, res) => {
  const filtro: any = {};
  if (req.query.cliente) filtro.nomeCliente = new RegExp(String(req.query.cliente), "i");
  if (req.query.mesa)    filtro.numeroMesa = Number(req.query.mesa);
  if (req.query.status)  filtro.status = req.query.status;
  if (req.query.data) {
    const d = new Date(String(req.query.data) + "T00:00:00");
    const fim = new Date(d); fim.setDate(fim.getDate() + 1);
    filtro.dataHora = { $gte: d, $lt: fim };
  }

  const reservas = await Reserva.find(filtro).sort({ dataHora: 1 });

  // atualiza status conforme o tempo e persiste se mudou
  const resultado = [];
  for (const r of reservas) {
    const atual = statusAtual(r);
    if (atual !== r.status) { r.status = atual; await r.save(); }
    resultado.push(r);
  }
  return res.json(resultado);
});

router.put("/:id", async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) return res.status(404).json({ erro: "Reserva não encontrada." });

    const numeroMesa = req.body.numeroMesa ?? reserva.numeroMesa;
    const qtdPessoas = req.body.qtdPessoas ?? reserva.qtdPessoas;
    const dataHora   = req.body.dataHora   ?? reserva.dataHora;
    const inicio     = new Date(dataHora);

    const mudouMesa    = numeroMesa !== reserva.numeroMesa;
    const mudouHorario = inicio.getTime() !== new Date(reserva.dataHora).getTime();

    const mesa = await Mesa.findOne({ numero: numeroMesa });
    if (!mesa) return res.status(404).json({ erro: "Mesa não encontrada." });

    if (qtdPessoas > mesa.capacidade)
      return res.status(400).json({ erro: `A mesa ${mesa.numero} comporta no máximo ${mesa.capacidade} pessoas.` });

    if (mudouHorario && inicio < new Date(Date.now() + 60 * 60 * 1000))
      return res.status(400).json({ erro: "Reservas devem ser feitas com antecedência mínima de 1 hora." });

    if ((mudouMesa || mudouHorario) && await temConflito(numeroMesa, inicio, req.params.id))
      return res.status(409).json({ erro: "Já existe uma reserva para esta mesa neste horário." });

    Object.assign(reserva, req.body);
    await reserva.save();
    console.log(`[${new Date().toISOString()}] LOG atualização: reserva ${reserva._id}`);
    return res.json({ mensagem: "Reserva atualizada com sucesso!", reserva });
  } catch (err: any) {
    return res.status(400).json({ erro: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const reserva = await Reserva.findByIdAndUpdate(req.params.id, { status: "cancelado" }, { new: true });
  if (!reserva) return res.status(404).json({ erro: "Reserva não encontrada." });
  console.log(`[${new Date().toISOString()}] LOG cancelamento: reserva ${reserva._id}`);
  return res.json({ mensagem: "Reserva cancelada com sucesso!", reserva });
});

export default router;