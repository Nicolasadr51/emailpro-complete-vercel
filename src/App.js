import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Templates from './pages/Templates';
import Campaigns from './pages/Campaigns';
import CampaignCreate from './pages/CampaignCreate';
import Contacts from './pages/Contacts';
import Statistics from './pages/Statistics';
import CSVImportPage from './pages/CSVImportPage';
import CSVExportPage from './pages/CSVExportPage';
import EmailEditorAdvanced from './pages/EmailEditorAdvanced';
import ComingSoon from './components/common/ComingSoon';
import ErrorBoundary from './components/common/ErrorBoundary';
import './App.css';



function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* Routes publiques - SANS DashboardLayout */}
            <Route path="/email-editor/:designId" element={<EmailEditorAdvanced />} />
            <Route path="/email-editor" element={<EmailEditorAdvanced />} />
            
            {/* Routes protégées - AVEC DashboardLayout */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="templates" element={<Templates />} />
              <Route path="campaigns" element={<Campaigns />} />
              <Route path="campaigns/new" element={<CampaignCreate />} />
              <Route path="campaigns/:id" element={<ComingSoon title="Détails de la Campagne" />} />
              <Route path="campaigns/:id/edit" element={<ComingSoon title="Modifier la Campagne" />} />
              <Route path="campaigns/:id/stats" element={<ComingSoon title="Statistiques de la Campagne" />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="contacts/import" element={<CSVImportPage />} />
              <Route path="contacts/export" element={<CSVExportPage />} />
              <Route path="stats" element={<Statistics />} />
              <Route path="statistics" element={<Statistics />} />
              <Route path="*" element={<ComingSoon title="Page non trouvée" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
}

export default App;