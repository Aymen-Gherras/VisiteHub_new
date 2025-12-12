'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Send } from 'lucide-react';

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const phoneNumber = '213561278961';
  const defaultMessage = 'Bonjour ! Je suis intéressé par vos services immobiliers 360°. Pouvez-vous m\'en dire plus ?';

  const handleSendMessage = () => {
    const finalMessage = message.trim() || defaultMessage;
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="bg-emerald-500 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">WhatsApp</h3>
              <p className="text-xs text-emerald-100">Répondez généralement en quelques minutes</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-emerald-600 p-1 rounded transition-colors"
              aria-label="Fermer le chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Message Area */}
          <div className="p-4 bg-gray-50 min-h-32 flex flex-col">
            <p className="text-sm text-gray-700 mb-4">Bonjour 👋 Écrivez votre message ou utilisez le message par défaut:</p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={defaultMessage}
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              rows={4}
            />
          </div>

          {/* Footer with Send Button */}
          <div className="bg-white border-t border-gray-200 p-4 flex gap-2">
            <button
              onClick={handleSendMessage}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send size={18} />
              Envoyer
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-110 animate-pulse flex items-center justify-center"
        aria-label="Contactez-nous sur WhatsApp"
        title="Cliquez pour ouvrir le chat"
      >
        <Image
          src="/Asset 1.png"
          alt="WhatsApp"
          width={24}
          height={24}
          className="w-6 h-6 object-contain"
          unoptimized
        />
      </button>
    </>
  );
};

export { WhatsAppButton };