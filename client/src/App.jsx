import { Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { ExploreAdsPage } from "./pages/ExploreAdsPage";
import { AdDetailPage } from "./pages/AdDetailPage";
import { PackagesPage } from "./pages/PackagesPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ClientDashboardPage } from "./pages/client/ClientDashboardPage";
import { ModeratorPanelPage } from "./pages/moderator/ModeratorPanelPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExploreAdsPage />} />
        <Route path="/ads/:id" element={<AdDetailPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute allowedRoles={["client", "moderator", "admin", "super_admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route element={<ProtectedRoute allowedRoles={["client"]} />}>
              <Route path="/dashboard/client" element={<ClientDashboardPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["moderator", "admin", "super_admin"]} />}>
              <Route path="/dashboard/moderator" element={<ModeratorPanelPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["admin", "super_admin"]} />}>
              <Route path="/dashboard/admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
