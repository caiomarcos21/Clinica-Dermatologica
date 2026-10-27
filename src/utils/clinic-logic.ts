import { Appointment } from '../types/clinic';

export const CONSULTATION_FIXED_PRICE = 300.0;

export const AVAILABLE_TIME_SLOTS = [
  '08:30',
  '09:30',
  '10:30',
  '11:30',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

/**
 * Format number to Brazilian Real (R$ 300,00)
 */
export function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

/**
 * Format Brazilian phone number
 */
export function formatBRPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Validates scheduling inputs
 */
export function validateBookingForm(data: {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.patientName || data.patientName.trim().length < 3) {
    errors.patientName = 'Informe o nome completo do paciente (mínimo 3 letras).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.patientEmail || !emailRegex.test(data.patientEmail.trim())) {
    errors.patientEmail = 'Informe um e-mail válido para envio da confirmação.';
  }

  const phoneDigits = (data.patientPhone || '').replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    errors.patientPhone = 'Informe um WhatsApp com DDD (pelo menos 10 dígitos).';
  }

  if (!data.date) {
    errors.date = 'Selecione a data da consulta.';
  } else {
    // Cannot book on past dates
    const today = new Date().toISOString().split('T')[0];
    if (data.date < today) {
      errors.date = 'A data da consulta não pode ser anterior a hoje.';
    }
  }

  if (!data.time) {
    errors.time = 'Selecione um horário disponível.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Checks if a slot is already booked and confirmed
 */
export function isSlotBooked(
  appointments: Appointment[],
  date: string,
  time: string
): boolean {
  return appointments.some(
    (apt) =>
      apt.date === date &&
      apt.time === time &&
      (apt.status === 'confirmado_pago' || apt.status === 'concluido')
  );
}

/**
 * Filter available slots for a specific date
 */
export function getAvailableSlotsForDate(
  date: string,
  appointments: Appointment[]
): { time: string; available: boolean }[] {
  return AVAILABLE_TIME_SLOTS.map((slot) => ({
    time: slot,
    available: !isSlotBooked(appointments, date, slot),
  }));
}

/**
 * Calculates clinic financial metrics
 */
export function calculateClinicMetrics(appointments: Appointment[], productSalesTotal: number = 0) {
  const confirmedAppointments = appointments.filter(
    (a) => a.status === 'confirmado_pago' || a.status === 'concluido'
  );

  const consultationRevenue = confirmedAppointments.reduce(
    (acc, curr) => acc + (curr.amount || CONSULTATION_FIXED_PRICE),
    0
  );

  const totalRevenue = consultationRevenue + productSalesTotal;
  const pendingAppointments = appointments.filter((a) => a.status === 'pendente_pagamento');

  return {
    confirmedCount: confirmedAppointments.length,
    pendingCount: pendingAppointments.length,
    consultationRevenue,
    productSalesTotal,
    totalRevenue,
    averageTicket: confirmedAppointments.length > 0
      ? consultationRevenue / confirmedAppointments.length
      : CONSULTATION_FIXED_PRICE,
  };
}

/**
 * Calculates average rating and count from reviews
 */
export function calculateAverageRating(reviews: { rating: number }[]): {
  average: number;
  count: number;
} {
  if (!reviews || reviews.length === 0) {
    return { average: 5.0, count: 0 };
  }
  const sum = reviews.reduce((acc, curr) => acc + curr.rating, 0);
  const average = Number((sum / reviews.length).toFixed(1));
  return { average, count: reviews.length };
}

/**
 * Validates a case review submission
 */
export function validateReview(data: {
  author: string;
  rating: number;
  comment: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.author || data.author.trim().length < 2) {
    errors.author = 'Informe seu nome ou pseudônimo (mínimo 2 caracteres).';
  }

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Selecione uma nota de 1 a 5 estrelas.';
  }

  if (!data.comment || data.comment.trim().length < 5) {
    errors.comment = 'Escreva um breve comentário sobre o atendimento (mínimo 5 caracteres).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Builds Google Calendar event payload according to Google Calendar API v3
 */
export function buildGoogleCalendarEvent(apt: {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  amount: number;
}) {
  const [hours, minutes] = apt.time.split(':').map(Number);
  const startDateTime = new Date(`${apt.date}T${apt.time}:00`);
  // End date is 50 minutes later
  const endDateTime = new Date(startDateTime.getTime() + 50 * 60 * 1000);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatIsoNoZ = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;

  return {
    summary: `🩺 Consulta Dermatológica: ${apt.patientName}`,
    description: `Consulta médica confirmada com Dra. Isabella Rossi.\n\n` +
      `👤 Paciente: ${apt.patientName}\n` +
      `📞 WhatsApp: ${apt.patientPhone}\n` +
      `✉️ E-mail: ${apt.patientEmail}\n` +
      `💰 Pagamento: R$ ${apt.amount.toFixed(2)} (Confirmado e Pago via App)\n` +
      (apt.notes ? `📝 Queixa / Observações: ${apt.notes}\n` : '') +
      `📍 Local: Clínica Rossi Dermatologia - Ed. Metropolitan Medical Center, Sala 1402`,
    location: 'Clínica Rossi Dermatologia - Av. Brigadeiro Faria Lima, 2800, Sala 1402 - São Paulo, SP',
    start: {
      dateTime: `${formatIsoNoZ(startDateTime)}`,
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: `${formatIsoNoZ(endDateTime)}`,
      timeZone: 'America/Sao_Paulo',
    },
    attendees: [
      { email: apt.patientEmail, displayName: apt.patientName },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'popup', minutes: 1440 }, // 1 day
      ],
    },
  };
}
