const express = require('express');
const cors = require('cors');
const app = express();
const sequelize = require('./config/database');

// Importar modelos para criar relações
const Item = require('./models/Item');
const PostoAtendimento = require('./models/PostoAtendimento');
const Colaborador = require('./models/Colaborador');
const Movimento = require('./models/Movimento');

// Configurar relações
Movimento.belongsTo(Item, { foreignKey: 'itemId' });
Movimento.belongsTo(PostoAtendimento, { foreignKey: 'postoId' });
Movimento.belongsTo(Colaborador, { foreignKey: 'colaboradorId' });

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/itens', require('./routes/itemRoutes'));
app.use('/api/postos', require('./routes/postoRoutes'));
app.use('/api/colaboradores', require('./routes/colaboradorRoutes'));
app.use('/api/movimentos', require('./routes/movimentoRoutes'));

// Rota de teste
app.get('/', (req, res) => {
  res.send('Sistema de Estoque - API');
});

// Sincronizar banco de dados e iniciar servidor
sequelize.sync({ force: false }).then(() => {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Banco de dados sincronizado');
  });
}).catch(err => {
  console.error('Erro ao sincronizar banco de dados:', err);
});

// Adicione logs para depuração
app.post('/api/itens', async (req, res) => {
  console.log('Recebendo POST em /api/itens', req.body);
  
  try {
    const item = await Item.create(req.body);
    console.log('Item criado:', item);
    res.status(201).json(item);
  } catch (error) {
    console.error('Erro ao criar item:', error);
    res.status(400).json({ error: error.message });
  }
});

// Configuração mais robusta de CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));