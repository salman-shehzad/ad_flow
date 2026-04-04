import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();
  return <form className="bg-white border rounded p-4 max-w-md" onSubmit={async (e) => { e.preventDefault(); await login(email, password); nav('/'); }}><h2 className="font-semibold mb-2">Login</h2><input className="border p-2 rounded w-full mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input className="border p-2 rounded w-full mb-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><button className="bg-blue-600 text-white px-4 py-2 rounded">Sign in</button></form>;
}
