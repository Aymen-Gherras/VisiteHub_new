'use client';

import React, { useState } from 'react';
import { apiService } from '../../api';
import { useToast } from '../components/ui/Toast';

export default function ContactPage() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const contactInfo = [
    {
      icon: <i className="fas fa-phone text-2xl"></i>,
      title: "Téléphone",
      value: "+213 561 278 961",
      link: "tel:+213561278961"
    },
    {
      icon: <i className="fas fa-envelope text-2xl"></i>,
      title: "Email",
      value: "contact@visitehub.com",
      link: "mailto:contact@visitehub.com"
    },
    {
      icon: <i className="fas fa-map-marker-alt text-2xl"></i>,
      title: "Adresse",
      value: "Oran, Algérie",
      link: "#"
    }
  ];

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await apiService.sendContactMessage({
        firstName,
        lastName,
        email,
        phone,
        subject: subject || 'Demande générale',
        message,
      });
      showToast('Votre message a été envoyé avec succès ! Nous vous répondrons sous 24h.', 'success');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch (error) {
      showToast('Erreur lors de l\'envoi. Veuillez réessayer.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vous avez des Questions ? Nous sommes là pour vous aider. 
            Contactez notre équipe et nous vous répondrons sous 24h.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Section - Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Envoyez-nous un message
            </h2>
            
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <select
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Choisissez un sujet</option>
                  <option value="Demande d'information">Demande d'information</option>
                  <option value="Demande de devis">Demande de devis</option>
                  <option value="Support technique">Support technique</option>
                  <option value="Partenariat">Partenariat</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Décrivez votre demande..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-500 text-white py-4 rounded-xl hover:bg-emerald-600 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le message'
                )}
              </button>
            </form>
          </div>

          {/* Right Section - Contact Details */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Nos coordonnées
              </h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-emerald-500 mr-4 mt-1">
                      {info.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">
                        {info.title}
                      </h4>
                      <a
                        href={info.link}
                        className="text-gray-600 hover:text-emerald-500 transition-colors"
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-slate-800 mb-4">
                Horaires d'ouverture
              </h4>
              <div className="space-y-2 text-gray-600">
                <div className="flex justify-between">
                  <span>Dimanche - Jeudi</span>
                  <span>9h00 - 17h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Samedi</span>
                  <span>9h00 - 16h00</span>
                </div>
                <div className="flex justify-between">
                  <span>Vendredi</span>
                  <span>Fermé</span>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-slate-800 mb-4">
                Suivez-nous
              </h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/visitehub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.instagram.com/visitehub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://www.linkedin.com/company/visitehub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a
                  href="https://wa.me/213561278961"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Notre localisation
          </h3>
          <div className="w-full">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d960.721839325966!2d-0.6122698!3d35.7097883!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7e8971866cf2a7%3A0x4f2c9b040a0ee7bb!2sVisiteHub!5e1!3m2!1sen!2sdz!4v1762904023384!5m2!1sen!2sdz" 
              width="100%" 
              height="450" 
              style={{border:0}} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>


    </div>
  );
}
