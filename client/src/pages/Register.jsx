import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register } = useAuth();
  const nav = useNavigate();
  return <form className="bg-white border rounded p-4 max-w-md" onSubmit={async (e) => { e.preventDefault(); await register(form.name, form.email, form.password); nav('/'); }}><h2 className="font-semibold mb-2">Register</h2>{['name', 'email', 'password'].map((k) => <input key={k} type={k === 'password' ? 'password' : 'text'} className="border p-2 rounded w-full mb-2" placeholder={k} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />)}<button className="bg-blue-600 text-white px-4 py-2 rounded">Create account</button></form>;
}
