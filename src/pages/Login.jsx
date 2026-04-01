import { useState } from 'react';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (!credentials.email || !credentials.password) {
      setError('Email and password are required.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 600);
  };

  return (
    <main className="page auth-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>Email<input type="email" value={credentials.email} onChange={e => setCredentials(prev => ({ ...prev, email: e.target.value }))} /></label>
        <label>Password<input type="password" value={credentials.password} onChange={e => setCredentials(prev => ({ ...prev, password: e.target.value }))} /></label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Login'}</button>
      </form>
    </main>
  );
};

export default Login;
