import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";
import CampaignCreate from "@/pages/CampaignCreate";
import Contacts from "@/pages/Contacts";
import Templates from "@/pages/Templates";
import Statistics from "@/pages/Statistics";
import CSVImportPage from "@/pages/CSVImportPage";
import CSVExportPage from "@/pages/CSVExportPage";
import EmailEditorAdvanced from "@/pages/EmailEditorAdvanced";

// Page temporaire pour les autres routes
const ComingSoon = ({ title }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">Cette page est en cours de développement.</p>
        <a 
          href="/dashboard" 
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Retour au tableau de bord
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
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
  );
}

export default App;