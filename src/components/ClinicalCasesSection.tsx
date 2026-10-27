import React, { useState, useEffect } from 'react';
import {
  Award,
  Play,
  CheckCircle2,
  Calendar,
  Sparkles,
  X,
  Volume2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Star,
  MessageSquare,
  Send,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CLINICAL_CASES } from '../data/clinicData';
import { ClinicalCase, Review } from '../types/clinic';
import { calculateAverageRating, validateReview } from '../utils/clinic-logic';

const LOCAL_STORAGE_CASES_KEY = 'clinica_rossi_cases_reviews_v1';

export const ClinicalCasesSection: React.FC = () => {
  const [cases, setCases] = useState<ClinicalCase[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CASES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Erro ao carregar avaliações salvas:', e);
    }
    return CLINICAL_CASES;
  });

  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || 'caso-melasma');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0 - 100
  const [activeVideoModal, setActiveVideoModal] = useState<ClinicalCase | null>(null);

  // Review form states
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewAuthor, setReviewAuthor] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [reviewErrors, setReviewErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CASES_KEY, JSON.stringify(cases));
    } catch (e) {
      console.warn('Erro ao salvar avaliações:', e);
    }
  }, [cases]);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const reviewsList = selectedCase.reviews || [];
  const { average: currentAverage, count: currentCount } = calculateAverageRating(reviewsList);

  const starLabels: Record<number, string> = {
    1: 'Insatisfatório (1/5)',
    2: 'Regular (2/5)',
    3: 'Bom resultado (3/5)',
    4: 'Muito bom / Excelente (4/5)',
    5: 'Excepcional / Superou expectativas (5/5)',
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateReview({
      author: reviewAuthor,
      rating: userRating,
      comment: reviewComment,
    });

    if (!validation.isValid) {
      setReviewErrors(validation.errors);
      return;
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      rating: userRating,
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString('pt-BR'),
      verifiedPatient: true,
    };

    const updatedCases = cases.map((c) => {
      if (c.id === selectedCase.id) {
        const nextReviews = [newReview, ...(c.reviews || [])];
        const { average, count } = calculateAverageRating(nextReviews);
        return {
          ...c,
          reviews: nextReviews,
          rating: average,
          reviewsCount: count,
        };
      }
      return c;
    });

    setCases(updatedCases);
    setReviewSuccessMsg('Obrigado! Sua avaliação de 1 a 5 estrelas foi registrada com sucesso.');
    setReviewErrors({});
    setReviewAuthor('');
    setReviewComment('');
    setShowReviewForm(false);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#eab308', '#f59e0b', '#b76e5b', '#10b981'],
    });

    setTimeout(() => {
      setReviewSuccessMsg(null);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs sm:text-sm font-medium">
          <Award className="w-4 h-4 text-emerald-700" />
          <span>Resultados Reais & Casos Clínicos Documentados</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal tracking-tight">
          Atendimentos que Transformaram Pacientes
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Veja vídeos e fotografias de procedimentos reais conduzidos pela Dra. Isabella Rossi.
          Comparações antes e depois rigorosamente documentadas sob o mesmo padrão de iluminação clínica.
        </p>
      </div>

      {/* Case Selector Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-2 justify-start md:justify-center scrollbar-none">
        {cases.map((c) => {
          const isSelected = selectedCase.id === c.id;
          const caseRating = calculateAverageRating(c.reviews || []).average;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCaseId(c.id);
                setSliderPosition(50);
                setShowReviewForm(false);
              }}
              className={`px-4 py-3 rounded-2xl text-left border transition-all shrink-0 flex items-center gap-3 ${
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-amber-600/50'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400 hover:bg-stone-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-semibold block">{c.title}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-[11px] ${
                      isSelected ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {c.patientAgeGroup}
                  </span>
                  <span className="text-amber-400 flex items-center text-[11px] font-bold">
                    <Star className="w-3 h-3 fill-current mr-0.5" />
                    {caseRating.toFixed(1)}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Case Featured Showcase */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden p-6 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Before & After Slider (Lg: 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
              <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                Arraste o cursor para comparar Antes e Depois
              </span>
              <span className="font-mono bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                {sliderPosition}%
              </span>
            </div>

            {/* Slider Container */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden select-none shadow-md bg-stone-100 group">
              {/* After Image (Background) */}
              <img
                src={selectedCase.afterImageUrl}
                alt="Depois do tratamento"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute bottom-4 right-4 bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm border border-emerald-500/30">
                Depois ({selectedCase.timeframe})
              </span>

              {/* Before Image (Clipped Overlay) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={selectedCase.beforeImageUrl}
                  alt="Antes do tratamento"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-md text-stone-200 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg shadow-sm border border-stone-700">
                  Antes do Tratamento
                </span>
              </div>

              {/* Slider Handle Divider Line */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-2xl border-2 border-stone-800 flex items-center justify-center text-stone-900 pointer-events-auto">
                  <div className="flex -space-x-1">
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Hidden Range Input for full touch & drag accessibility */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
                aria-label="Controle de comparação antes e depois"
              />
            </div>

            {/* Video Action Button */}
            {selectedCase.videoUrl && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveVideoModal(selectedCase)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-stone-900 to-amber-950 hover:from-black hover:to-amber-900 text-white font-medium text-sm transition-all shadow-md flex items-center justify-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-600 group-hover:scale-110 transition-transform flex items-center justify-center text-white shadow">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <span>Assistir Vídeo do Procedimento & Relato da Paciente</span>
                </button>
              </div>
            )}
          </div>

          {/* Case Clinical Dossier (Lg: 5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-amber-700 block">
                  Prontuário de Atendimento
                </span>

                {/* Rating Badge */}
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= Math.round(currentAverage) ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold font-mono text-stone-900">
                    {currentAverage.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    ({currentCount})
                  </span>
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {selectedCase.title}
              </h2>
              <p className="text-xs text-stone-500 font-mono">
                {selectedCase.procedure}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block">Diagnóstico:</span>
                <span className="font-medium text-stone-800">{selectedCase.diagnosis}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-stone-400 block">Sessões:</span>
                <span className="font-semibold text-amber-800 font-mono text-sm">
                  {selectedCase.sessionsCount} sessão(ões)
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-amber-50/40 p-4 rounded-xl border border-amber-200/60">
              {selectedCase.description}
            </p>

            {/* Testimonial Quote */}
            {selectedCase.testimonial && (
              <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl border border-stone-800 relative shadow-sm space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Depoimento Real Verificado</span>
                </div>
                <p className="text-xs sm:text-sm italic text-stone-200 leading-relaxed">
                  "{selectedCase.testimonial.quote}"
                </p>
                <div className="text-[11px] text-amber-300 font-medium pt-1">
                  — {selectedCase.testimonial.author}
                </div>
              </div>
            )}

            {/* Key Clinical Takeaways */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider block">
                Pontos Clínicos de Destaque:
              </span>
              <ul className="space-y-1 text-xs text-stone-700">
                {selectedCase.keyTakeaways.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button to Leave a Review */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-medium text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>
                  {showReviewForm
                    ? 'Fechar Formulário de Avaliação'
                    : 'Avaliar este Procedimento (1 a 5 estrelas)'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 1 TO 5 STARS RATING & COMMENT SYSTEM */}
        <div className="pt-6 border-t border-stone-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-700" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Avaliações & Comentários de Pacientes
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Média geral de <strong>{currentAverage.toFixed(1)} estrelas</strong> baseada em {currentCount} opiniões verificadas.
              </p>
            </div>

            {!showReviewForm && (
              <button
                type="button"
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Deixar Minha Avaliação</span>
              </button>
            )}
          </div>

          {/* Feedback Success Notification */}
          {reviewSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 animate-fadeIn font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{reviewSuccessMsg}</span>
            </div>
          )}

          {/* Interactive Rating Form */}
          {showReviewForm && (
            <form
              onSubmit={handleSubmitReview}
              className="bg-stone-50 rounded-2xl p-6 border border-amber-200 space-y-4 animate-fadeIn"
            >
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <h4 className="font-serif text-base font-bold text-stone-900">
                  Avaliar o Atendimento: {selectedCase.title}
                </h4>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Star Rating Picker (1 to 5 Stars with hover & click) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Sua Nota de 1 a 5 Estrelas *
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isActive = (hoverRating || userRating) >= starValue;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setUserRating(starValue)}
                          className="p-1 hover:scale-110 transition-transform focus:outline-none"
                          aria-label={`Avaliar com ${starValue} estrelas`}
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              isActive
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-stone-300 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-medium text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-lg">
                    {starLabels[hoverRating || userRating]}
                  </span>
                </div>
                {reviewErrors.rating && (
                  <p className="text-xs text-red-600">{reviewErrors.rating}</p>
                )}
              </div>

              {/* Author Name */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Seu Nome ou Iniciais *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mariana R. ou Paciente de Melasma"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                  />
                </div>
                {reviewErrors.author && (
                  <p className="text-xs text-red-600">{reviewErrors.author}</p>
                )}
              </div>

              {/* Comment text */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Seu Comentário / Relato do Resultado *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Conte como foi sua experiência com este procedimento, tempo de recuperação e evolução da sua pele..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
                {reviewErrors.comment && (
                  <p className="text-xs text-red-600">{reviewErrors.comment}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 hover:bg-stone-100 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Avaliação</span>
                </button>
              </div>
            </form>
          )}

          {/* Reviews List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="bg-stone-50 rounded-2xl p-5 border border-stone-200/90 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= rev.rating ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">
                      {rev.date}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px]">
                  <span className="font-semibold text-stone-900">
                    {rev.author}
                  </span>
                  {rev.verifiedPatient && (
                    <span className="text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Paciente Verificado
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO MODAL PLAYER */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 text-stone-100 rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-stone-800 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-400" />
                <h3 className="font-serif text-lg font-medium text-white">
                  Vídeo Clínico: {activeVideoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* HTML5 Video element with real controls */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black flex items-center justify-center">
              <video
                controls
                autoPlay
                playsInline
                src={activeVideoModal.videoUrl}
                poster={activeVideoModal.videoThumbnail}
                className="w-full h-full object-cover"
              >
                Seu navegador não suporta a reprodução de vídeo HTML5.
              </video>
            </div>

            <div className="text-xs text-stone-400 flex items-center justify-between">
              <span>Procedimento executado pela Dra. Isabella Rossi (CRM-SP 184.920)</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Imagens autorizadas para fins informativos
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
