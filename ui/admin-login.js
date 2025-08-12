// ui/admin-login.js
document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const msg = document.getElementById('message');
  msg.style.color = '#374151';
  msg.textContent = 'Signing you in...';

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const result = await res.json();

    if (res.ok && result.success) {
      msg.style.color = 'green';
      msg.textContent = 'Login successful. Redirecting...';
      setTimeout(() => { window.location.href = '/admin.html'; }, 600);
    } else {
      msg.style.color = 'crimson';
      msg.textContent = result.message || 'Login failed.';
    }
  } catch (err) {
    console.error('Admin login error:', err);
    msg.style.color = 'crimson';
    msg.textContent = 'Network error. Please try again.';
  }
});
