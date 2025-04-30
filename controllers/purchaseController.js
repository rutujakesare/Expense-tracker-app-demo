const  Cashfree  = require('cashfree-pg');
const Order = require('../models/order');
const User = require('../models/user');
require('dotenv').config();


Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = 'SANDBOX'; 


exports.purchasePremium = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized. User not found in request.' });
    }

    const userId = req.user.id;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found in database.' });
    }
    const orderId = `order_${Date.now()}`;
    const orderAmount = 499; 

    const paymentSession = await Cashfree.PGCreateOrder({
      order_id: orderId,
      order_amount: orderAmount,
      order_currency: 'INR',
      customer_details: {
        customer_id: user.id.toString(),
        customer_email: user.email,
      },
      order_meta: {
        return_url: `http://localhost:5000/purchase/update-status?order_id=${orderId}`,
        payment_methods: 'cc, upi, nb'
      }
    });

    await Order.create({
      orderId: orderId,
      status: 'PENDING',
      userId: user.id
    });

    res.json({ paymentLink: paymentSession.payment_link });
  } catch (err) {
    console.error('Cashfree Error:', err);
    res.status(500).json({ error: 'Failed to initiate premium purchase.' });
  }
};





exports.updateTransactionStatus = async (req, res) => {
  try {
    const { order_id, order_status, payment_id } = req.query;

    console.log('Received status update:', { order_id, order_status, payment_id });

    if (!order_id || !order_status) {
      return res.status(400).send('Missing order_id or order_status in the query.');
    }

    const order = await Order.findOne({ where: { orderId: order_id } });

    if (!order) {
      return res.status(404).send('Order not found.');
    }

    if (order_status === 'PAID') {
      
      order.status = 'SUCCESSFUL';
      order.paymentId = payment_id || null;
      await order.save();

      
      const user = await User.findByPk(order.userId);
      if (user) {
        user.isPremiumUser = true;
        await user.save();
      }

      return res.send(' Payment successful! You are now a premium user.');
    } else {
     
      order.status = 'FAILED';
      await order.save();

      return res.send(' Payment failed or canceled.');
    }

  } catch (err) {
    console.error(' Payment update error:', err);
    res.status(500).send('Internal Server Error while updating payment status.');
  }
};
