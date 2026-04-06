import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/dashboard/client");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-shell grid min-h-[70vh] place-items-center">
      <form className="panel w-full max-w-lg space-y-5" onSubmit={handleSubmit}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-teal">Client onboarding</p>
          <h1 className="mt-2 text-3xl font-bold">Create your marketplace account</h1>
        </div>
        <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} />
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button className="btn-primary w-full" disabled={loading} type="submit">{loading ? "Creating account..." : "Register"}</button>
        <p className="text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-brand-teal">Login</Link></p>
      </form>
    </div>
  );
};
