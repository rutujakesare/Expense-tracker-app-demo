const path = require("path");
const {
  createOrder,
  getPaymentStatus,
} = require("../services/cashfreeService");
const Payment = require("../models/payment");
const User = require("../models/user");

exports.getPremiumPage = (req, res) => {
  res.sendFile(path.join(__dirname, "../public/expense.html"));
};

exports.buyPremium = async (req, res) => {
  const userId = req.user.userId;
  const orderId = "PREMIUM_ORDER_" + Date.now();
  const orderAmount = 5000;
  const orderCurrency = "INR";
  const customerID = userId.toString();
  const customerPhone = "9999999999";

  // req.user.phone ||

  try {

    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      orderCurrency,
      customerID,
      customerPhone
    );

    await Payment.create({
      orderId,
      paymentSessionId,          
      userId,
      orderAmount,
      orderCurrency,
      paymentStatus: "PENDING", 
      purpose: "BUY_PREMIUM",
    });

    res.json({
      paymentSessionId,
      orderId,
    });
  } catch (error) {
    console.error("Error initiating premium purchase:", error.message);
    res.status(500).json({ message: "Error initiating premium purchase" });
  }
};


const jwt = require('jsonwebtoken');
const generateAccessToken = (id, name, isPremiumUser) => {
  return jwt.sign({ userId: id, name, isPremiumUser }, 'your_secret_key');
};

exports.updatePremiumStatus = async (req, res) => {
  const orderId = req.params.paymentSessionId;

  try {
    
    const payment = await Payment.findOne({ where: { orderId } });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    
    const latestStatus = await getPaymentStatus(orderId);


    payment.paymentStatus = latestStatus;
    await payment.save();

    if (latestStatus === "SUCCESS") {
      const user = await User.findByPk(payment.userId);
      if (user) {
        user.isPremiumUser = true;
        await user.save();
        const newToken = generateAccessToken(user.id, user.name, true);
        return res.status(200).json({ orderStatus: latestStatus, token: newToken });
      }
    }

    res.json({ orderStatus: latestStatus });
  } catch (error) {
    console.error("Error updating premium status:", error.message);
    res.status(500).json({ message: "Error updating premium status" });
  }
};