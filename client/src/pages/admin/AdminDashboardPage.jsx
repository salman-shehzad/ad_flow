import { useEffect, useMemo, useState } from "react";
import { api } from "../../api/http";
import { StatCard } from "../../components/StatCard";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

export const AdminDashboardPage = () => {
  const { user: currentUser } = useAuth();
  const isSuperAdmin = currentUser?.role === "super_admin";
  const [analytics, setAnalytics] = useState({
    totalAds: 0,
    activeAds: 0,
    revenueByPackage: [],
    approvalRate: 0,
  });
  const [payments, setPayments] = useState([]);
  const [readyAds, setReadyAds] = useState([]);
  const [users, setUsers] = useState([]);
  const [notes, setNotes] = useState({});
  const [publishForms, setPublishForms] = useState({});
  const [userForms, setUserForms] = useState({});
  const [error, setError] = useState("");

  const load = async () => {
    const [analyticsData, paymentsData, readyAdsData, usersData] = await Promise.all([
      api.get("/admin/analytics"),
      api.get("/admin/payment-queue"),
      api.get("/admin/ads/ready"),
      api.get("/admin/users"),
    ]);
    setAnalytics(analyticsData);
    setPayments(paymentsData);
    setReadyAds(readyAdsData);
    setUsers(usersData);
    setUserForms((current) => {
      const next = { ...current };
      for (const account of usersData) {
        next[account.id] = {
          name: current[account.id]?.name ?? account.name,
          email: current[account.id]?.email ?? account.email,
          username: current[account.id]?.username ?? account.username ?? "",
          role: current[account.id]?.role ?? account.role,
          password: "",
        };
      }
      return next;
    });
  };

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  const verifiedRevenue = useMemo(
    () =>
      analytics.revenueByPackage.reduce(
        (sum, item) => sum + Number(item.revenue || 0),
        0,
      ),
    [analytics.revenueByPackage],
  );

  const reviewPayment = async (paymentId, approved) => {
    setError("");
    try {
      await api.patch(`/admin/payments/${paymentId}/verify`, {
        approved,
        note: notes[paymentId] || "",
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const publishAd = async (adId) => {
    setError("");
    try {
      const payload = publishForms[adId] || {};
      await api.patch(`/admin/ads/${adId}/publish`, {
        publishAt: payload.publishAt || undefined,
        adminBoost: payload.adminBoost ? Number(payload.adminBoost) : undefined,
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateUser = async (accountId) => {
    setError("");
    try {
      const form = userForms[accountId] || {};
      const payload = {
        name: form.name,
        email: form.email,
        username: form.username,
        role: form.role,
        ...(form.password ? { password: form.password } : {}),
      };
      await api.patch(`/admin/users/${accountId}`, payload);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteManagedUser = async (accountId) => {
    setError("");
    try {
      await api.delete(`/admin/users/${accountId}`);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total ads" value={analytics.totalAds} />
        <StatCard label="Active ads" value={analytics.activeAds} />
        <StatCard label="Approval rate" value={`${analytics.approvalRate}%`} />
        <StatCard label="Verified revenue" value={formatCurrency(verifiedRevenue)} />
      </div>

      {error ? <div className="panel text-red-600">{error}</div> : null}

      <section className="panel space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">Users directory</h2>
            <p className="text-sm text-slate-500">
              {isSuperAdmin
                ? "Super admins can update users, reset passwords, and delete accounts."
                : "Admins can view all platform users. Passwords cannot be displayed because they are securely hashed."}
            </p>
          </div>
          <div className="rounded-full bg-brand-mist px-4 py-2 text-sm font-semibold text-brand-teal">
            {users.length} users
          </div>
        </div>
        <div className="space-y-4">
          {users.map((account) => (
            <div key={account.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_1.2fr_1fr_1fr_auto]">
                <input
                  className="input"
                  disabled={!isSuperAdmin}
                  value={userForms[account.id]?.name || account.name}
                  onChange={(e) =>
                    setUserForms((current) => ({
                      ...current,
                      [account.id]: {
                        ...(current[account.id] || {}),
                        name: e.target.value,
                      },
                    }))
                  }
                />
                <input
                  className="input"
                  disabled={!isSuperAdmin}
                  value={userForms[account.id]?.email || account.email}
                  onChange={(e) =>
                    setUserForms((current) => ({
                      ...current,
                      [account.id]: {
                        ...(current[account.id] || {}),
                        email: e.target.value,
                      },
                    }))
                  }
                />
                <input
                  className="input"
                  disabled={!isSuperAdmin}
                  placeholder="Username"
                  value={userForms[account.id]?.username ?? account.username ?? ""}
                  onChange={(e) =>
                    setUserForms((current) => ({
                      ...current,
                      [account.id]: {
                        ...(current[account.id] || {}),
                        username: e.target.value,
                      },
                    }))
                  }
                />
                <select
                  className="input"
                  disabled={!isSuperAdmin}
                  value={userForms[account.id]?.role || account.role}
                  onChange={(e) =>
                    setUserForms((current) => ({
                      ...current,
                      [account.id]: {
                        ...(current[account.id] || {}),
                        role: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="client">client</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                  <option value="super_admin">super_admin</option>
                </select>
                <div className="text-sm text-slate-500">
                  Joined {formatDate(account.created_at)}
                </div>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto_auto]">
                <input
                  className="input"
                  disabled={!isSuperAdmin}
                  type="password"
                  placeholder={
                    isSuperAdmin
                      ? "Set a new password (cannot view old password)"
                      : "Stored passwords are not viewable"
                  }
                  value={userForms[account.id]?.password || ""}
                  onChange={(e) =>
                    setUserForms((current) => ({
                      ...current,
                      [account.id]: {
                        ...(current[account.id] || {}),
                        password: e.target.value,
                      },
                    }))
                  }
                />
                {isSuperAdmin ? (
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => updateUser(account.id)}
                  >
                    Update user
                  </button>
                ) : null}
                {isSuperAdmin ? (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => deleteManagedUser(account.id)}
                    disabled={account.id === currentUser?.id}
                  >
                    Delete user
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel space-y-5">
        <h2 className="text-2xl font-bold">Revenue by package</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {analytics.revenueByPackage.map((item) => (
            <div key={item.package_name} className="rounded-3xl border border-slate-200 p-4">
              <p className="text-sm text-slate-500">{item.package_name}</p>
              <p className="mt-2 text-2xl font-bold">
                {formatCurrency(item.revenue)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel space-y-5">
        <h2 className="text-2xl font-bold">Payment verification queue</h2>
        {payments.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-5 text-slate-500">
            No payment proofs are waiting for verification.
          </div>
        ) : null}
        <div className="space-y-4">
          {payments.map((payment) => (
            <div key={payment.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{payment.ad_title}</h3>
                  <p className="text-sm text-slate-500">
                    {payment.owner_name} - {payment.package_name}
                  </p>
                  <a
                    className="mt-2 inline-block text-sm font-semibold text-brand-teal"
                    href={payment.screenshot_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View screenshot proof
                  </a>
                </div>
                <p className="text-lg font-bold text-brand-ink">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              <textarea
                className="input mt-4 min-h-24"
                placeholder="Verification note"
                value={notes[payment.id] || ""}
                onChange={(e) =>
                  setNotes((current) => ({ ...current, [payment.id]: e.target.value }))
                }
              />
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => reviewPayment(payment.id, true)}
                >
                  Verify
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => reviewPayment(payment.id, false)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel space-y-5">
        <h2 className="text-2xl font-bold">Ready to publish</h2>
        {readyAds.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-5 text-slate-500">
            No verified ads are waiting for scheduling or publishing.
          </div>
        ) : null}
        <div className="space-y-4">
          {readyAds.map((ad) => (
            <div key={ad.id} className="rounded-3xl border border-slate-200 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold">{ad.title}</h3>
                  <p className="text-sm text-slate-500">
                    {ad.owner_name} - {ad.package_name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Current publish target: {formatDate(ad.publish_at)}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    className="input"
                    type="datetime-local"
                    value={publishForms[ad.id]?.publishAt || ""}
                    onChange={(e) =>
                      setPublishForms((current) => ({
                        ...current,
                        [ad.id]: {
                          ...(current[ad.id] || {}),
                          publishAt: e.target.value,
                        },
                      }))
                    }
                  />
                  <input
                    className="input"
                    type="number"
                    placeholder="Admin boost"
                    value={publishForms[ad.id]?.adminBoost || ""}
                    onChange={(e) =>
                      setPublishForms((current) => ({
                        ...current,
                        [ad.id]: {
                          ...(current[ad.id] || {}),
                          adminBoost: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn-primary mt-4"
                onClick={() => publishAd(ad.id)}
              >
                Publish or schedule
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
