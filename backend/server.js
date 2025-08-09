const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Importar modelos
const Item = require('./models/Item');
const PostoAtendimento = require('./models/PostoAtendimento');
const Colaborador = require('./models/Colaborador');
const Movimento = require('./models/Movimento');

const app = express();

// ====================
// Configurar relações
// ====================
Movimento.belongsTo(Item, { foreignKey: 'itemId' });
Item.hasMany(Movimento, { foreignKey: 'itemId' });

Movimento.belongsTo(PostoAtendimento, { foreignKey: 'postoId' });
PostoAtendimento.hasMany(Movimento, { foreignKey: 'postoId' });

Movimento.belongsTo(Colaborador, { foreignKey: 'colaboradorId' });
Colaborador.hasMany(Movimento, { foreignKey: 'colaboradorId' });

// ====================
// Middlewares
// ====================
app.use(express.json());

// CORS flexível (aceita qualquer origem em desenvolvimento)
const corsOptions = {
  origin: '*', // Se for produção, trocar por ['https://seusite.com']
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ====================
// Rotas
// ====================
app.use('/api/itens', require('./routes/itemRoutes'));
app.use('/api/postos', require('./routes/postoRoutes'));
app.use('/api/colaboradores', require('./routes/colaboradorRoutes'));
app.use('/api/movimentos', require('./routes/movimentoRoutes'));

// Rota de teste
app.get('/', (req, res) => {
  res.send('Sistema de Estoque - API rodando!');
});

// ====================
// Tratamento global de erros
// ====================
app.use((err, req, res, next) => {
  console.error('Erro capturado:', err);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

// ====================
// Iniciar servidor
// ====================
sequelize.sync({ force: false })
  .then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log('Banco de dados sincronizado');
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar banco de dados:', err);
  });
