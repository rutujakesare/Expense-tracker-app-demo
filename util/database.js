const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'rutuja@38', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
