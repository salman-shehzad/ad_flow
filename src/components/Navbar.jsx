import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-brand">AdFlow Pro</div>
      <nav className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore Ads</Link>
        <Link to="/packages">Packages</Link>
        <Link to="/dashboard/client">Client</Link>
        <Link to="/dashboard/moderator">Moderator</Link>
        <Link to="/dashboard/admin">Admin</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>
      <div className="navbar-actions">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/register" className="btn btn-outline">Register</Link>
      </div>
    </header>
  );
};

export default Navbar;
