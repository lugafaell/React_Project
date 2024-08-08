const express = require('express');
const Faturamento = require('../models/faturamento');

const router = express.Router();

router.post("/registrarFaturamento", async (req, res) => {
  console.log("Recebendo dados para faturamento:", req.body);

  const {
    hospital,
    estado,
    valorTotal,
    status,
    motivo,
    linkAutorizacao,
    nomePaciente,
    convenio,
    tipoProcedimento,
    dataProcedimento,
    horaProcedimento,
    carimboHorario,
    idPaciente,
    vendedor,
    equipamentos,
    materiais,
    CNPJ,
    formaPagamento,
    imagemBase64,
    imagemRemessa64,
    imagemDevolucao64,
    imagemComunicado64,
  } = req.body;

  if (!imagemBase64) {
    return res.status(400).send("A imagem Base64 não foi fornecida.");
  }

  try {
    const faturamento = await Faturamento.create({
      hospital,
      estado,
      valorTotal,
      status,
      motivo,
      linkAutorizacao,
      nomePaciente,
      convenio,
      tipoProcedimento,
      dataProcedimento,
      horaProcedimento,
      carimboHorario,
      idPaciente,
      vendedor,
      equipamentos,
      materiais,
      CNPJ,
      formaPagamento,
      imagemBase64,
      imagemRemessa64,
      imagemDevolucao64,
      imagemComunicado64,
    });

    console.log("Faturamento criado com sucesso:", faturamento);

    res
      .status(201)
      .send("Detalhes do pedido enviados para faturamento com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar para faturamento:", error);
    res.status(500).send("Erro interno ao enviar para faturamento.");
  }
});

router.get("/receberFaturamento", async (req, res) => {
  try {
    const faturamentos = await Faturamento.find();
    res.json(faturamentos);
  } catch (error) {
    console.error("Erro ao buscar faturamentos:", error);
    res.status(500).send("Erro interno ao buscar faturamentos.");
  }
});

router.get("/receberFaturamento/:id", async (req, res) => {
  const faturamentoId = req.params.id;

  try {
    const faturamento = await Faturamento.findOne({ _id: faturamentoId });

    if (!faturamento) {
      return res.status(404).json({ error: "Faturamento não encontrado" });
    }

    res.status(200).json(faturamento);
  } catch (error) {
    console.error("Erro ao obter detalhes do faturamento:", error);
    res.status(500).json({
      error: "Erro interno ao obter detalhes do faturamento",
    });
  }
});

router.post("/atualizarFaturamento/atualizar/:id", async (req, res) => {
  const faturamentoId = req.params.id;
  const {
    processoPaciente,
    valorTotal,
    status,
    motivo,
    novoEquipamentos,
    novoMateriais,
    contador,
    CNPJ,
  } = req.body;

  try {
    const faturamento = await Faturamento.findOneAndUpdate(
      { _id: faturamentoId },
      {
        processoPaciente,
        valorTotal,
        status,
        motivo,
        novoEquipamentos,
        novoMateriais,
        contador,
        CNPJ,
      },
      { new: true }
    );

    if (!faturamento) {
      return res.status(404).json({ error: "Faturamento não encontrado" });
    }

    res.status(200).json(faturamento);
  } catch (error) {
    console.error("Erro ao atualizar detalhes do faturamento:", error);
    res.status(500).json({
      error: "Erro interno ao atualizar detalhes do faturamento",
    });
  }
});

router.put("/atualizarFaturamento/:id", async (req, res) => {
  const faturamentoId = req.params.id;
  const updateData = req.body;

  try {
    const faturamento = await Faturamento.findOneAndUpdate(
      { _id: faturamentoId },
      updateData,
      { new: true }
    );

    if (!faturamento) {
      return res.status(404).json({ error: "Faturamento não encontrado" });
    }

    res.status(200).json(faturamento);
  } catch (error) {
    console.error("Erro ao atualizar o faturamento:", error);
    res.status(500).json({
      error: "Erro interno ao atualizar o faturamento",
    });
  }
});

router.delete("/deletarFaturamento/:id", async (req, res) => {
  const faturamentoId = req.params.id;

  try {
    const deletedFaturamento = await Faturamento.findOneAndDelete({
      _id: faturamentoId,
    });

    if (!deletedFaturamento) {
      return res.status(404).json({ error: "Faturamento não encontrado" });
    }

    res.status(200).send("Faturamento removido com sucesso!");
  } catch (error) {
    console.error("Erro ao remover o Faturamento:", error);
    res.status(500).send("Erro interno ao remover o Faturamento.");
  }
});

module.exports = router;