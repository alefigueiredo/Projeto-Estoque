const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostoAtendimento = sequelize.define('PostoAtendimento', {
  numero: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  cidade: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = PostoAtendimento;