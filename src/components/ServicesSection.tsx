import React, { useState } from 'react';
import { Sparkles, Clock, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { CLINIC_SERVICES } from '../data/clinicData';
import { Service } from '../types/clinic';

interface ServicesSectionProps {
  onScheduleService: (service: Service) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onScheduleService }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs sm:text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Procedimentos Médicos & Tecnologias de Ponta</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal tracking-tight">
          Serviços & Tratamentos da Clínica
        </h1>
        <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
          Todos os procedimentos são realizados exclusivamente pela Dra. Isabella Rossi com técnicas anatômicas seguras, priorizando harmonia, naturalidade e saúde cutânea.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CLINIC_SERVICES.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Image */}
              <div className="relative h-52 overflow-hidden bg-stone-100">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-stone-900/80 backdrop-blur-md text-stone-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {service.category}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="bg-white/95 text-stone-800 text-xs font-medium px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    {service.duration}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Indications */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider block">
                    Principais Indicações:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.indications.map((ind, i) => (
                      <span
                        key={i}
                        className="bg-stone-50 border border-stone-200 text-stone-700 text-xs px-2.5 py-0.5 rounded-md"
                      >
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="space-y-1 pt-2">
                  <span className="text-[11px] uppercase font-bold text-stone-500 tracking-wider block">
                    Benefícios Clínicos:
                  </span>
                  <ul className="space-y-1 text-xs text-stone-700">
                    {service.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between gap-4 mt-4">
              <div>
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                  Investimento
                </span>
                <span className="text-sm font-semibold text-stone-800 font-mono">
                  {service.priceEstimate}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onScheduleService(service)}
                className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 group-hover:translate-x-0.5"
              >
                <span>Agendar Avaliação</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
