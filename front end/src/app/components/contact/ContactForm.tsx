'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';

type ContactFormProps = {
  initialValues?: { message?: string };
  recipientPhone?: string;
  recipientEmail?: string;
  onSuccess?: () => void;
};

export const ContactForm: React.FC<ContactFormProps> = ({ initialValues, recipientPhone, recipientEmail, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>(initialValues?.message || '');

  const handleEmail = () => {
    const to = recipientEmail || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@visitehub.com';
    const subject = 'Contact au sujet d\'une annonce';
    const body = encodeURIComponent(message || 'Bonjour, je suis intéressé par votre annonce.');
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (!message || message.trim().length === 0) {
        setError('Veuillez saisir un message.');
        return;
      }

      // Default behavior: try email
      handleEmail();

      onSuccess?.();
      alert('Votre message est prêt dans votre client email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Envoi échoué');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Contactez-nous</h2>
      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200 text-sm">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          ></textarea>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Préparation…' : 'Envoyer par Email'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const phone = (recipientPhone || '+213 561 278 961').replace(/\D/g, '');
              const text = encodeURIComponent(message || 'Bonjour, je suis intéressé par votre annonce.');
              window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
            }}
            className="flex-1"
          >
            WhatsApp
          </Button>
        </div>
      </form>
    </div>
  );
};