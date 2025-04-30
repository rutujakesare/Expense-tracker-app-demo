
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentId: {
    type: DataTypes.STRING,
  },
});

module.exports = Order;
