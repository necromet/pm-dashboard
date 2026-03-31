import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalDashboard from './pages/GlobalDashboard';
import PipelineView from './pages/PipelineView';
import ClientDashboard from './pages/ClientDashboard';
import BriefsPage from './pages/BriefsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GlobalDashboard />} />
        <Route path="/pipeline" element={<PipelineView />} />
        <Route path="/clients" element={<ClientDashboard />} />
        <Route path="/clients/:clientId" element={<ClientDashboard />} />
        <Route path="/briefs" element={<BriefsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
