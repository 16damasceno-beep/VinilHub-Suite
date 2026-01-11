
import React, { useState } from 'react';
import { analyzeSiteAndGenerateContent } from '../services/geminiService';
import { MarketingContent } from '../types';
import { Sparkles, Copy, Check, Send, Instagram, Facebook, Globe, Target, Zap, BookOpen } from 'lucide-react';

interface MessageGeneratorProps {
  onSave: (content: MarketingContent) => void;
  currentContent: MarketingContent | null;
}

const MessageGenerator: React.FC<MessageGeneratorProps> = ({ onSave, currentContent }) => {
  const [loading, setLoading] = useState(false);
  const [siteUrl, setSiteUrl] = useState('https://vinildoro.com.br');
  const [copied, setCopied] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!siteUrl) return;
    setLoading(true);
    try {
      const result = await analyzeSiteAndGenerateContent(siteUrl);
      onSave(result);
    } catch (error) {
      console.error(error);
      alert('Erro ao analisar o site. Verifique sua chave API.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold">Analisador Vinil Doro</h2>
        <p className="text-slate-400">Insira a URL para gerarmos as mensagens brasileiras sem mencionar leilões.</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-xl">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="https://vinildoro.com.br"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-4 text-white focus:border-amber-500 outline-none text-lg transition-all shadow-inner"
              value={siteUrl}
              onChange={e => setSiteUrl(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-10 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-amber-500/20 text-lg group"
          >
            {loading ? <span className="animate-spin text-2xl">💿</span> : <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />}
            {loading ? 'Analisando Vinil Doro...' : 'Gerar Plano C2C'}
          </button>
        </div>
      </div>

      {currentContent && currentContent.plan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-slate-800 border border-slate-700 p-8 rounded-3xl relative overflow-hidden shadow-xl">
               <div className="absolute top-0 right-0 p-4 opacity-5">
                  <BookOpen size={120} />
               </div>
               <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Target className="text-amber-500" /> Estratégia: {currentContent.title}
               </h3>
               
               <div className="space-y-6 relative z-10">
                  <div>
                    <h4 className="text-amber-500 font-bold uppercase text-[10px] tracking-widest mb-2">Tom de Voz</h4>
                    <p className="text-slate-300 leading-relaxed font-medium">{currentContent.plan.tone}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-amber-500 font-bold uppercase text-[10px] tracking-widest mb-2">Público Colecionador</h4>
                    <p className="text-slate-300 leading-relaxed font-medium">{currentContent.plan.targetAudience}</p>
                  </div>

                  <div>
                    <h4 className="text-amber-500 font-bold uppercase text-[10px] tracking-widest mb-2">Vantagens Vinil Doro (USPs)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {currentContent.plan.usp.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 shadow-sm">
                          <Zap size={14} className="text-amber-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-6 rounded-2xl border-l-4 border-amber-500 shadow-lg">
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                       <Target size={16} className="text-amber-500" /> Foco em Venda entre Usuários
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed italic">"{currentContent.plan.strategy}"</p>
                  </div>
               </div>
            </section>

            <div className="space-y-4">
               <h3 className="text-xl font-bold px-2 flex items-center gap-2">
                  <Copy size={18} className="text-amber-500" /> Copywriting Especializado
               </h3>
               <ContentCard 
                  icon={<Send size={20} className="text-green-500" />} 
                  title="WhatsApp (Venda Direta)" 
                  text={currentContent.whatsapp} 
                  onCopy={() => copyToClipboard(currentContent.whatsapp, 'wa')}
                  isCopied={copied === 'wa'}
                />
                <ContentCard 
                  icon={<Instagram size={20} className="text-pink-500" />} 
                  title="Instagram (Direct)" 
                  text={currentContent.instagram} 
                  onCopy={() => copyToClipboard(currentContent.instagram, 'ig')}
                  isCopied={copied === 'ig'}
                />
                <ContentCard 
                  icon={<Facebook size={20} className="text-blue-500" />} 
                  title="Facebook (Messenger)" 
                  text={currentContent.facebook} 
                  onCopy={() => copyToClipboard(currentContent.facebook, 'fb')}
                  isCopied={copied === 'fb'}
                />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-amber-500 p-8 rounded-3xl text-amber-950 shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Disc size={100} />
               </div>
               <h4 className="font-black text-xl mb-4 uppercase tracking-tighter relative z-10">Regra de Ouro</h4>
               <p className="text-sm font-semibold leading-relaxed mb-6 relative z-10">
                 A <b>Vinil Doro</b> é um marketplace C2C. Foque na facilidade de colocar um disco à venda em minutos. Não mencione leilões para não confundir o usuário.
               </p>
               <div className="w-full h-1.5 bg-amber-950/20 rounded-full relative z-10"></div>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-xl">
               <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                  <Zap size={18} className="text-amber-500" /> Conversão Estimada
               </h4>
               <div className="space-y-5">
                  <MetricItem label="Alcance Colecionadores" value="~3.500/mês" />
                  <MetricItem label="Taxa de Cadastro" value="8% - 14%" />
                  <MetricItem label="Engajamento Redes" value="Alto (Vinil BR)" />
               </div>
            </div>
          </div>
        </div>
      )}

      {!currentContent && !loading && (
        <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
           <Disc className="w-32 h-32 mb-8 vinyl-spin text-slate-600" />
           <p className="max-w-xs font-medium text-slate-400">Aguardando a URL do seu marketplace <b>Vinil Doro</b> para planejar a divulgação.</p>
        </div>
      )}
    </div>
  );
};

const MetricItem = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between items-center text-sm border-b border-slate-700/50 pb-2">
    <span className="text-slate-400">{label}</span>
    <span className="font-bold text-amber-500">{value}</span>
  </div>
);

const ContentCard = ({ icon, title, text, onCopy, isCopied }: any) => (
  <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl relative group shadow-lg hover:border-amber-500/30 transition-all">
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h4 className="font-bold text-white">{title}</h4>
      <button 
        onClick={onCopy}
        className={`ml-auto p-2.5 rounded-xl transition-all ${
          isCopied ? 'bg-green-500 text-white' : 'bg-slate-900 text-slate-400 hover:text-amber-500 hover:bg-slate-700'
        }`}
      >
        {isCopied ? <Check size={18} /> : <Copy size={18} />}
      </button>
    </div>
    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/30">
      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{text}</p>
    </div>
  </div>
);

const Disc = ({ className, size = 100 }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="4"/>
    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
    <circle cx="50" cy="50" r="10" fill="currentColor"/>
    <circle cx="50" cy="50" r="2" fill="white"/>
  </svg>
);

export default MessageGenerator;
