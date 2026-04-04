import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  return (
    <div>
      <nav className="bg-white border-b p-4 flex justify-between">
        <Link className="font-bold" to="/">AdFlow Pro</Link>
        <div className="space-x-4">
          <Link to="/explore">Explore</Link>
          <Link to="/packages">Packages</Link>
          {user?.role === 'client' && <Link to="/client">Client</Link>}
          {user?.role === 'moderator' && <Link to="/moderator">Moderator</Link>}
          {(user?.role === 'admin' || user?.role === 'super_admin') && <Link to="/admin">Admin</Link>}
          {user ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}
