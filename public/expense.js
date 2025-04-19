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

async function fetchExpenses() {
    const token = localStorage.getItem('token');
    console.log("Fetched token:", token); // ADD THIS to debug

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

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => {
        document.getElementById('amount').value = expense.amount;
        document.getElementById('description').value = expense.description;
        document.getElementById('category').value = expense.category;
        deleteExpense(expense.id, item); // delete old, then resubmit as new
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteExpense(expense.id, item);

    item.appendChild(editBtn);
    item.appendChild(deleteBtn);
    expenseList.appendChild(item);
}

function displayExpenses(expenses) {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = ''; // Clear existing

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

        if (element) element.remove(); // remove from UI
    } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete expense. Check authentication.');
    }
}

