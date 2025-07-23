document.addEventListener('DOMContentLoaded', () => {
  checkPremiumStatus(); // Check and show premium UI
  fetchExpenses();

  document.getElementById('expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    if (!amount || !description || !category) {
      alert('Please fill all fields');
      return;
    }

    const newExpense = { amount, description, category };
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post('http://localhost:5000/api/expenses', newExpense, {
        headers: { Authorization: `Bearer ${token}` }
      });

      addExpenseToList(response.data);
      document.getElementById('expense-form').reset();
      
    } catch (error) {
      console.error('Add expense error:', error);
      alert('Failed to add expense. Check authentication.');
    }
  });
});

function checkPremiumStatus() {
  const token = localStorage.getItem("token");
  if (!token) return;

  const decodedToken = parseJwt(token);

  if (decodedToken.isPremiumUser) {
    showPremiumFeatures();
  }
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));

  return JSON.parse(jsonPayload);
}

function showPremiumFeatures() {
  document.getElementById('show-leaderboard').style.display = 'inline-block';
  document.getElementById('premiumMsg').style.display = 'block';
}

const buyBtn = document.getElementById("buyPremiumBtn");

if (buyBtn) {
  buyBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:5000/payment/buy-premium", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { paymentSessionId, orderId } = await response.json();

      if (!paymentSessionId || !orderId) {
        alert("Failed to fetch payment session.");
        return;
      }

      const checkoutOptions = {
        paymentSessionId,
        redirectTarget: "_modal",
      };

      const result = await cashfree.checkout(checkoutOptions);

      if (result.paymentDetails) {
        const statusResponse = await fetch(
          `http://localhost:5000/payment/payment-status/${orderId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const statusData = await statusResponse.json();

        alert("Your payment is: " + statusData.orderStatus);

        if (statusData.orderStatus === "SUCCESS") {
          alert("🎉 You are now a premium user!");
          showPremiumFeatures(); // ✅ Show leaderboard & message
        }
      }
    } catch (error) {
      console.error("Premium buy error:", error);
      alert("Something went wrong during payment.");
    }
  });
}

document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  alert('You have been logged out.');
  window.location.href = 'login.html';
});

async function fetchExpenses() {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:5000/api/expenses', {
      headers: { Authorization: `Bearer ${token}` }
    });

    displayExpenses(response.data);
  } catch (error) {
    console.error("Fetch error:", error.response ? error.response.data : error.message);
  }
}

function addExpenseToList(expense) {
  const expenseList = document.getElementById('expense-list');

  const item = document.createElement('div');
  item.textContent = `${expense.amount} - ${expense.description} - ${expense.category}`;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => deleteExpense(expense.id, item);

  item.appendChild(deleteBtn);
  expenseList.appendChild(item);
}

function displayExpenses(expenses) {
  const expenseList = document.getElementById('expense-list');
  expenseList.innerHTML = '';

  expenses.forEach(expense => {
    addExpenseToList(expense);
  });
}

async function deleteExpense(id, element) {
  const token = localStorage.getItem('token');

  try {
    await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (element) element.remove();
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete expense. Check authentication.');
  }
}

function showleaderBoard(data) {
  const LeaderBoardList = document.getElementById('leaderboard-list');
  LeaderBoardList.innerHTML = '';

  const heading = document.createElement('h4');
  heading.textContent = 'Leaderboard';
  LeaderBoardList.appendChild(heading);

  if (data.length === 0) {
    const noData = document.createElement('li');
    noData.textContent = 'No leaderboard data found';
    LeaderBoardList.appendChild(noData);
    return;
  }

  data.forEach(element => {
    const leaderboardItem = document.createElement('li');
    leaderboardItem.innerHTML = `Name: ${element.name} , Total Expense: ₹${element.totalExpense ?? 0}`;
    LeaderBoardList.appendChild(leaderboardItem);
  });
}

document.getElementById('show-leaderboard').addEventListener('click', async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get('http://localhost:5000/premium/showleaderboard', {
      headers: { Authorization: `Bearer ${token}` }
    });
    showleaderBoard(response.data);
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    alert('Failed to load leaderboard. Check console for details.');
  }
});
