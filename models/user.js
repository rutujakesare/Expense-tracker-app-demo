const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPremiumUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  totalExpense: {
  type: DataTypes.INTEGER,
  allowNull: false,
  defaultValue: 0,
  validate: {
    min:0
  }
}

});

module.exports = User;


