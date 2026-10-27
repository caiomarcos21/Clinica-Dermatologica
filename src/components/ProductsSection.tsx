import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Search,
  CheckCircle2,
  Info,
  X,
  ExternalLink,
  MessageCircle,
  FlaskConical,
  ShieldAlert,
} from 'lucide-react';
import { Product } from '../types/clinic';
import { formatBRL } from '../utils/clinic-logic';

interface ProductsSectionProps {
  products: Product[];
  onOrderProduct?: (product: Product) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ products }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [reservedSuccess, setReservedSuccess] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todos os Produtos' },
    { id: 'clareador', label: 'Clareamento & Melasma' },
    { id: 'anti-idade', label: 'Anti-Idade & Firmeza' },
    { id: 'acne', label: 'Acne & Oleosidade' },
    { id: 'fotoprotecao', label: 'Fotoproteção' },
    { id: 'hidratacao', label: 'Reparação & Barreira' },
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesCategory =
      selectedCategory === 'all' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.howItWorks.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReserveProduct = (prod: Product) => {
    // Generate pre-filled WhatsApp message for clinic desk
    const text = encodeURIComponent(
      `Olá Dra. Isabella Rossi e equipe! Gostaria de reservar o produto dermatológico "${prod.name}" (${formatBRL(
        prod.price
      )}) para retirada ou entrega.`
    );
    window.open(`https://wa.me/5511987654321?text=${text}`, '_blank');
    setReservedSuccess(prod.id);
    setTimeout(() => setReservedSuccess(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs sm:text-sm font-medium mb-3">
          <FlaskConical className="w-4 h-4 text-amber-700" />
          <span>Farmácia & Cosmecêuticos Médicos de Grau Dermatológico</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-stone-900 font-normal tracking-tight">
          Produtos Dermatológicos & Despigmentantes
        </h1>
        <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
          Fórmulas consagradas com comprovação científica rigorosa. Veja os preços e a descrição de funcionamento detalhada de cada ativo para a renovação celular da sua pele.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200 shadow-sm mb-10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Buscar por produto, marca ou função (ex: Dermamelan, Peeling)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-900 bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm"
            />
          </div>

          <span className="text-xs text-stone-500 font-medium">
            Exibindo <strong>{filteredProducts.length}</strong> formulações médicas
          </span>
        </div>

        {/* Categories Pills */}
        <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredProducts.map((product) => {
          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Product Image Header */}
              <div className="relative h-56 bg-stone-100 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  <span className="bg-stone-900/80 backdrop-blur-sm text-stone-100 text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {product.brand}
                  </span>
                  {product.featured && (
                    <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                      Destaque Clínico
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-white/95 backdrop-blur-sm text-stone-800 text-xs font-mono font-medium px-2 py-0.5 rounded shadow-sm">
                    {product.volume}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="text-[11px] font-medium text-amber-700 uppercase tracking-wider">
                    {product.categoryLabel}
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {product.name}
                  </h3>

                  {/* Como Funciona Highlight */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-1">
                    <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      Como Funciona & Ação:
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed italic">
                      "{product.shortDescription}"
                    </p>
                  </div>

                  {/* Active Ingredients Tags */}
                  <div className="pt-1">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">
                      Principais Ativos:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.activeIngredients.slice(0, 3).map((ing, i) => (
                        <span
                          key={i}
                          className="bg-stone-100 text-stone-700 text-[11px] px-2 py-0.5 rounded border border-stone-200"
                        >
                          {ing}
                        </span>
                      ))}
                      {product.activeIngredients.length > 3 && (
                        <span className="text-[10px] text-stone-400 self-center">
                          +{product.activeIngredients.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Price & Buttons */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block">
                      Preço Clínico
                    </span>
                    <span className="text-xl font-serif font-bold text-stone-900">
                      {formatBRL(product.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveProductModal(product)}
                      className="p-2.5 rounded-xl border border-stone-300 hover:border-stone-400 text-stone-700 hover:bg-stone-50 transition-colors"
                      title="Ver funcionamento completo e bula médica"
                    >
                      <Info className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReserveProduct(product)}
                      className="px-3.5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Reservar</span>
                    </button>
                  </div>
                </div>

                {reservedSuccess === product.id && (
                  <p className="text-xs text-emerald-600 font-medium text-center animate-pulse">
                    Redirecionando para recepção com pedido do produto...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED PRODUCT MECHANISM MODAL */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-start pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  {activeProductModal.brand} • {activeProductModal.categoryLabel}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-0.5">
                  {activeProductModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveProductModal(null)}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Price & Summary */}
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div>
                <span className="text-xs text-stone-500 block">Preço de Venda</span>
                <span className="font-serif text-2xl font-bold text-stone-900">
                  {formatBRL(activeProductModal.price)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500 block">Apresentação</span>
                <span className="font-mono text-sm font-semibold text-stone-800">
                  {activeProductModal.volume}
                </span>
              </div>
            </div>

            {/* Deep Mechanism Explanation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Como Funciona na Pele (Mecanismo de Ação):
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                {activeProductModal.howItWorks}
              </p>
            </div>

            {/* How to use */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-amber-600" />
                Modo de Uso Dermatológico Recomendado:
              </h4>
              <p className="text-sm text-stone-700 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">
                {activeProductModal.howToUse}
              </p>
            </div>

            {/* Active Ingredients list */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Composição Ativa & Concentrações Médicas:
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeProductModal.activeIngredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-medium rounded-lg border border-amber-200"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Medical safety notice */}
            <div className="text-xs text-stone-500 flex items-start gap-2 bg-stone-100 p-3.5 rounded-xl border border-stone-200">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Recomendamos sempre consulta prévia com a Dra. Isabella Rossi para avaliar o tipo de pele,
                grau do melasma ou acne antes de iniciar cosmecêuticos com ação de peeling.
              </span>
            </div>

            {/* Modal CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveProductModal(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-sm font-medium"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  handleReserveProduct(activeProductModal);
                  setActiveProductModal(null);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reservar Produto via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
