const express = require('express');
const Registro = require('../models/registro');

const router = express.Router();

router.post("/enviarPedido", (req, res) => {
  const {
    situacao,
    motivoCancelamento,
    estado,
    hospital,
    linha,
    dataProcedimento,
    horaProcedimento,
    linkAutorizacao,
    linkComunicado,
    carimboHorario,
    medico,
    nomePaciente,
    responsabilidade,
    tipoProcedimento,
    vendedor,
    instrumentador,
    convenio,
    equipamentos,
    materiais,
    imagemComunicadoUso64,
    imagemNotaFiscal64,
    imagemRemessa64,
    imagemDevolucao64,
  } = req.body;

  const idPaciente = `ITMF${Math.random().toString(36).substr(2, 9)}`;

  Registro.create({
    idPaciente,
    situacao,
    motivoCancelamento,
    estado,
    hospital,
    linha,
    dataProcedimento,
    horaProcedimento,
    linkAutorizacao,
    linkComunicado,
    carimboHorario,
    medico,
    nomePaciente,
    responsabilidade,
    tipoProcedimento,
    vendedor,
    instrumentador,
    convenio,
    equipamentos,
    materiais,
    imagemComunicadoUso64,
    imagemNotaFiscal64,
    imagemRemessa64,
    imagemDevolucao64,
  })
    .then(() => {
      res.status(201).send("Registro salvo com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao salvar o registro:", error);
      res.status(500).send("Erro interno ao salvar o registro.");
    });
});

router.get("/receberPedidos", async (req, res) => {
  try {
    const pedidos = await Registro.find();
    res.json(pedidos);
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    res.status(500).send("Erro interno ao buscar pedidos.");
  }
});

router.get("/receberID/:id", async (req, res) => {
  const pedidoId = req.params.id;

  try {
    const pedido = await Registro.findOne({ idPaciente: pedidoId });

    if (!pedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.status(200).json(pedido);
  } catch (error) {
    console.error("Erro ao obter informações do pedido:", error);
    res.status(500).json({
      error: "Erro interno ao obter informações do pedido",
    });
  }
});

router.put("/atualizarPedido/:id", async (req, res) => {
  const pacienteId = req.params.id;
  const {
    idPaciente,
    situacao,
    motivoCancelamento,
    estado,
    hospital,
    linha,
    dataProcedimento,
    horaProcedimento,
    linkAutorizacao,
    linkComunicado,
    carimboHorario,
    medico,
    nomePaciente,
    responsabilidade,
    tipoProcedimento,
    vendedor,
    instrumentador,
    convenio,
    equipamentos,
    materiais,
    imagemComunicadoUso64,
    imagemNotaFiscal64,
    imagemRemessa64,
    imagemDevolucao64,
  } = req.body;

  try {
    const registro = await Registro.findOneAndUpdate(
      { idPaciente: pacienteId },
      {
        idPaciente,
        situacao,
        motivoCancelamento,
        estado,
        hospital,
        linha,
        dataProcedimento,
        horaProcedimento,
        linkAutorizacao,
        linkComunicado,
        carimboHorario,
        medico,
        nomePaciente,
        responsabilidade,
        tipoProcedimento,
        vendedor,
        instrumentador,
        convenio,
        equipamentos,
        materiais,
        imagemComunicadoUso64,
        imagemNotaFiscal64,
        imagemRemessa64,
        imagemDevolucao64,
      },
      { new: true } 
    );

    if (!registro) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    console.log(
      `Registro atualizado com sucesso para o paciente: ${pacienteId}`
    );
    res.status(200).json(registro);
  } catch (error) {
    console.error("Erro ao atualizar registro:", error);
    res.status(500).json({ error: "Erro interno ao atualizar registro" });
  }
});

router.delete("/deletarPedido/:id", async (req, res) => {
  const pedidoId = req.params.id;

  try {
    const deletedPedido = await Registro.findOneAndDelete({
      idPaciente: pedidoId,
    });

    if (!deletedPedido) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.status(200).send("Pedido removido com sucesso!");
  } catch (error) {
    console.error("Erro ao remover o pedido:", error);
    res.status(500).send("Erro interno ao remover o pedido.");
  }
});

module.exports = router;