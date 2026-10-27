import React, { useState, useId } from 'react';
import {
  Calendar,
  Clock,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  AlertCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  User,
  Phone,
  Mail,
  FileText,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Appointment } from '../types/clinic';
import {
  CONSULTATION_FIXED_PRICE,
  formatBRL,
  formatBRPhone,
  getAvailableSlotsForDate,
  validateBookingForm,
} from '../utils/clinic-logic';
import { createGoogleCalendarEvent } from '../services/calendarService';

interface BookingSectionProps {
  appointments: Appointment[];
  onAppointmentBooked: (newAppointment: Appointment) => void;
  onGoToHub: () => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  appointments,
  onAppointmentBooked,
  onGoToHub,
}) => {
  // Tomorrow as default date
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [date, setDate] = useState<string>(tomorrow);
  const [time, setTime] = useState<string>('09:30');
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientCpf, setPatientCpf] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [bookingStep, setBookingStep] = useState<'form' | 'payment' | 'confirmed'>('form');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [cardInstallments, setCardInstallments] = useState<string>('1');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [copiedPix, setCopiedPix] = useState<boolean>(false);

  // Confirmed appointment reference
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [gcalSyncMessage, setGcalSyncMessage] = useState<string>('');
  const [gcalLink, setGcalLink] = useState<string | null>(null);

  const availableSlots = getAvailableSlotsForDate(date, appointments);

  // Unique PIX string representation
  const pixCopyPasteCode = `00020126580014br.gov.bcb.pix0136dermatologia.rossi@pagamentos.com.br5204000053039865406300.005802BR5925DRA ISABELLA ROSSI DERM6009SAO PAULO62140510CONSULTA3006304C92A`;

  // Advance to payment step after strict validation
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateBookingForm({
      patientName,
      patientEmail,
      patientPhone,
      date,
      time,
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});
    setBookingStep('payment');
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Complete payment and confirm the slot strictly
  const handleCompletePayment = async () => {
    setIsProcessingPayment(true);

    try {
      // Realistic transaction simulation
      await new Promise((resolve) => setTimeout(resolve, 1400));

      const paymentId =
        paymentMethod === 'pix'
          ? `PIX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
          : `CC-AUTH-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      // Trigger automatic Google Calendar synchronization
      const gcalResult = await createGoogleCalendarEvent({
        patientName,
        patientPhone,
        patientEmail,
        notes,
        date,
        time,
        amount: CONSULTATION_FIXED_PRICE,
      });

      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        patientName: patientName.trim(),
        patientEmail: patientEmail.trim(),
        patientPhone: patientPhone.trim(),
        patientCpf: patientCpf.trim() || undefined,
        notes: notes.trim() || undefined,
        date,
        time,
        amount: CONSULTATION_FIXED_PRICE,
        paymentMethod,
        paymentId,
        paymentDate: new Date().toISOString(),
        status: 'confirmado_pago',
        googleCalendarEventId: gcalResult.eventId,
        googleCalendarSynced: gcalResult.success,
        createdAt: new Date().toISOString(),
      };

      setConfirmedAppointment(newAppointment);
      onAppointmentBooked(newAppointment);

      if (gcalResult.success) {
        setGcalSyncMessage(
          'Consulta sincronizada com sucesso no Google Agenda da Dra. Isabella Rossi.'
        );
        if (gcalResult.htmlLink) {
          setGcalLink(gcalResult.htmlLink);
        }
      } else {
        setGcalSyncMessage(
          'Agendamento confirmado! A sincronização com o Google Agenda será reprocessada no hub.'
        );
      }

      setBookingStep('confirmed');

      // Trigger confetti celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b76e5b', '#e6c594', '#10b981', '#3b82f6'],
      });
    } catch (err: any) {
      console.error('Erro no processamento do pagamento:', err);
      alert('Não foi possível processar o pagamento. Verifique os dados e tente novamente.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCopyPasteCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleResetForm = () => {
    setPatientName('');
    setPatientPhone('');
    setPatientEmail('');
    setPatientCpf('');
    setNotes('');
    setBookingStep('form');
    setConfirmedAppointment(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Intro Hero Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs sm:text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>Agendamento Oficial com Pagamento Antecipado • R$ 300,00</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal tracking-tight">
          Agende sua Consulta Dermatológica
        </h1>
        <p className="mt-2 text-stone-600 max-w-2xl mx-auto text-sm sm:text-base">
          Avaliação médica individualizada, dermatoscopia digital de sinais e plano de tratamento sob medida com a Dra. Isabella Rossi.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border ${
            bookingStep === 'form'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
            1
          </span>
          <span>1. Dados & Horário</span>
        </div>

        <div className="w-8 h-0.5 bg-stone-300"></div>

        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border ${
            bookingStep === 'payment'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm animate-pulse'
              : bookingStep === 'confirmed'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-stone-100 text-stone-500 border-stone-200'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
            2
          </span>
          <span>2. Pagamento Obrigatório (R$ 300)</span>
        </div>

        <div className="w-8 h-0.5 bg-stone-300"></div>

        <div
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border ${
            bookingStep === 'confirmed'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-stone-100 text-stone-400 border-stone-200'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
            3
          </span>
          <span>3. Confirmação & Agenda</span>
        </div>
      </div>

      {/* STEP 1: BOOKING FORM */}
      {bookingStep === 'form' && (
        <form onSubmit={handleProceedToPayment} className="space-y-8">
          {/* Card: Price & Rules Banner */}
          <div className="bg-gradient-to-r from-stone-900 to-amber-950 text-stone-100 p-6 rounded-2xl shadow-xl border border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4" />
                Consulta Médica Presencial
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-medium text-white">
                Avaliação Clínica & Cosmiátrica Completa
              </h2>
              <p className="text-xs sm:text-sm text-stone-300">
                Duração de 50 minutos • Exame de mapeamento de pintas • Prescrição personalizada
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-amber-500/30 text-right shrink-0">
              <span className="text-xs text-stone-400 uppercase tracking-wider block">
                Valor Fixo da Consulta
              </span>
              <span className="text-3xl font-serif font-bold text-amber-200">
                {formatBRL(CONSULTATION_FIXED_PRICE)}
              </span>
              <span className="text-[11px] text-amber-400/90 block mt-1">
                Pagamento prévio obrigatório
              </span>
            </div>
          </div>

          {/* Card: Schedule Selection */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  1. Escolha a Data e o Horário
                </h3>
                <p className="text-xs text-stone-500">
                  Os horários vagos são atualizados em tempo real com a agenda da clínica.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date Input */}
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-700">
                  Data da Consulta *
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm transition-all"
                  required
                />
                {validationErrors.date && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.date}
                  </p>
                )}
                <span className="text-[11px] text-stone-400 block">
                  Atendimento de Segunda a Sexta.
                </span>
              </div>

              {/* Time Slots Grid */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-700">
                  Horários Disponíveis em {new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR')} *
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map(({ time: slotTime, available }) => {
                    const isSelected = time === slotTime && available;
                    return (
                      <button
                        key={slotTime}
                        type="button"
                        disabled={!available}
                        onClick={() => setTime(slotTime)}
                        className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex flex-col items-center justify-center gap-0.5 ${
                          !available
                            ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed line-through opacity-60'
                            : isSelected
                            ? 'bg-amber-700 text-white shadow-md ring-2 ring-amber-700/50'
                            : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 hover:border-amber-400'
                        }`}
                      >
                        <span className="font-mono text-sm">{slotTime}</span>
                        <span className="text-[9px]">
                          {available ? (isSelected ? 'Selecionado' : 'Disponível') : 'Reservado'}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {validationErrors.time && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.time}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Card: Patient Information */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900">
                  2. Dados do Paciente
                </h3>
                <p className="text-xs text-stone-500">
                  Informações necessárias para o prontuário e envio do comprovante.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-700">
                  Nome Completo do Paciente *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Ex: Mariana Duarte Soares"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm"
                    required
                  />
                </div>
                {validationErrors.patientName && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.patientName}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-700">
                  WhatsApp com DDD *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(formatBRPhone(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm font-mono"
                    required
                  />
                </div>
                {validationErrors.patientPhone && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.patientPhone}
                  </p>
                )}
                <span className="text-[11px] text-stone-400 block">
                  Você receberá as orientações pré-consulta aqui.
                </span>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-700">
                  E-mail para Confirmação *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder="paciente@exemplo.com.br"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm"
                    required
                  />
                </div>
                {validationErrors.patientEmail && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.patientEmail}
                  </p>
                )}
              </div>

              {/* CPF (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-700">
                  CPF (para Nota Fiscal Médica)
                </label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  value={patientCpf}
                  onChange={(e) => setPatientCpf(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm font-mono"
                />
              </div>

              {/* Chief Complaint / Notes */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-700">
                  Principal Queixa ou Interesse Dermatológico
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Gostaria de tratar melasma resistente nas bochechas e saber sobre o protocolo Dermamelan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Button: Proceed to Payment */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <div className="text-stone-700 text-xs sm:text-sm flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Importante:</strong> Para garantir o horário e o compromisso médico, o agendamento
                só é confirmado após o pagamento fixo de <strong>R$ 300,00</strong>.
              </span>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group shrink-0"
            >
              <span>Prosseguir para Pagamento (R$ 300)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: PAYMENT GATE (MANDATORY REQUIREMENT) */}
      {bookingStep === 'payment' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Summary Box */}
          <div className="bg-stone-900 text-stone-100 p-6 sm:p-8 rounded-2xl border border-stone-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block">
                  Etapa Obrigatória de Pagamento
                </span>
                <h3 className="font-serif text-2xl text-white">
                  Confirmar Consulta: Dra. Isabella Rossi
                </h3>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-400 block">Total a Pagar</span>
                <span className="font-serif text-3xl font-bold text-amber-200">
                  {formatBRL(CONSULTATION_FIXED_PRICE)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-300">
              <div className="bg-stone-800/80 p-3 rounded-lg border border-stone-700/60">
                <span className="text-stone-400 block">Paciente:</span>
                <span className="font-semibold text-white text-sm">{patientName}</span>
              </div>
              <div className="bg-stone-800/80 p-3 rounded-lg border border-stone-700/60">
                <span className="text-stone-400 block">Data e Horário:</span>
                <span className="font-semibold text-white text-sm">
                  {new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR')} às {time}h
                </span>
              </div>
              <div className="bg-stone-800/80 p-3 rounded-lg border border-stone-700/60">
                <span className="text-stone-400 block">WhatsApp de Contato:</span>
                <span className="font-semibold text-white text-sm">{patientPhone}</span>
              </div>
            </div>

            <p className="text-xs text-amber-300/80 italic">
              * A vaga no horário selecionado só é confirmada no sistema após a conclusão deste pagamento.
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/90 shadow-sm space-y-6">
            <div className="flex border-b border-stone-200 pb-4">
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-600/50'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  <span>PIX Instantâneo (Aprovação Imediata)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-600/50'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-700" />
                  <span>Cartão de Crédito</span>
                </button>
              </div>
            </div>

            {/* PIX TAB */}
            {paymentMethod === 'pix' && (
              <div className="space-y-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <p className="font-semibold text-emerald-800">
                      Liberação imediata do horário e sincronização com o Google Calendar!
                    </p>
                    <p className="mt-0.5 text-emerald-700">
                      Abra o app do seu banco, escolha <strong>Pagar via Pix</strong> e aponte a câmera
                      para o QR Code ou cole o código Copia e Cola abaixo.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 justify-center py-4">
                  {/* Visual QR Code Box */}
                  <div className="p-4 bg-white border-2 border-stone-800 rounded-2xl shadow-md text-center">
                    <div className="w-48 h-48 bg-stone-900 p-2 rounded-xl flex items-center justify-center relative group">
                      {/* Stylized QR representation */}
                      <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                        <rect x="5" y="5" width="25" height="25" fill="#ffffff" />
                        <rect x="10" y="10" width="15" height="15" fill="#1c1917" />
                        <rect x="70" y="5" width="25" height="25" fill="#ffffff" />
                        <rect x="75" y="10" width="15" height="15" fill="#1c1917" />
                        <rect x="5" y="70" width="25" height="25" fill="#ffffff" />
                        <rect x="10" y="75" width="15" height="15" fill="#1c1917" />
                        {/* Data dots */}
                        <rect x="35" y="10" width="8" height="8" fill="#ffffff" />
                        <rect x="48" y="12" width="6" height="6" fill="#ffffff" />
                        <rect x="35" y="25" width="6" height="6" fill="#ffffff" />
                        <rect x="45" y="25" width="12" height="6" fill="#ffffff" />
                        <rect x="10" y="40" width="15" height="6" fill="#ffffff" />
                        <rect x="30" y="40" width="8" height="8" fill="#ffffff" />
                        <rect x="45" y="40" width="10" height="10" fill="#ffffff" />
                        <rect x="65" y="40" width="12" height="6" fill="#ffffff" />
                        <rect x="85" y="40" width="8" height="8" fill="#ffffff" />
                        <rect x="10" y="55" width="8" height="8" fill="#ffffff" />
                        <rect x="35" y="55" width="6" height="6" fill="#ffffff" />
                        <rect x="50" y="55" width="15" height="6" fill="#ffffff" />
                        <rect x="75" y="55" width="8" height="8" fill="#ffffff" />
                        <rect x="35" y="70" width="8" height="8" fill="#ffffff" />
                        <rect x="50" y="70" width="12" height="12" fill="#ffffff" />
                        <rect x="70" y="70" width="8" height="8" fill="#ffffff" />
                        <rect x="85" y="75" width="8" height="8" fill="#ffffff" />
                        <circle cx="50" cy="50" r="5" fill="#b76e5b" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-stone-600 block mt-2">
                      Valor: R$ 300,00 • Dra. Isabella Rossi
                    </span>
                  </div>

                  {/* Pix Copy and Paste */}
                  <div className="w-full md:w-80 space-y-3">
                    <label className="block text-xs font-medium uppercase tracking-wider text-stone-700">
                      Código Pix Copia e Cola:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={pixCopyPasteCode}
                        className="w-full bg-stone-50 border border-stone-200 text-stone-600 text-xs font-mono p-3 rounded-lg pr-10 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPix}
                        className="absolute right-2 top-2 p-1.5 rounded-md hover:bg-stone-200 text-stone-600 transition-colors"
                        title="Copiar código Pix"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    {copiedPix && (
                      <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Código Pix copiado com sucesso!
                      </p>
                    )}

                    <div className="pt-2">
                      <button
                        type="button"
                        disabled={isProcessingPayment}
                        onClick={handleCompletePayment}
                        className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        {isProcessingPayment ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Confirmando Pagamento e Agenda...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirmar Pagamento Realizado (R$ 300)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CREDIT CARD TAB */}
            {paymentMethod === 'credit_card' && (
              <div className="space-y-4 max-w-lg mx-auto py-2">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-stone-700 mb-1">
                    Nome Completo do Titular (como no cartão) *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: MARIANA D SOARES"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-stone-700 mb-1">
                    Número do Cartão *
                  </label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                        const parts = v.match(/[\s\S]{1,4}/g) || [];
                        setCardNumber(parts.join(' '));
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-stone-700 mb-1">
                      Validade (MM/AA) *
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={(e) => {
                        let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                        if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                        setCardExpiry(v);
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm font-mono text-center"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-stone-700 mb-1">
                      CVV *
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm font-mono text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-stone-700 mb-1">
                    Opção de Parcelamento
                  </label>
                  <select
                    value={cardInstallments}
                    onChange={(e) => setCardInstallments(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm"
                  >
                    <option value="1">1x de R$ 300,00 sem juros à vista</option>
                    <option value="2">2x de R$ 150,00 sem juros</option>
                    <option value="3">3x de R$ 100,00 sem juros</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={handleCompletePayment}
                    className="w-full py-3.5 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Processando Operação de Cartão...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pagar {formatBRL(CONSULTATION_FIXED_PRICE)} e Confirmar Horário</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Back button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setBookingStep('form')}
                className="text-xs text-stone-500 hover:text-stone-800 underline"
              >
                Voltar e alterar horário ou dados do paciente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: CONFIRMED & SYNCHRONIZED SCREEN */}
      {bookingStep === 'confirmed' && confirmedAppointment && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-emerald-200 shadow-xl space-y-8 animate-fadeIn text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              Pagamento Confirmado • Horário Garantido
            </span>
            <h2 className="text-3xl font-serif text-stone-900 font-medium">
              Consulta Dermatológica Agendada!
            </h2>
            <p className="text-stone-600 text-sm max-w-lg mx-auto">
              Parabéns, <strong>{confirmedAppointment.patientName}</strong>! Seu atendimento com a Dra. Isabella Rossi está confirmado e reservado no sistema da clínica.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 text-left max-w-xl mx-auto space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-stone-200 text-xs">
              <span className="text-stone-500">Código de Autenticação / Protocolo:</span>
              <span className="font-mono font-bold text-stone-800 bg-white px-2 py-0.5 rounded border">
                {confirmedAppointment.paymentId}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-stone-500 block">Data:</span>
                <span className="font-semibold text-stone-900">
                  {new Date(`${confirmedAppointment.date}T12:00:00`).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div>
                <span className="text-xs text-stone-500 block">Horário:</span>
                <span className="font-semibold text-stone-900 font-mono text-base">
                  {confirmedAppointment.time} horas
                </span>
              </div>
              <div>
                <span className="text-xs text-stone-500 block">Valor Pago:</span>
                <span className="font-semibold text-emerald-700 font-mono">
                  {formatBRL(confirmedAppointment.amount)} (Quitado)
                </span>
              </div>
              <div>
                <span className="text-xs text-stone-500 block">Local:</span>
                <span className="text-stone-800 text-xs">
                  Av. Faria Lima, 2800 • Conj. 1402 (Itaim Bibi)
                </span>
              </div>
            </div>
          </div>

          {/* Google Calendar Notification Banner (USER'S EXPLICIT REQUIREMENT) */}
          <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-5 text-left max-w-xl mx-auto space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
              <Calendar className="w-5 h-5 text-amber-700" />
              <span>Sincronização com o Google Agenda</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {gcalSyncMessage}
            </p>
            <p className="text-[11px] text-stone-500 italic">
              A médica recebe a notificação instantânea no celular com o seu nome (
              <strong>{confirmedAppointment.patientName}</strong>), telefone e horário marcado.
            </p>

            {gcalLink && (
              <div className="pt-2">
                <a
                  href={gcalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-900 font-medium underline hover:text-amber-700"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Visualizar / Salvar no seu Google Agenda
                </a>
              </div>
            )}
          </div>

          {/* Guidance Notes */}
          <div className="text-xs text-stone-500 max-w-xl mx-auto text-left bg-blue-50/60 p-4 rounded-xl border border-blue-200">
            <span className="font-semibold text-blue-900 block mb-1">
              Orientações para o dia da consulta:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-blue-800">
              <li>Venha preferencialmente sem maquiagem para adequada avaliação dermatoscópica.</li>
              <li>Traga exames de sangue recentes ou biópsias prévias se possuir.</li>
              <li>Estacionamento com manobrista no local (Edifício Metropolitan Medical).</li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={handleResetForm}
              className="px-6 py-3 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-medium transition-all"
            >
              Fazer Novo Agendamento
            </button>

            <button
              onClick={onGoToHub}
              className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-black text-amber-200 text-sm font-medium transition-all shadow-md flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Ver no Hub da Doutora</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
