const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movimento = sequelize.define('Movimento', {
  tipo: {
    type: DataTypes.ENUM('Entrada', 'Saída', 'Devolução'),
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  data: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  observacao: {
    type: DataTypes.TEXT
  }
});

module.exports = Movimento;