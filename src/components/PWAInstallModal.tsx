import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle2,
  Copy,
  ExternalLink,
  X,
  Sparkles,
  QrCode,
  Laptop,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleTriggerInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start pb-3 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-700 to-stone-900 text-amber-200 flex items-center justify-center shadow-md">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-700 block">
                Aplicativo Oficial PWA
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
                Como Baixar o Aplicativo
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status / Quick Action if Native Install is available */}
        {isInstallable && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Instalação Direta Disponível!</span>
            </div>
            <p className="text-xs text-stone-700">
              Seu navegador suporta a instalação imediata do aplicativo na tela inicial do seu celular ou computador sem precisar de loja de apps.
            </p>
            <button
              type="button"
              onClick={handleTriggerInstall}
              className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Instalar Aplicativo Agora</span>
            </button>
          </div>
        )}

        {/* Step-by-Step Instructions by Platform */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Passo a Passo por Dispositivo:
          </h4>

          {/* Android (Chrome) */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>No Android (Google Chrome ou Edge):</span>
            </div>
            <ol className="list-decimal list-inside text-xs text-stone-600 space-y-1">
              <li>Abra o link da clínica no Google Chrome.</li>
              <li>Toque no menu de <strong>3 pontinhos (⋮)</strong> no canto superior direito.</li>
              <li>Toque em <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
            </ol>
          </div>

          {/* iOS (iPhone / iPad) */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>No iPhone / iPad (Safari):</span>
            </div>
            <ol className="list-decimal list-inside text-xs text-stone-600 space-y-1">
              <li>Abra este site no navegador <strong>Safari</strong> da Apple.</li>
              <li>Toque no botão de <strong>Compartilhar</strong> (ícone do quadrado com a seta para cima <Share className="w-3.5 h-3.5 inline mx-0.5 text-stone-800" />).</li>
              <li>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-stone-800" />).</li>
              <li>Toque em <strong>"Adicionar"</strong> no canto superior direito.</li>
            </ol>
          </div>

          {/* Desktop Computer */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
              <Laptop className="w-4 h-4 text-purple-600" />
              <span>No Computador (Chrome, Edge ou Brave):</span>
            </div>
            <p className="text-xs text-stone-600">
              Clique no ícone de <strong>instalar app</strong> que aparece na barra de endereço do navegador (ao lado da estrela de favoritos) e confirme.
            </p>
          </div>
        </div>

        {/* Share / Copy Link Box */}
        <div className="space-y-2 pt-1 border-t border-stone-100">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
            Link Direto para Abrir no Celular:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-mono text-stone-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium shrink-0 flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium"
          >
            Entendi / Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
