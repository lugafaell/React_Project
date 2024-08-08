const mongoose = require('mongoose');

const funcionarioSchema = new mongoose.Schema({
  cargoFuncionario: String,
  nomeFuncionario: String,
});

const Funcionario = mongoose.model('Funcionario', funcionarioSchema);

module.exports = Funcionario;