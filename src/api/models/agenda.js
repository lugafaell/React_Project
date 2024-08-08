const mongoose = require('mongoose');

const agendaSchema = new mongoose.Schema({
    dataInicioCE: { type: String, default: '' },
    dataFinalCE: { type: String, default: '' },
    dataInicioPI: { type: String, default: '' },
    dataFinalPI: { type: String, default: '' },
    dataInicioMA: { type: String, default: '' },
    dataFinalMA: { type: String, default: '' },
    dataInicioCARI: { type: String, default: '' },
    dataFinalCARI: { type: String, default: '' },
});

const Agenda = mongoose.model('Agenda', agendaSchema);

module.exports = Agenda;