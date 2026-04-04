import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Explore from './pages/Explore';
import AdDetail from './pages/AdDetail';
import Packages from './pages/Packages';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './dashboard/ClientDashboard';
import ModeratorPanel from './dashboard/ModeratorPanel';
import AdminDashboard from './dashboard/AdminDashboard';

export default function App() {
  return <BrowserRouter><Layout><Routes><Route path="/" element={<Home />} /><Route path="/explore" element={<Explore />} /><Route path="/ads/:id" element={<AdDetail />} /><Route path="/packages" element={<Packages />} /><Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} /><Route path="/client" element={<ProtectedRoute roles={['client']}><ClientDashboard /></ProtectedRoute>} /><Route path="/moderator" element={<ProtectedRoute roles={['moderator', 'admin', 'super_admin']}><ModeratorPanel /></ProtectedRoute>} /><Route path="/admin" element={<ProtectedRoute roles={['admin', 'super_admin']}><AdminDashboard /></ProtectedRoute>} /></Routes></Layout></BrowserRouter>;
}
