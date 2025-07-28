document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
     
      localStorage.setItem('token', data.token);

      alert('Login successful!');
      window.location.href = 'expense.html'; 
    } else {
      alert(data.error || 'Login failed');
    }
  } catch (err) {
    console.error('Login Error:', err);
    alert('An error occurred while logging in');
  }
});








  