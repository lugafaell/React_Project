const mongoose = require("mongoose");

const equipamentoSchema = new mongoose.Schema({
  linhaEquipamento: String,
  nomeEquipamento: String
});

const Equipamento = mongoose.model("Equipamento", equipamentoSchema);

module.exports = Equipamento;
