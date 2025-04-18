document.addEventListener('DOMContentLoaded', fetchExpenses);

document.getElementById('expense-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const amount = document.getElementById('amount').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    if (!amount || !description || !category) {
        alert('Please fill all fields');
        return;
    }

    const newExpense = { amount, description, category };

    try {
        const response = await axios.post('http://localhost:5000/api/expenses', newExpense);
        displayExpense(response.data); // Display new expense immediately
    } catch (error) {
        console.error(error);
    }

    // Reset Form
    document.getElementById('expense-form').reset();
});


async function fetchExpenses() {
    try {
        const response = await axios.get('http://localhost:5000/api/expenses');
        document.getElementById('expense-list').innerHTML = ''; // Clear previous entries
        response.data.forEach(displayExpense);
    } catch (error) {
        console.error(error);
    }
}


document.addEventListener('DOMContentLoaded', fetchExpenses);

function displayExpense(expense) {
    const ul = document.getElementById('expense-list'); // Fix the correct ID
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `${expense.amount} - ${expense.description} - ${expense.category}`;

    // Create Delete Button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.classList.add('btn', 'btn-danger', 'ml-2');
    delBtn.onclick = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${expense.id}`);
            ul.removeChild(li);
        } catch (error) {
            console.error(error);
        }
    };

    // Create Edit Button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('btn', 'btn-warning', 'ml-2');
    editBtn.onclick = () => {
        document.getElementById('amount').value = expense.amount;
        document.getElementById('description').value = expense.description;
        document.getElementById('category').value = expense.category;

        // Delete the old item before updating
        delBtn.click();
    };

    // Append buttons
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    ul.appendChild(li);
}
  
  
  