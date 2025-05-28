document.addEventListener('DOMContentLoaded', () => {
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

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('User not authenticated');
                return;
            }

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
          // Reload or update UI
        }
      }
    } catch (error) {
      console.error("Premium buy error:", error);
      alert("Something went wrong during payment.");
    }
  });
}






async function fetchExpenses() {
    const token = localStorage.getItem('token');
    console.log("Fetched token:", token); 

    try {
        const response = await axios.get('http://localhost:5000/api/expenses', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Expenses fetched:", response.data);
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
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('User not authenticated');
            return;
        }

        await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (element) element.remove(); 
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete expense. Check authentication.');
    }
}





document.getElementById('show-leaderboard').addEventListener('click', async () => {
  try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/premium/leaderboard', {
          headers: { Authorization: `Bearer ${token}` }
      });

      const leaderboardList = document.getElementById('leaderboard-list');
      leaderboardList.innerHTML = '';

      res.data.forEach(user => {
          const li = document.createElement('li');
          li.textContent = `${user.name}: ₹${user.totalExpense}`;
          leaderboardList.appendChild(li);
      });
  } catch (error) {
      console.error('Leaderboard error:', error);
  }
});