document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
        // Redirect or save token/session here if needed
      } else {
        alert(data.message); // shows 'Invalid credentials' if wrong
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Try again.');
    }
  });
  