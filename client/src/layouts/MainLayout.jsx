import { Outlet } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export const MainLayout = () => (
  <div className="min-h-screen bg-mesh">
    <Navbar />
    <main className="pb-16 pt-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);
