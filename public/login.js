document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    alert(data.message);
    if (res.ok) {
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('token', data.token);

      window.location.href = 'expense.html';
    }
  } catch (err) {
    alert('Login failed');
  }
});



  