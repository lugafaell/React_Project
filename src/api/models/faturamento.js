const mongoose = require('mongoose');

const faturamentoSchema = new mongoose.Schema({
  hospital: String,
  estado: String,
  linkAutorizacao: String,
  convenio: String,
  tipoProcedimento: String,
  dataProcedimento: String,
  horaProcedimento: String,
  carimboHorario: String,
  processoPaciente: String,
  nomePaciente: String,
  idPaciente: String,
  vendedor: String,
  valorTotal: Number,
  status: String,
  motivo: String,
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
  novoEquipamentos: [
    {
      nome: String,
      serial: Number,
      valor: Number,
    },
  ],
  novoMateriais: [
    {
      nome: String,
      serial: Number,
      valor: Number,
    },
  ],
  contador: Number,
  contadorPedidos: Number,
  CNPJ: String,
  formaPagamento: String,
  nomeEntregador: String,
  imagemBase64: String,
  imagemRemessa64: String,
  imagemDevolucao64: String,
  imagemComunicado64: String,
});

const Faturamento = mongoose.model('Faturamento', faturamentoSchema);

module.exports = Faturamento;