const express = require("express");
const Equipamento = require("../models/equipamento");

const router = express.Router();

router.post("/equipamentos", async (req, res) => {
  const { nomeEquipamento, linhaEquipamento, codigoEquipamento } = req.body;

  if (!nomeEquipamento || !linhaEquipamento || !codigoEquipamento) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const novoEquipamento = new Equipamento({
      nomeEquipamento,
      linhaEquipamento,
      codigoEquipamento,
    });
    await novoEquipamento.save();
    res.status(201).json({ message: "Item registrado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar o Item", error });
  }
});

router.get("/equipamentos", async (req, res) => {
  const { nome, linha, code } = req.query;

  try {
      const query = {};
      if (nome) query.nomeEquipamento = nome;
      if (linha) query.linhaEquipamento = linha;
      if (code) query.codigoEquipamento

      const equipamentos = await Equipamento.find(query);
      res.status(200).json(equipamentos);
  } catch (error) {
      res.status(500).json({ message: "Erro ao obter Itens", error });
  }
});

module.exports = router;
