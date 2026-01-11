
import React, { useState } from 'react';
import { findLeads } from '../services/geminiService';
import { Lead } from '../types';
import { Search, MapPin, ExternalLink, UserPlus, Globe, CheckCircle2 } from 'lucide-react';

interface LeadFinderProps {
  onAddLeads: (leads: Lead[]) => void;
}

const LeadFinder: React.FC<LeadFinderProps> = ({ onAddLeads }) => {
  const [query, setQuery] = useState('Lojas de vinil MPB em São Paulo');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Lead[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);
    try {
      const { leads, sources } = await findLeads(query);
      setResults(leads);
      setSources(sources);
    } catch (error) {
      console.error(error);
      alert('Erro na busca. Tente outro termo.');
    } finally {
      setLoading(false);
    }
  };

  const addLead = (lead: Lead) => {
    onAddLeads([lead]);
    setAddedIds(prev => new Set([...prev, lead.id]));
  };

  const addAll = () => {
    onAddLeads(results);
    setAddedIds(new Set(results.map(r => r.id)));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="flex justify-between items-end gap-4">
        <div className="flex-1">
          <h2 className="text-3xl font-bold">Encontrar Leads</h2>
          <p className="text-slate-400">Busca focada em perfis e sites do Brasil</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Ex: Colecionadores de vinil no Instagram Brasil..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-amber-500 outline-none"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg"
        >
          {loading ? 'Buscando...' : 'Buscar agora'}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400">Filtrando os melhores resultados no Brasil...</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{results.length} resultados encontrados</h3>
            <button 
              onClick={addAll}
              className="text-amber-500 hover:underline flex items-center gap-1 font-medium"
            >
              <UserPlus size={16} /> Adicionar todos
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map(lead => (
              <div key={lead.id} className="bg-slate-800 border border-slate-700 p-5 rounded-2xl flex items-start gap-4">
                <div className="bg-slate-900 p-3 rounded-xl text-amber-500">
                  {lead.platform === 'Website' ? <Globe size={24} /> : <Search size={24} />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">{lead.name}</h4>
                    <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                      {lead.platform}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{lead.description}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <MapPin size={12} /> {lead.location || 'Brasil'}
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={lead.contact} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs py-2 rounded-lg flex items-center justify-center gap-1 hover:bg-slate-700"
                    >
                      <ExternalLink size={14} /> Abrir Perfil
                    </a>
                    <button 
                      onClick={() => addLead(lead)}
                      disabled={addedIds.has(lead.id)}
                      className={`flex-1 text-xs py-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                        addedIds.has(lead.id) 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-amber-500 text-white hover:bg-amber-600'
                      }`}
                    >
                      {addedIds.has(lead.id) ? (
                        <><CheckCircle2 size={14} /> Adicionado</>
                      ) : (
                        <><UserPlus size={14} /> Salvar</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sources.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 tracking-widest">Fontes de Grounding</h4>
              <div className="flex flex-wrap gap-3">
                {sources.map((s, idx) => s.web && (
                  <a 
                    key={idx} 
                    href={s.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-1.5 rounded-full border border-slate-700 transition-colors"
                  >
                    {s.web.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadFinder;
