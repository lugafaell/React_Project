const express = require('express');
const Agenda = require('../models/agenda');

const router = express.Router();

router.get('/datasRegistradas', async (req, res) => {
    try {
      // Encontre o documento Agenda, se existir
      const agenda = await Agenda.findOne();
  
      // Se não houver documento Agenda, retorne uma resposta vazia
      if (!agenda) {
        return res.status(404).json({ message: 'Agenda not found' });
      }
  
      // Se o documento Agenda existir, retorne as datas registradas
      res.json({
        dataInicioCE: agenda.dataInicioCE,
        dataFinalCE: agenda.dataFinalCE,
        dataInicioPI: agenda.dataInicioPI,
        dataFinalPI: agenda.dataFinalPI,
        dataInicioMA: agenda.dataInicioMA,
        dataFinalMA: agenda.dataFinalMA,
        dataInicioCARI: agenda.dataInicioCARI,
        dataFinalCARI: agenda.dataFinalCARI
      });
    } catch (error) {
      console.error('Erro ao recuperar datas registradas:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

router.post('/registrarDatas', async (req, res) => {
    try {
      const { dataInicioCE, dataFinalCE, dataInicioPI, dataFinalPI, dataInicioMA, dataFinalMA, dataInicioCARI, dataFinalCARI } = req.body;
  
      const agenda = new Agenda({
        dataInicioCE,
        dataFinalCE,
        dataInicioPI,
        dataFinalPI,
        dataInicioMA,
        dataFinalMA,
        dataInicioCARI,
        dataFinalCARI
      });
  
      await agenda.save();
  
      res.status(201).json({ message: 'Datas registradas com sucesso' });
    } catch (error) {
      console.error('Erro ao registrar datas:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put('/atualizarDatas', async (req, res) => {
    try {
      // Verifique se já existe um documento Agenda no banco de dados
      let agenda = await Agenda.findOne();
  
      // Se não existir, crie um novo documento Agenda
      if (!agenda) {
        agenda = new Agenda({});
      }
  
      // Atualize as datas com os valores do corpo da requisição
      agenda.dataInicioCE = req.body.dataInicioCE || agenda.dataInicioCE;
      agenda.dataFinalCE = req.body.dataFinalCE || agenda.dataFinalCE;
      agenda.dataInicioPI = req.body.dataInicioPI || agenda.dataInicioPI;
      agenda.dataFinalPI = req.body.dataFinalPI || agenda.dataFinalPI;
      agenda.dataInicioMA = req.body.dataInicioMA || agenda.dataInicioMA;
      agenda.dataFinalMA = req.body.dataFinalMA || agenda.dataFinalMA;
      agenda.dataInicioCARI = req.body.dataInicioCARI || agenda.dataInicioCARI;
      agenda.dataFinalCARI = req.body.dataFinalCARI || agenda.dataFinalCARI;
  
      // Salve o documento Agenda atualizado
      const updatedAgenda = await agenda.save();
  
      // Retorne as datas atualizadas como resposta
      res.json(updatedAgenda);
    } catch (error) {
      console.error('Erro ao atualizar datas:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

module.exports = router;