
import React from 'react';
import { AppTab } from '../types';
import { ShoppingBag, Users, Zap, ArrowRight, Globe, Share2, Disc } from 'lucide-react';

interface DashboardProps {
  setTab: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setTab }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600 to-amber-900 p-8 md:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="bg-white/10 w-fit px-4 py-1.5 rounded-full text-[10px] font-black text-white mb-6 backdrop-blur-sm border border-white/20 uppercase tracking-widest">
            Marketing Suite: Vinil Doro
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Divulgue seu Acervo C2C.</h2>
          <p className="text-amber-100 text-lg mb-8 leading-relaxed font-medium">
            Importe seus contatos, analise a <b>Vinil Doro</b> e dispare mensagens profissionais. 
            Foco total em <b>vendas diretas entre usuários</b> e colecionadores brasileiros.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setTab(AppTab.GENERATOR)}
              className="bg-white text-amber-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-50 transition-all shadow-xl hover:-translate-y-1"
            >
              Analisar Marketplace <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => setTab(AppTab.CONTACTS)}
              className="bg-amber-500/20 border border-amber-400/50 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-amber-400/30 transition-all backdrop-blur-sm hover:-translate-y-1"
            >
              Lista de Contatos <Users size={20} />
            </button>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 opacity-20 hidden lg:block">
           <Disc className="w-96 h-96 vinyl-spin text-white" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          icon={<Share2 className="text-amber-500" />}
          title="Direct/Messenger"
          description="Sistema inteligente que copia a mensagem e abre o perfil para você colar no direct do Instagram ou Facebook."
        />
        <FeatureCard 
          icon={<Users className="text-amber-500" />}
          title="Importação Brasil"
          description="Adicione listas de WhatsApp e arrobas de colecionadores. A IA identifica o canal de disparo automaticamente."
        />
        <FeatureCard 
          icon={<Zap className="text-amber-500" />}
          title="Sem Leilões"
          description="Estratégia focada em venda direta (C2C). Facilite a vida de quem quer comprar ou vender um disco raro."
        />
      </div>

      <section className="bg-slate-800/50 border border-slate-700 rounded-3xl p-10 shadow-lg">
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <ShoppingBag className="text-amber-500" /> Guia Vinil Doro de Sucesso
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Step num="1" title="Análise" desc="Analise a proposta da Vinil Doro e USPs." />
          <Step num="2" title="Importar" desc="Suba sua lista de colecionadores BR." />
          <Step num="3" title="Seleção" desc="Filtre quem deve receber a oferta C2C." />
          <Step num="4" title="Envio" desc="Dispare no WhatsApp ou Cole no Direct." />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl hover:border-amber-500/50 transition-all shadow-xl group">
    <div className="mb-6 bg-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
    <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
    <p className="text-slate-400 leading-relaxed text-sm font-medium">{description}</p>
  </div>
);

const Step = ({ num, title, desc }: { num: string, title: string, desc: string }) => (
  <div className="relative">
    <span className="text-6xl font-black text-slate-700/20 absolute -top-6 -left-2 select-none">{num}</span>
    <div className="relative z-10 pt-2">
      <h5 className="font-bold text-white mb-2 uppercase text-xs tracking-widest">{title}</h5>
      <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Dashboard;
