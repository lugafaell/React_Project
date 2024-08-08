const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const registroRoutes = require("./routes/registro");
const faturamentoRoutes = require("./routes/faturamento");
const agendaRoutes = require("./routes/agenda");
const funcionarioRoutes = require("./routes/funcionario");
const equipamentosRoutes = require("./routes/equipamento");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const MONGODB_URI = process.env.DATABASE;
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão com o MongoDB:"));
db.once("open", () => {
  console.log("Conexão estabelecida com o MongoDB.");
});

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/meta", dashboardRoutes);
app.use("/registrar", registroRoutes);
app.use("/faturamento", faturamentoRoutes);
app.use("/agenda", agendaRoutes);
app.use("/funcionario", funcionarioRoutes);
app.use("/equipamento", equipamentosRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta: ${PORT}`);
});
