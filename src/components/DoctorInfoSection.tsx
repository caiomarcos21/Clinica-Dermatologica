import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  CheckCircle2,
  Copy,
  Send,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';
import { DOCTOR_PROFILE } from '../data/clinicData';

export const DoctorInfoSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [contactMessage, setContactMessage] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DOCTOR_PROFILE.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setContactMessage({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header Profile Hero */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Doctor Portrait */}
          <div className="lg:col-span-4 text-center">
            <div className="relative inline-block">
              <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden shadow-xl ring-4 ring-amber-100 mx-auto bg-stone-100">
                <img
                  src={DOCTOR_PROFILE.photoUrl}
                  alt={DOCTOR_PROFILE.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-stone-900 text-amber-200 text-xs font-mono px-3 py-1 rounded-full shadow-md border border-stone-700 whitespace-nowrap">
                {DOCTOR_PROFILE.crm} • {DOCTOR_PROFILE.rqe}
              </span>
            </div>
          </div>

          {/* Doctor Bio & Summary */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full">
                  Membro Titular SBD & SBCD
                </span>
                <span className="bg-stone-100 text-stone-700 text-xs font-medium px-3 py-1 rounded-full">
                  HC-FMUSP
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
                {DOCTOR_PROFILE.name}
              </h1>
              <p className="text-amber-800 font-medium text-sm sm:text-base">
                {DOCTOR_PROFILE.title}
              </p>
            </div>

            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {DOCTOR_PROFILE.bio}
            </p>

            {/* Specialties Badges */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
                Áreas de Atuação & Especialidades Médicas:
              </span>
              <div className="flex flex-wrap gap-2">
                {DOCTOR_PROFILE.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="bg-amber-50 text-amber-950 text-xs px-3 py-1 rounded-lg border border-amber-200/80 font-medium flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-amber-700" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Vitae Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Academic Background */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Formação Acadêmica & Residência
              </h2>
              <p className="text-xs text-stone-500">Trajetória médica de excelência</p>
            </div>
          </div>

          <div className="space-y-4">
            {DOCTOR_PROFILE.academicBackground.map((item, idx) => (
              <div
                key={idx}
                className="relative pl-6 border-l-2 border-amber-600/40 pb-2 space-y-0.5"
              >
                <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-amber-600"></div>
                <span className="text-xs font-mono text-amber-800 font-semibold block">
                  {item.year}
                </span>
                <h4 className="text-sm font-bold text-stone-900">{item.degree}</h4>
                <p className="text-xs text-stone-600">{item.institution}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Affiliations & Publications */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Sociedades Médicas & Produção Científica
              </h2>
              <p className="text-xs text-stone-500">Reconhecimento e ética profissional</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                Títulos e Sociedades:
              </span>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {DOCTOR_PROFILE.affiliations.map((aff, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{aff}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                Publicações & Congressos:
              </span>
              <ul className="space-y-2 text-xs text-stone-600">
                {DOCTOR_PROFILE.awardsAndPublications.map((pub, i) => (
                  <li key={i} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <Award className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>{pub}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Contact & Location Section */}
      <div className="bg-gradient-to-br from-stone-900 to-amber-950 text-stone-100 rounded-3xl shadow-xl p-6 sm:p-10 border border-stone-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                Canais de Atendimento
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Fale com a Clínica Rossi
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm">
                Nossa equipe de recepção médica está à disposição para dúvidas sobre consultas, exames e produtos.
              </p>
            </div>

            <div className="space-y-4 text-sm">
              {/* WhatsApp Direct */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-800/80 border border-stone-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block">WhatsApp Oficial:</span>
                    <span className="font-mono font-medium text-white">
                      {DOCTOR_PROFILE.contact.whatsapp}
                    </span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/5511987654321?text=${encodeURIComponent(
                    'Olá! Gostaria de falar com a recepção da Dra. Isabella Rossi.'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <span>Conversar</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Email Direct */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-800/80 border border-stone-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-400 block">E-mail Profissional:</span>
                    <span className="font-mono text-xs sm:text-sm text-white">
                      {DOCTOR_PROFILE.contact.email}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-3.5 py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs font-medium transition-colors flex items-center gap-1"
                >
                  {copiedEmail ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Address */}
              <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1">
                  <span className="text-stone-400 block">Consultório Presencial:</span>
                  <p className="font-medium text-white text-sm">
                    {DOCTOR_PROFILE.clinicAddress.street}, {DOCTOR_PROFILE.clinicAddress.number} •{' '}
                    {DOCTOR_PROFILE.clinicAddress.neighborhood}
                  </p>
                  <p className="text-stone-300">
                    {DOCTOR_PROFILE.clinicAddress.buildingInfo}
                  </p>
                  <p className="text-stone-400">
                    São Paulo - SP • CEP {DOCTOR_PROFILE.clinicAddress.zipCode}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="text-stone-400 block">Horários de Atendimento:</span>
                  <span className="text-white font-medium">
                    {DOCTOR_PROFILE.contact.workingHours}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Message Form */}
          <div className="lg:col-span-6 bg-stone-800/90 rounded-2xl p-6 sm:p-8 border border-stone-700/80 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-xl font-medium text-white">
                  Envie uma Mensagem Direta
                </h3>
                <p className="text-xs text-stone-400">
                  Respondemos em até 2 horas úteis.
                </p>
              </div>

              {formSent ? (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <h4 className="font-serif text-lg text-white">Mensagem Enviada!</h4>
                  <p className="text-xs text-stone-300">
                    Recebemos seu contato com sucesso. Nossa equipe entrará em contato pelo seu WhatsApp ou e-mail.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">
                      Seu Nome Completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Dra. ou Sr(a)..."
                      value={contactMessage.name}
                      onChange={(e) =>
                        setContactMessage({ ...contactMessage, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">
                        Seu E-mail
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="nome@email.com"
                        value={contactMessage.email}
                        onChange={(e) =>
                          setContactMessage({ ...contactMessage, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">
                        Seu Telefone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={contactMessage.phone}
                        onChange={(e) =>
                          setContactMessage({ ...contactMessage, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-400 mb-1">
                      Mensagem / Dúvida
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Como podemos te ajudar?"
                      value={contactMessage.message}
                      onChange={(e) =>
                        setContactMessage({ ...contactMessage, message: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white placeholder-stone-500 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs transition-colors flex items-center justify-center gap-2 shadow-md mt-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Mensagem para a Clínica</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
