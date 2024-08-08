const express = require('express');
const Funcionario = require('../models/funcionario');

const router = express.Router();

router.post('/funcionarios', async (req, res) => {
  const { cargoFuncionario, nomeFuncionario } = req.body;

  if (!cargoFuncionario || !nomeFuncionario) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const funcionarioExistente = await Funcionario.findOne({ cargoFuncionario, nomeFuncionario });

    if (funcionarioExistente) {
      return res.status(400).json({ message: 'Já existe um funcionário com este nome e cargo' });
    }

    const novoFuncionario = new Funcionario({ cargoFuncionario, nomeFuncionario });
    await novoFuncionario.save();
    res.status(201).json({ message: 'Funcionario registrado com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar funcionário', error });
  }
});

router.get('/funcionarios', async (req, res) => {
  const { nome, cargo } = req.query;

  try {
      const query = {};
      if (nome) query.nomeFuncionario = nome;
      if (cargo) query.cargoFuncionario = cargo;

      const funcionarios = await Funcionario.find(query);
      res.status(200).json(funcionarios);
  } catch (error) {
      res.status(500).json({ message: 'Erro ao obter funcionários', error });
  }
});

module.exports = router;