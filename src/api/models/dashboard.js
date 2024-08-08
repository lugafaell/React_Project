const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  meta: Number,
});

const Dash = mongoose.model('Dash', dashboardSchema);

module.exports = Dash;