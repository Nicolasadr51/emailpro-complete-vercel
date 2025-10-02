import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Campaigns from "@/pages/Campaigns";
import CampaignCreate from "@/pages/CampaignCreate";
import Contacts from "@/pages/Contacts";
import Templates from "@/pages/Templates";
import Statistics from "@/pages/Statistics";
import CSVImportPage from "@/pages/CSVImportPage";
import CSVExportPage from "@/pages/CSVExportPage";
import EmailEditorPageStandalone from "@/pages/EmailEditorPageStandalone";

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
          {/* Route principale - Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Routes Campagnes */}
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/new" element={<CampaignCreate />} />
          <Route path="/campaigns/:id" element={<ComingSoon title="Détails de la Campagne" />} />
          <Route path="/campaigns/:id/edit" element={<ComingSoon title="Modifier la Campagne" />} />
          <Route path="/campaigns/:id/stats" element={<ComingSoon title="Statistiques de la Campagne" />} />
          
          {/* Routes Contacts */}
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/import" element={<CSVImportPage />} />
          <Route path="/contacts/export" element={<CSVExportPage />} />
          
          {/* Routes Templates */}
          <Route path="/templates" element={<Templates />} />
          
          {/* Routes Statistiques */}
          <Route path="/stats" element={<Statistics />} />
          <Route path="/statistics" element={<Statistics />} />
          
          {/* Routes Éditeur d'email */}
          <Route path="/email-editor" element={<EmailEditorPageStandalone />} />
          <Route path="/email-editor/:designId" element={<EmailEditorPageStandalone />} />
          
          {/* Route 404 */}
          <Route path="*" element={<ComingSoon title="Page non trouvée" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;