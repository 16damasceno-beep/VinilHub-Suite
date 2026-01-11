
import React, { useState } from 'react';
import { Lead, MarketingContent } from '../types';
import { 
  Trash2, 
  Send, 
  MessageCircle, 
  CheckCircle, 
  Instagram, 
  Facebook, 
  Globe, 
  UserPlus, 
  Download,
  Upload,
  Clock,
  AlertCircle,
  Phone,
  AtSign,
  Copy
} from 'lucide-react';

interface ContactListProps {
  leads: Lead[];
  selectedLeads: Set<string>;
  onToggleSelect: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdateStatus: (id: string, status: 'enviado' | 'pendente' | 'falha') => void;
  onImport: (leads: Lead[]) => void;
  marketingContent: MarketingContent | null;
}

type QuickPlatform = 'WhatsApp' | 'Instagram' | 'Facebook';

const ContactList: React.FC<ContactListProps> = ({ 
  leads, 
  selectedLeads, 
  onToggleSelect, 
  onRemove,
  onUpdateStatus,
  onImport,
  marketingContent
}) => {
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [quickContact, setQuickContact] = useState('');
  const [showQuickSend, setShowQuickSend] = useState(false);
  const [quickPlatform, setQuickPlatform] = useState<QuickPlatform>('WhatsApp');
  const [isBulkSending, setIsBulkSending] = useState(false);

  const handleImport = () => {
    const lines = importText.split('\n').filter(l => l.trim().length > 0);
    const newLeads: Lead[] = lines.map((line, index) => {
      const contact = line.trim();
      // Heurística simples: se tem só números, é whats. Se começa com @ ou tem barra, é social.
      const isNumber = /^\d+$/.test(contact.replace(/\D/g, '')) && contact.length >= 8;
      const isFB = contact.toLowerCase().includes('facebook') || contact.toLowerCase().includes('fb.com');
      
      let platform: 'WhatsApp' | 'Instagram' | 'Facebook' = 'Instagram';
      if (isNumber) platform = 'WhatsApp';
      else if (isFB) platform = 'Facebook';

      return {
        id: `imported-${Date.now()}-${index}`,
        name: isNumber ? `Whats ${contact}` : `Perfil ${contact}`,
        platform: platform,
        contact: contact,
        location: 'Brasil (Importado)',
        description: 'Contato adicionado manualmente.',
        status: 'pendente'
      };
    });

    onImport(newLeads);
    setImportText('');
    setShowImport(false);
  };

  const handleQuickSend = () => {
    if (!marketingContent) {
      alert('Por favor, gere o plano de marketing primeiro na aba "Análise & Plano".');
      return;
    }
    if (!quickContact) {
      alert('Digite um contato válido.');
      return;
    }

    const leadMock: Lead = {
      id: 'quick',
      name: 'Envio Rápido',
      platform: quickPlatform,
      contact: quickContact,
      location: 'Brasil',
      description: ''
    };

    handleSendToLead(leadMock);
    setQuickContact('');
  };

  const handleSendToLead = async (lead: Lead) => {
    if (!marketingContent) {
      alert('Por favor, gere o plano de marketing primeiro na aba "Análise & Plano".');
      return;
    }

    if (lead.id !== 'quick') {
      onUpdateStatus(lead.id, 'enviado');
    }

    let url = '';
    
    switch (lead.platform) {
      case 'WhatsApp':
        const cleanNum = lead.contact.replace(/\D/g, '');
        const formattedNum = cleanNum.startsWith('55') ? cleanNum : `55${cleanNum}`;
        const waMsg = encodeURIComponent(marketingContent.whatsapp);
        url = `https://wa.me/${formattedNum}?text=${waMsg}`;
        window.open(url, '_blank');
        break;

      case 'Instagram':
        // Copiar texto do Instagram para o clipboard
        await navigator.clipboard.writeText(marketingContent.instagram);
        const igHandle = lead.contact.replace('@', '').replace('https://instagram.com/', '').split('/')[0];
        url = lead.contact.startsWith('http') ? lead.contact : `https://instagram.com/${igHandle}`;
        
        // Abre o link. O usuário só precisa colar.
        window.open(url, '_blank');
        break;

      case 'Facebook':
        // Copiar texto do Facebook para o clipboard
        await navigator.clipboard.writeText(marketingContent.facebook);
        const fbHandle = lead.contact.replace('https://facebook.com/', '').replace('https://www.facebook.com/', '').split('/')[0];
        url = lead.contact.includes('facebook.com') ? lead.contact : `https://facebook.com/${fbHandle}`;
        
        window.open(url, '_blank');
        break;

      default:
        url = lead.contact;
        window.open(url, '_blank');
    }
  };

  const handleBulkSend = async () => {
    const selected = leads.filter(l => selectedLeads.has(l.id));
    if (selected.length === 0) return;

    const containsSocial = selected.some(l => l.platform === 'Instagram' || l.platform === 'Facebook');
    
    if (containsSocial) {
      const confirm = window.confirm(
        "Sua seleção contém contatos de Instagram/Facebook. \n\n" +
        "Para estas redes, o sistema irá abrir os perfis um por um e copiar o texto automaticamente. \n" +
        "Você só precisará apertar CTRL+V (Colar) e enviar no direct. \n\n" +
        "Deseja iniciar?"
      );
      if (!confirm) return;
    }

    setIsBulkSending(true);
    
    for (let i = 0; i < selected.length; i++) {
      const lead = selected[i];
      await handleSendToLead(lead);
      // Delay maior para evitar bloqueio de popups e dar tempo do clipboard funcionar
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    setIsBulkSending(false);
    alert('Sequência finalizada!');
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'enviado': return <span className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold uppercase"><CheckCircle size={10}/> Enviado</span>;
      case 'falha': return <span className="flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold uppercase"><AlertCircle size={10}/> Falha</span>;
      default: return <span className="flex items-center gap-1 text-[10px] bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase"><Clock size={10}/> Pendente</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Distribuição de Campanha</h2>
          <p className="text-slate-400">Envie o plano da <b>Vinil Doro</b> (C2C) sem leilões.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => { setShowQuickSend(!showQuickSend); setShowImport(false); }}
            className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border ${
              showQuickSend ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
            }`}
          >
            <Send size={18} /> Envio Avulso
          </button>
          <button 
            onClick={() => { setShowImport(!showImport); setShowQuickSend(false); }}
            className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border ${
              showImport ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-700'
            }`}
          >
            <Upload size={18} /> Importar Lista
          </button>
          {selectedLeads.size > 0 && (
            <button 
              onClick={handleBulkSend}
              disabled={isBulkSending}
              className="bg-amber-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isBulkSending ? <span className="animate-spin">💿</span> : <Send size={18} />}
              {isBulkSending ? 'Processando...' : `Disparar Selecionados (${selectedLeads.size})`}
            </button>
          )}
        </div>
      </div>

      {showQuickSend && (
        <div className="bg-slate-800 border border-amber-500/30 p-6 rounded-3xl animate-in fade-in zoom-in-95 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Send className="text-amber-500" size={18} /> Envio Rápido de Mensagem
            </h4>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-900 px-2 py-1 rounded">Vinil Doro Mode</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              {(['WhatsApp', 'Instagram', 'Facebook'] as QuickPlatform[]).map(p => (
                <button
                  key={p}
                  onClick={() => setQuickPlatform(p)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                    quickPlatform === p 
                      ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20' 
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {p === 'WhatsApp' && <MessageCircle size={14} />}
                  {p === 'Instagram' && <Instagram size={14} />}
                  {p === 'Facebook' && <Facebook size={14} />}
                  {p}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                {quickPlatform === 'WhatsApp' ? <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /> : <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />}
                <input 
                  type="text" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white focus:border-amber-500 outline-none transition-all"
                  placeholder={quickPlatform === 'WhatsApp' ? "Ex: 11999998888" : "Ex: @usuario ou link do perfil"}
                  value={quickContact}
                  onChange={(e) => setQuickContact(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuickSend()}
                />
              </div>
              <button 
                onClick={handleQuickSend}
                className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Send size={18} /> Enviar Agora
              </button>
            </div>
            <p className="text-[10px] text-slate-500 italic text-center">
              * Para Instagram/Facebook: O sistema copia o texto e você cola no direct.
            </p>
          </div>
        </div>
      )}

      {showImport && (
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl animate-in fade-in zoom-in-95 shadow-2xl">
          <h4 className="font-bold text-white mb-2">Importação em Massa</h4>
          <p className="text-sm text-slate-400 mb-4">Cole uma lista de contatos do Brasil (números ou links de perfis), um por linha.</p>
          <textarea 
            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-amber-500 outline-none h-40 font-mono text-sm transition-all"
            placeholder="11912345678&#10;@colecionador_vinil&#10;https://facebook.com/usuario"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <div className="flex justify-end gap-3 mt-4">
             <button onClick={() => setShowImport(false)} className="text-slate-400 px-4 py-2 hover:text-white">Cancelar</button>
             <button onClick={handleImport} className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 shadow-lg shadow-amber-500/20">Sincronizar Lista</button>
          </div>
        </div>
      )}

      {leads.length > 0 ? (
        <div className="overflow-hidden bg-slate-800 border border-slate-700 rounded-3xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-700">
                <th className="px-6 py-5 w-12 text-center">Sel.</th>
                <th className="px-6 py-5">Identificação</th>
                <th className="px-6 py-5">Canal Social</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Ação Direta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {leads.map(lead => (
                <tr key={lead.id} className={`hover:bg-slate-700/30 transition-colors group ${selectedLeads.has(lead.id) ? 'bg-amber-500/5' : ''}`}>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 rounded-md accent-amber-500 cursor-pointer border-slate-700 bg-slate-900"
                      checked={selectedLeads.has(lead.id)}
                      onChange={() => onToggleSelect(lead.id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <div className="font-bold text-slate-200">{lead.name}</div>
                      <div className="text-xs text-slate-500 font-mono truncate max-w-[200px]">{lead.contact}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${
                      lead.platform === 'WhatsApp' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      lead.platform === 'Instagram' ? 'bg-pink-500/10 text-pink-500 border-pink-500/20' :
                      'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                      {lead.platform === 'WhatsApp' && <MessageCircle size={14} />}
                      {lead.platform === 'Instagram' && <Instagram size={14} />}
                      {lead.platform === 'Facebook' && <Facebook size={14} />}
                      <span>{lead.platform}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleSendToLead(lead)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-all shadow-md group-hover:scale-105"
                      >
                        <Send size={12} /> {lead.platform === 'WhatsApp' ? 'Abrir Chat' : 'Copiar e Abrir'}
                      </button>
                      <button 
                        onClick={() => onRemove(lead.id)}
                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !showQuickSend && !showImport && (
        <div className="bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-3xl p-20 text-center text-slate-500">
          <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
            <UserPlus size={32} className="opacity-20" />
          </div>
          <h3 className="text-xl font-bold text-slate-300 mb-2">Lista de Disparo Vinil Doro</h3>
          <p className="max-w-xs mx-auto text-sm">Sua agenda está vazia. Importe seus contatos ou use o "Envio Avulso" para começar a divulgar seu acervo.</p>
        </div>
      )}

      {marketingContent && leads.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
           <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/20 shadow-inner">
              <CheckCircle className="text-amber-500" size={32} />
           </div>
           <div className="flex-1 text-center md:text-left">
              <h4 className="text-xl font-bold text-white mb-2">Dica de Conversão Vinil Doro</h4>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
                Lembre-se: no Instagram e Facebook, o sistema <b>copia o texto automaticamente</b>. 
                Ao abrir a conversa, basta pressionar <b>CTRL+V</b> e enviar. O foco é mostrar que colecionadores podem vender para colecionadores de forma segura.
              </p>
           </div>
           <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
              <div className="bg-slate-900 px-5 py-3 rounded-xl border border-slate-700 flex flex-col items-center">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Total de Contatos</span>
                <span className="text-2xl font-bold text-white">{leads.length}</span>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
