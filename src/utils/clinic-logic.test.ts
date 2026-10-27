import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBRL,
  formatBRPhone,
  validateBookingForm,
  isSlotBooked,
  getAvailableSlotsForDate,
  calculateClinicMetrics,
  buildGoogleCalendarEvent,
  calculateAverageRating,
  validateReview,
  CONSULTATION_FIXED_PRICE,
} from './clinic-logic';
import { Appointment } from '../types/clinic';

test('formatBRL correctly formats Brazilian currency', () => {
  const result = formatBRL(300);
  assert.ok(result.includes('300,00'));
  assert.ok(result.includes('R$'));
});

test('formatBRPhone formats standard 11 digits phone number', () => {
  assert.equal(formatBRPhone('11999887766'), '(11) 99988-7766');
  assert.equal(formatBRPhone('119998877'), '(11) 99988-77');
});

test('validateBookingForm catches empty inputs and validates email/phone', () => {
  const invalid = validateBookingForm({
    patientName: '',
    patientEmail: 'invalid-email',
    patientPhone: '123',
    date: '',
    time: '',
  });

  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.patientName);
  assert.ok(invalid.errors.patientEmail);
  assert.ok(invalid.errors.patientPhone);
  assert.ok(invalid.errors.date);
  assert.ok(invalid.errors.time);

  const valid = validateBookingForm({
    patientName: 'Mariana Duarte',
    patientEmail: 'mariana@example.com',
    patientPhone: '(11) 98765-4321',
    date: '2027-01-15',
    time: '10:30',
  });

  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('isSlotBooked detects booked and confirmed appointments only', () => {
  const mockAppointments: Appointment[] = [
    {
      id: 'apt-1',
      patientName: 'Lucas Silva',
      patientEmail: 'lucas@test.com',
      patientPhone: '11999999999',
      date: '2026-11-10',
      time: '09:30',
      amount: 300,
      paymentMethod: 'pix',
      paymentId: 'pix-123',
      paymentDate: '2026-11-01T10:00:00Z',
      status: 'confirmado_pago',
      googleCalendarSynced: true,
      createdAt: '2026-11-01T09:50:00Z',
    },
    {
      id: 'apt-2',
      patientName: 'Carla Dias',
      patientEmail: 'carla@test.com',
      patientPhone: '11888888888',
      date: '2026-11-10',
      time: '14:00',
      amount: 300,
      paymentMethod: 'credit_card',
      paymentId: 'cc-456',
      paymentDate: '',
      status: 'pendente_pagamento', // Not paid yet, should not block slot definitively
      googleCalendarSynced: false,
      createdAt: '2026-11-01T09:50:00Z',
    },
  ];

  assert.equal(isSlotBooked(mockAppointments, '2026-11-10', '09:30'), true);
  assert.equal(isSlotBooked(mockAppointments, '2026-11-10', '14:00'), false);
  assert.equal(isSlotBooked(mockAppointments, '2026-11-10', '16:00'), false);
});

test('calculateClinicMetrics computes revenue and counts accurately', () => {
  const mockAppointments: Appointment[] = [
    {
      id: 'apt-1',
      patientName: 'Paciente 1',
      patientEmail: 'p1@test.com',
      patientPhone: '11999999999',
      date: '2026-11-10',
      time: '09:30',
      amount: 300,
      paymentMethod: 'pix',
      paymentId: 'pix-1',
      paymentDate: '2026-11-01T10:00:00Z',
      status: 'confirmado_pago',
      googleCalendarSynced: true,
      createdAt: '2026-11-01T09:50:00Z',
    },
    {
      id: 'apt-2',
      patientName: 'Paciente 2',
      patientEmail: 'p2@test.com',
      patientPhone: '11999999998',
      date: '2026-11-10',
      time: '11:30',
      amount: 300,
      paymentMethod: 'credit_card',
      paymentId: 'cc-2',
      paymentDate: '2026-11-01T10:00:00Z',
      status: 'confirmado_pago',
      googleCalendarSynced: true,
      createdAt: '2026-11-01T09:50:00Z',
    },
    {
      id: 'apt-3',
      patientName: 'Paciente 3',
      patientEmail: 'p3@test.com',
      patientPhone: '11999999997',
      date: '2026-11-10',
      time: '15:00',
      amount: 300,
      paymentMethod: 'pix',
      paymentId: 'pix-3',
      paymentDate: '',
      status: 'pendente_pagamento',
      googleCalendarSynced: false,
      createdAt: '2026-11-01T09:50:00Z',
    },
  ];

  const metrics = calculateClinicMetrics(mockAppointments, 1250);
  assert.equal(metrics.confirmedCount, 2);
  assert.equal(metrics.pendingCount, 1);
  assert.equal(metrics.consultationRevenue, 600);
  assert.equal(metrics.productSalesTotal, 1250);
  assert.equal(metrics.totalRevenue, 1850);
  assert.equal(metrics.averageTicket, 300);
});

test('buildGoogleCalendarEvent formats accurate calendar payload', () => {
  const payload = buildGoogleCalendarEvent({
    patientName: 'Camila Alcantara',
    patientPhone: '(11) 97777-6666',
    patientEmail: 'camila@exemplo.com',
    notes: 'Queixa de melasma nas maçãs do rosto',
    date: '2026-11-20',
    time: '10:30',
    amount: CONSULTATION_FIXED_PRICE,
  });

  assert.ok(payload.summary.includes('Camila Alcantara'));
  assert.ok(payload.description.includes('R$ 300.00'));
  assert.ok(payload.description.includes('(11) 97777-6666'));
  assert.ok(payload.description.includes('melasma'));
  assert.ok(payload.start.dateTime.includes('2026-11-20T10:30:00'));
  assert.equal(payload.start.timeZone, 'America/Sao_Paulo');
  assert.equal(payload.attendees[0].email, 'camila@exemplo.com');
});

test('calculateAverageRating accurately computes average score from reviews', () => {
  const reviews = [
    { rating: 5 },
    { rating: 4 },
    { rating: 5 },
  ];
  const result = calculateAverageRating(reviews);
  assert.equal(result.count, 3);
  assert.equal(result.average, 4.7);

  const emptyResult = calculateAverageRating([]);
  assert.equal(emptyResult.count, 0);
  assert.equal(emptyResult.average, 5.0);
});

test('validateReview validates author, 1-5 rating, and comment length', () => {
  const invalid = validateReview({
    author: '',
    rating: 0,
    comment: 'oi',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.author);
  assert.ok(invalid.errors.rating);
  assert.ok(invalid.errors.comment);

  const valid = validateReview({
    author: 'Renata Vasconcelos',
    rating: 5,
    comment: 'Excelente atendimento, as manchas clarearam em 3 semanas!',
  });
  assert.equal(valid.isValid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

