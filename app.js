require('dotenv').config();


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const sequelize = require('./util/database');
const app = express();

const User = require('./models/user');
const Expense = require('./models/expense');
const Payment = require('./models/payment');

const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');



app.use(cors());
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', userRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Payment);
Payment.belongsTo(User);


sequelize
  .sync()
  .then(() => {
    app.listen(5000, () => {
      console.log('Server running at http://localhost:5000');
    });
  })
  .catch(err => console.error('Database sync error:', err));
