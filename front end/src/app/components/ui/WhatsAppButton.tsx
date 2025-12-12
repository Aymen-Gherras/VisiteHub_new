'use client';

import React, { useState } from 'react';
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
          <div className="bg-green-500 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">WhatsApp</h3>
              <p className="text-xs text-green-100">Répondez généralement en quelques minutes</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-green-600 p-1 rounded transition-colors"
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
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              rows={4}
            />
          </div>

          {/* Footer with Send Button */}
          <div className="bg-white border-t border-gray-200 p-4 flex gap-2">
            <button
              onClick={handleSendMessage}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
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
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 animate-pulse"
        aria-label="Contactez-nous sur WhatsApp"
        title="Cliquez pour ouvrir le chat"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.54.92-2.846 2.318-3.56 3.992C2.38 10.921 2 12.442 2 13.989c0 1.547.38 3.068 1.007 4.42 1.005 2.407 3.079 4.482 5.486 5.487 1.352.627 2.873 1.007 4.42 1.007 1.547 0 3.068-.38 4.42-1.007 2.407-1.005 4.482-3.079 5.487-5.486.627-1.352 1.007-2.873 1.007-4.42 0-1.547-.38-3.068-1.007-4.42C19.98 6.79 17.905 4.715 15.498 3.71c-1.352-.627-2.873-1.007-4.42-1.007z" />
        </svg>
      </button>
    </>
  );
};

export { WhatsAppButton };