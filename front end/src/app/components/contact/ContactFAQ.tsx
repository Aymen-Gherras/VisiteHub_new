import React from 'react';

type FAQItem = {
  question: string;
  answer: string;
};

const faqItems: FAQItem[] = [
  {
    question: 'Comment fonctionne la visite virtuelle 360° ?',
    answer: 'Nos visites virtuelles 360° permettent d\'explorer chaque pièce de la propriété de manière interactive, comme si vous y étiez physiquement.'
  },
  {
    question: 'Combien coûte le service de visite virtuelle ?',
    answer: 'Le prix varie selon la taille et le type de propriété. Contactez-nous pour un devis personnalisé.'
  },
  {
    question: 'Dans quelles villes opérez-vous ?',
    answer: 'Nous opérons dans toutes les grandes villes d\'Algérie : Alger, Oran, Constantine, Annaba, et bien d\'autres.'
  },
  {
    question: 'Quel est le délai pour réaliser une visite virtuelle ?',
    answer: 'Le délai moyen est de 24 à 48 heures après la prise de rendez-vous, selon la disponibilité et la complexité du projet.'
  },
  {
    question: 'Comment puis-je partager une visite virtuelle ?',
    answer: 'Les visites virtuelles peuvent être facilement partagées via un lien unique, par email, SMS ou sur les réseaux sociaux.'
  }
];

export const ContactFAQ = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Questions fréquentes
        </h2>
        <div className="max-w-3xl mx-auto divide-y divide-gray-200">
          {faqItems.map((item, index) => (
            <details key={index} className="group py-4">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="text-lg font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                  {item.question}
                </span>
                <span className="ml-6 flex-shrink-0">
                  <i className="fas fa-chevron-down group-open:rotate-180 transition-transform duration-200"></i>
                </span>
              </summary>
              <div className="mt-3 text-gray-600 leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};