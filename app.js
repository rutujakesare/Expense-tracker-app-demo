const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');

const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api', userRoutes);
app.use('/api/expenses', expenseRoutes);

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

sequelize
  .sync()
  .then(() => {
    app.listen(5000, () => {
      console.log('Server running at http://localhost:5000');
    });
  })
  .catch(err => console.error('Database sync error:', err));

