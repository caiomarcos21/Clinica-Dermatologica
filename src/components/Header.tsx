import React from 'react';
import { Calendar, Sparkles, ShoppingBag, Award, Info, Lock, CheckCircle2, Download } from 'lucide-react';

export type TabType = 'consultas' | 'produtos' | 'servicos' | 'atendimentos' | 'informacoes' | 'hub';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  appointmentsCount: number;
  totalRevenue: number;
  isGoogleConnected: boolean;
  onOpenInstallModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  appointmentsCount,
  totalRevenue,
  isGoogleConnected,
  onOpenInstallModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 shadow-md">
      {/* Top Clinical Strip */}
      <div className="bg-amber-950/40 border-b border-amber-900/40 px-4 py-1.5 text-xs text-amber-200/90 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Clínica Aberta • Consultas com Confirmação Imediata
          </span>
          <span className="hidden sm:inline text-amber-400/60">•</span>
          <span className="hidden sm:inline text-stone-300">
            Av. Faria Lima, 2800 • Itaim Bibi, SP
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded text-[11px] font-mono">
            CRM-SP 184.920 | RQE 82.411
          </span>
          {isGoogleConnected ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Google Agenda Ativo
            </span>
          ) : (
            <span className="text-stone-400 hidden sm:inline">Google Agenda Integrado</span>
          )}
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Identity */}
          <button
            onClick={() => setActiveTab('consultas')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-700 via-amber-800 to-stone-800 flex items-center justify-center text-amber-200 shadow-inner ring-1 ring-amber-500/40">
              <Sparkles className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-stone-100 group-hover:text-amber-200 transition-colors">
                  Dra. Isabella Rossi
                </span>
                <span className="bg-amber-900/60 text-amber-300 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border border-amber-700/50">
                  SBD
                </span>
              </div>
              <p className="text-xs text-stone-400 tracking-wide font-light">
                Dermatologia Clínica, Cirúrgica & Cosmiatria Avançada
              </p>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('consultas')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'consultas'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Consulta</span>
              <span className="text-[11px] bg-black/20 px-1.5 py-0.2 rounded font-mono">
                R$ 300
              </span>
            </button>

            <button
              onClick={() => setActiveTab('produtos')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'produtos'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Produtos</span>
            </button>

            <button
              onClick={() => setActiveTab('servicos')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'servicos'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Serviços</span>
            </button>

            <button
              onClick={() => setActiveTab('atendimentos')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'atendimentos'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Atendimentos & Casos</span>
            </button>

            <button
              onClick={() => setActiveTab('informacoes')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'informacoes'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>+ Informações</span>
            </button>
          </nav>

          {/* Actions: Baixar App & Hub da Doutora */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenInstallModal}
              className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 bg-stone-800/80 hover:bg-stone-800 text-stone-200 hover:text-amber-300 border border-stone-700 hover:border-amber-500/50 shadow-sm"
              title="Instalar aplicativo no seu celular ou computador"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">Baixar App</span>
              <span className="lg:hidden">Instalar</span>
            </button>

            <button
              onClick={() => setActiveTab('hub')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 border ${
                activeTab === 'hub'
                  ? 'bg-stone-100 text-stone-900 border-white shadow-md'
                  : 'bg-stone-800/90 text-amber-200 border-amber-600/40 hover:bg-stone-800 hover:border-amber-500'
              }`}
              title="Área restrita de gestão para a Dra. Isabella Rossi"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Hub da Doutora</span>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-1.5 py-0.5 rounded font-mono font-semibold">
                {appointmentsCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex overflow-x-auto py-2.5 space-x-1.5 border-t border-stone-800 scrollbar-none text-xs items-center">
          <button
            onClick={onOpenInstallModal}
            className="whitespace-nowrap px-3 py-1.5 rounded-md font-medium shrink-0 flex items-center gap-1.5 text-amber-300 bg-amber-950/60 border border-amber-700/60 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Baixar App</span>
          </button>
          <button
            onClick={() => setActiveTab('consultas')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'consultas' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/60'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Consultas (R$ 300)</span>
          </button>
          <button
            onClick={() => setActiveTab('produtos')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'produtos' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Produtos</span>
          </button>
          <button
            onClick={() => setActiveTab('servicos')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'servicos' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Serviços</span>
          </button>
          <button
            onClick={() => setActiveTab('atendimentos')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'atendimentos' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/60'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Atendimentos</span>
          </button>
          <button
            onClick={() => setActiveTab('informacoes')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'informacoes' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/60'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>+ Info</span>
          </button>
          <button
            onClick={() => setActiveTab('hub')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-md font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'hub' ? 'bg-stone-100 text-stone-900 font-semibold' : 'text-amber-200 bg-stone-800/90 border border-amber-600/30'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Hub Dra ({appointmentsCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
