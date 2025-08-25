require('dotenv').config();
const express = require('express');
const app = express();
const casosRouter = require("./routes/casosRoutes");
const agentesRouter = require("./routes/agentesRoutes");
const authRouter = require("./routes/authRoutes");
const PORT = process.env.PORT_SERVER || 3000;

app.use(express.json());

app.use(casosRouter);
app.use(agentesRouter);
app.use(authRouter);

const setupSwagger = require('./docs/swagger');
setupSwagger(app);

app.listen(PORT, () => {
    console.log(`Servidor do Departamento de Polícia rodando em http://localhost:${PORT}`);
}); 
