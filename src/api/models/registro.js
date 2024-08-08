const mongoose = require('mongoose');

const registroSchema = new mongoose.Schema({
  idPaciente: {
    type: String,
    default: () => `PAC${Math.random().toString(36).substr(2, 9)}`,
  },
  situacao: String,
  motivoCancelamento: String,
  estado: String,
  hospital: String,
  linha: String,
  dataProcedimento: String,
  horaProcedimento: String,
  linkAutorizacao: String,
  carimboHorario: String,
  medico: String,
  nomePaciente: String,
  responsabilidade: String,
  tipoProcedimento: String,
  vendedor: String,
  instrumentador: String,
  imagemComunicadoUso64: String,
  imagemNotaFiscal64: String,
  imagemRemessa64: String,
  imagemDevolucao64: String,
  convenio: String,
  equipamentos: [
    {
      nome: String,
      quantidade: Number,
    },
  ],
  materiais: [
    {
      nome: String,
      quantidade: Number,
    },
  ],
});

const Registro = mongoose.model('Registro', registroSchema);

module.exports = Registro;