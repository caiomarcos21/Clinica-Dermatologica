export type AppointmentStatus = 'pendente_pagamento' | 'confirmado_pago' | 'concluido' | 'cancelado';

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientCpf?: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  amount: number; // R$ 300.00
  paymentMethod: 'pix' | 'credit_card';
  paymentId: string;
  paymentDate: string;
  status: AppointmentStatus;
  googleCalendarEventId?: string;
  googleCalendarSynced: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'clareador' | 'anti-idade' | 'acne' | 'fotoprotecao' | 'hidratacao' | 'limpeza';
  categoryLabel: string;
  price: number;
  shortDescription: string;
  howItWorks: string; // "serve para restaurar a pele como um peeling", mecanismo
  howToUse: string;
  activeIngredients: string[];
  volume: string;
  imageUrl: string;
  inStock: boolean;
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  category: string;
  duration: string;
  priceEstimate?: string;
  description: string;
  indications: string[];
  benefits: string[];
  imageUrl: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedPatient?: boolean;
}

export interface ClinicalCase {
  id: string;
  title: string;
  procedure: string;
  diagnosis: string;
  patientAgeGroup: string;
  sessionsCount: number;
  timeframe: string;
  description: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  videoUrl?: string;
  videoThumbnail?: string;
  rating?: number;
  reviewsCount?: number;
  reviews?: Review[];
  testimonial?: {
    quote: string;
    author: string;
    verified: boolean;
  };
  keyTakeaways: string[];
}

export interface DoctorProfile {
  name: string;
  title: string;
  crm: string;
  rqe: string;
  bio: string;
  photoUrl: string;
  specialties: string[];
  academicBackground: {
    degree: string;
    institution: string;
    year: string;
  }[];
  affiliations: string[];
  awardsAndPublications: string[];
  clinicAddress: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    buildingInfo: string;
  };
  contact: {
    whatsapp: string;
    phone: string;
    email: string;
    instagram: string;
    workingHours: string;
  };
}
