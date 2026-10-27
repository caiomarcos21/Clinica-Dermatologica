import React, { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header';
import { BookingSection } from './components/BookingSection';
import { ProductsSection } from './components/ProductsSection';
import { ServicesSection } from './components/ServicesSection';
import { ClinicalCasesSection } from './components/ClinicalCasesSection';
import { DoctorInfoSection } from './components/DoctorInfoSection';
import { DoctorHub } from './components/DoctorHub';
import { PWAInstallModal } from './components/PWAInstallModal';
import { Appointment, Service } from './types/clinic';
import { INITIAL_APPOINTMENTS, CLINIC_PRODUCTS, DOCTOR_PROFILE } from './data/clinicData';
import { calculateClinicMetrics, formatBRL } from './utils/clinic-logic';
import { initAuth } from './services/calendarService';
import { Sparkles, Calendar, Lock, Phone, Mail, MapPin, CheckCircle2, Download } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'clinica_rossi_appointments_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('consultas');
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao carregar dados locais:', e);
    }
    return INITIAL_APPOINTMENTS;
  });

  const [isGoogleConnected, setIsGoogleConnected] = useState<boolean>(true); // Pre-activated for clinic flow
  const [connectedUserEmail, setConnectedUserEmail] = useState<string | null>(
    'dra.isabellarossi@gmail.com'
  );

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
    } catch (e) {
      console.warn('Erro ao salvar localmente:', e);
    }
  }, [appointments]);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setIsGoogleConnected(true);
        setConnectedUserEmail(user.email);
      },
      () => {
        // Keeps user aware
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleAppointmentBooked = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  const handleScheduleService = (_service: Service) => {
    setActiveTab('consultas');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const metrics = calculateClinicMetrics(appointments, 3450);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-900">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        appointmentsCount={appointments.length}
        totalRevenue={metrics.totalRevenue}
        isGoogleConnected={isGoogleConnected}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'consultas' && (
          <BookingSection
            appointments={appointments}
            onAppointmentBooked={handleAppointmentBooked}
            onGoToHub={() => setActiveTab('hub')}
          />
        )}

        {activeTab === 'produtos' && (
          <ProductsSection products={CLINIC_PRODUCTS} />
        )}

        {activeTab === 'servicos' && (
          <ServicesSection onScheduleService={handleScheduleService} />
        )}

        {activeTab === 'atendimentos' && <ClinicalCasesSection />}

        {activeTab === 'informacoes' && <DoctorInfoSection />}

        {activeTab === 'hub' && (
          <DoctorHub
            appointments={appointments}
            onUpdateAppointments={setAppointments}
            isGoogleConnected={isGoogleConnected}
            setIsGoogleConnected={setIsGoogleConnected}
            connectedUserEmail={connectedUserEmail}
            setConnectedUserEmail={setConnectedUserEmail}
            onOpenBooking={() => setActiveTab('consultas')}
          />
        )}
      </main>

      {/* Bottom Sticky Action Banner on Mobile (if not already in booking or hub) */}
      {activeTab !== 'consultas' && activeTab !== 'hub' && (
        <div className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-stone-900/95 backdrop-blur-md border-t border-stone-800 p-3 px-4 flex items-center justify-between shadow-2xl">
          <div>
            <span className="text-[10px] text-amber-400 uppercase font-semibold block">
              Consulta Médica
            </span>
            <span className="text-white font-serif font-bold text-sm">
              {formatBRL(300)} (Valor Fixo)
            </span>
          </div>
          <button
            onClick={() => {
              setActiveTab('consultas');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Agendar Agora</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-16 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
            {/* Identity */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-amber-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium text-white">
                    Dra. Isabella Rossi
                  </h3>
                  <span className="text-xs text-amber-400 font-mono">
                    CRM-SP 184.920 • RQE 82.411
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-400 max-w-md leading-relaxed">
                Clínica especializada em dermatologia de precisão, melasma severo com protocolo Dermamelan, rejuvenescimento com naturalidade e cosmiatria baseada em evidências científicas.
              </p>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Membro Titular da Sociedade Brasileira de Dermatologia (SBD)</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-300 block">
                Navegação Rápida
              </span>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button
                    onClick={() => setActiveTab('consultas')}
                    className="hover:text-amber-200 transition-colors"
                  >
                    Agendar Consulta (R$ 300)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('produtos')}
                    className="hover:text-amber-200 transition-colors"
                  >
                    Produtos & Dermamelan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('servicos')}
                    className="hover:text-amber-200 transition-colors"
                  >
                    Serviços & Procedimentos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('atendimentos')}
                    className="hover:text-amber-200 transition-colors"
                  >
                    Atendimentos, Vídeos & Fotos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('informacoes')}
                    className="hover:text-amber-200 transition-colors"
                  >
                    + Informações & Currículo
                  </button>
                </li>
              </ul>
            </div>

            {/* Hub & Contact */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-300 block">
                Acesso & Recepção
              </span>
              <div className="space-y-2 text-xs text-stone-400">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <span>(11) 98765-4321 / (11) 3456-7890</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-500" />
                  <span>contato@draisabellarossi.com.br</span>
                </p>
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                  <span>Av. Brigadeiro Faria Lima, 2800 • Cj 1402, Itaim Bibi, SP</span>
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setIsInstallModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 text-xs font-medium flex items-center gap-2 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Baixar / Instalar Aplicativo</span>
                </button>

                <button
                  onClick={() => setActiveTab('hub')}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-medium flex items-center gap-2 transition-all"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Acessar Hub da Doutora</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <p>
              © {new Date().getFullYear()} Clínica Dermatológica Dra. Isabella Rossi. Todos os direitos reservados.
            </p>
            <p className="text-[11px] text-stone-500 text-center sm:text-right">
              De acordo com as normas éticas do Conselho Federal de Medicina (CFM) e SBD.
            </p>
          </div>
        </div>
      </footer>

      {/* PWA Installation Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
