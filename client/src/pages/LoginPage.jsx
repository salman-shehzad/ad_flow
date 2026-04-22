import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DASHBOARD_ROUTE_BY_ROLE } from "@shared/index";
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const payload = await login(form);
      navigate(DASHBOARD_ROUTE_BY_ROLE[payload.user.role]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-shell grid min-h-[70vh] place-items-center">
      <form className="panel w-full max-w-lg space-y-5" onSubmit={handleSubmit}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-teal">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold">Login to AdFlow Pro</h1>
        </div>
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="btn-primary w-full" disabled={loading} type="submit">{loading ? "Signing in..." : "Login"}</button>
        <p className="text-sm text-slate-500">Need an account? <Link to="/register" className="font-semibold text-brand-teal">Register</Link></p>
      </form>
    </div>
  );
};
