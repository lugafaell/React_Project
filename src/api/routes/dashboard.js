const express = require('express');
const Dash = require('../models/dashboard');
const Registro = require('../models/registro');
const Faturamento = require('../models/faturamento');

const router = express.Router();

router.post("/registrarMeta", async (req, res) => {
  try {
    const { meta } = req.body;

    const newMeta = new Dash({ meta });

    await newMeta.save();

    res
      .status(201)
      .json({ message: "Meta registrada com sucesso", meta: newMeta });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao registrar a meta", details: error.message });
  }
});

router.get("/receberMeta", async (req, res) => {
  try {
    // Encontrando a última meta registrada no banco de dados
    const latestMeta = await Dash.findOne().sort({ _id: -1 });

    if (!latestMeta) {
      return res.status(404).json({ message: "Nenhuma meta encontrada" });
    }

    res.status(200).json({ meta: latestMeta.meta });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao recuperar a meta", details: error.message });
  }
});

router.put("/atualizarMeta", async (req, res) => {
  try {
    const { meta } = req.body;

    // Encontrar e atualizar a última meta registrada
    const latestMeta = await Dash.findOne().sort({ _id: -1 });

    if (!latestMeta) {
      return res.status(404).json({ message: "Nenhuma meta encontrada" });
    }

    // Atualizar a meta encontrada
    latestMeta.meta = meta;
    await latestMeta.save();

    res
      .status(200)
      .json({ message: "Meta atualizada com sucesso", meta: latestMeta.meta });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar a meta", details: error.message });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    // Contando o número de pedidos realizados na coleção 'registros'
    const pedidosRealizados = await Registro.countDocuments();

    // Contando o número de pedidos pendentes (sem status e motivo) na coleção 'faturamentos'
    const pedidosPendentes = await Faturamento.countDocuments({
      $and: [{ status: { $exists: false } }, { motivo: { $exists: false } }],
    });

    // Contando o número de pedidos concluídos (com status "FATURADO" e motivo "FINALIZADO") na coleção 'faturamentos'
    const pedidosConcluidos = await Faturamento.countDocuments({
      status: "FATURADO",
      motivo: "FINALIZADO",
    });

    // Calculando o valor total somado dos pedidos na coleção 'faturamentos'
    const pipeline = [
      {
        $match: {
          valorTotal: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$valorTotal" },
        },
      },
    ];

    const result = await Faturamento.aggregate(pipeline);
    const valorTotalSomado = result.length > 0 ? result[0].total : 0;

    // Enviando os dados como resposta
    res.json({
      pedidosRealizados,
      pedidosPendentes,
      pedidosConcluidos,
      valorTotalSomado,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    res.status(500).send("Erro interno ao buscar dados do dashboard.");
  }
});

router.get("/contador-geral", async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalPedidos: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];

    const resultados = await Faturamento.aggregate(pipeline);

    res.json(resultados);
  } catch (error) {
    console.error("Erro ao calcular o contador geral:", error);
    res.status(500).send("Erro interno ao calcular o contador geral.");
  }
});

module.exports = router;