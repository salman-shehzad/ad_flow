import { Link, NavLink, useNavigate } from "react-router-dom";
import { DASHBOARD_ROUTE_BY_ROLE } from "@shared/index";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur">
      <div className="container-shell flex items-center justify-between py-4">
        <Link to="/" className="font-display text-2xl font-bold text-brand-ink">
          AdFlow Pro
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/explore" className="text-sm font-semibold text-slate-600 hover:text-brand-teal">Explore</NavLink>
          <NavLink to="/packages" className="text-sm font-semibold text-slate-600 hover:text-brand-teal">Packages</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-secondary px-4 text-xl leading-none"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          {isAuthenticated ? (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(DASHBOARD_ROUTE_BY_ROLE[user.role])}
              >
                Dashboard
              </button>
              <button type="button" className="btn-primary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">Login</Link>
              <Link to="/register" className="btn-primary">Get started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
