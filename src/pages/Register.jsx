import { useState } from 'react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (!form.email.includes('@')) {
      setError('Enter a valid email.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => setSubmitting(false), 600);
  };

  return (
    <main className="page auth-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>Name<input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} /></label>
        <label>Email<input type="email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} /></label>
        <label>Password<input type="password" value={form.password} onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} /></label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={submitting}>{submitting ? 'Registering...' : 'Register'}</button>
      </form>
    </main>
  );
};

export default Register;
