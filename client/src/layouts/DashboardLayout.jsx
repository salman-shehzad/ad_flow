import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="container-shell space-y-8">
      <div className="panel flex flex-col gap-4 bg-slate-900 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-brand-mist">AdFlow Pro workspace</p>
          <h1 className="mt-2 text-3xl font-bold text-white">{user?.name}</h1>
          <p className="mt-2 text-sm text-slate-300">Role: {user?.role}</p>
        </div>
        <Link to="/explore" className="btn-secondary border-white/20 text-white hover:border-white hover:text-white">
          View public marketplace
        </Link>
      </div>
      <Outlet />
    </div>
  );
};
