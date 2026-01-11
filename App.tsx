
import React, { useState } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  Search, 
  MessageSquare, 
  Disc, 
  Instagram, 
  Facebook, 
  Send
} from 'lucide-react';
import { AppTab, MarketingContent, Lead } from './types';
import Dashboard from './components/Dashboard';
import MessageGenerator from './components/MessageGenerator';
import LeadFinder from './components/LeadFinder';
import ContactList from './components/ContactList';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [marketingContent, setMarketingContent] = useState<MarketingContent | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  const addLeads = (newLeads: Lead[]) => {
    setLeads(prev => {
      // Evitar duplicatas por contato
      const existingContacts = new Set(prev.map(l => l.contact));
      const filteredNew = newLeads.filter(l => !existingContacts.has(l.contact));
      return [...prev, ...filteredNew];
    });
  };

  const updateLeadStatus = (id: string, status: 'enviado' | 'pendente' | 'falha') => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const removeLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    setSelectedLeads(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const toggleSelectLead = (id: string) => {
    setSelectedLeads(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0f172a]">
      {/* Sidebar */}
      <nav className="w-full md:w-64 bg-[#1e293b] border-r border-slate-700 p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-amber-500 p-2 rounded-lg">
            <Disc className="text-white vinyl-spin" size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">VinylHub <span className="text-amber-500">Suite</span></h1>
        </div>

        <div className="flex-1 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Início" 
            active={activeTab === AppTab.DASHBOARD} 
            onClick={() => setActiveTab(AppTab.DASHBOARD)} 
          />
          <NavItem 
            icon={<MessageSquare size={20} />} 
            label="Análise & Plano" 
            active={activeTab === AppTab.GENERATOR} 
            onClick={() => setActiveTab(AppTab.GENERATOR)} 
          />
          <NavItem 
            icon={<Search size={20} />} 
            label="Busca de Leads BR" 
            active={activeTab === AppTab.LEAD_FINDER} 
            onClick={() => setActiveTab(AppTab.LEAD_FINDER)} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Contatos & Disparo" 
            active={activeTab === AppTab.CONTACTS} 
            onClick={() => setActiveTab(AppTab.CONTACTS)} 
            badge={leads.length}
          />
        </div>

        <div className="mt-auto pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Social Integrado</p>
          <div className="flex gap-4 text-slate-400">
            <Instagram size={18} className="hover:text-amber-500 cursor-pointer" />
            <Facebook size={18} className="hover:text-amber-500 cursor-pointer" />
            <Send size={18} className="hover:text-amber-500 cursor-pointer" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
          {activeTab === AppTab.DASHBOARD && <Dashboard setTab={setActiveTab} />}
          {activeTab === AppTab.GENERATOR && (
            <MessageGenerator 
              onSave={setMarketingContent} 
              currentContent={marketingContent} 
            />
          )}
          {activeTab === AppTab.LEAD_FINDER && (
            <LeadFinder onAddLeads={addLeads} />
          )}
          {activeTab === AppTab.CONTACTS && (
            <ContactList 
              leads={leads} 
              selectedLeads={selectedLeads}
              onToggleSelect={toggleSelectLead}
              onRemove={removeLead}
              onUpdateStatus={updateLeadStatus}
              onImport={addLeads}
              marketingContent={marketingContent}
            />
          )}
        </div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium flex-1 text-left">{label}</span>
    {badge !== undefined && badge > 0 && (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white text-amber-600' : 'bg-slate-700 text-slate-300'}`}>
        {badge}
      </span>
    )}
  </button>
);

export default App;
