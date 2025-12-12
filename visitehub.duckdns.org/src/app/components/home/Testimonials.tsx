'use client';

import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ahmed B.",
      role: "Propriétaire",
      location: "Alger",
      content: "VisiteHub a révolutionné ma vente. J'ai vendu ma villa en 2 semaines au lieu de 6 mois. La visite 360° a attiré des acheteurs vraiment intéressés.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Fatima L.",
      role: "Acheteuse",
      location: "Oran",
      content: "J'ai visité 15 appartements en 360° avant de choisir. J'ai économisé des heures de transport et j'ai trouvé mon bien idéal du premier coup.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Karim M.",
      role: "Investisseur",
      location: "Constantine",
      content: "En tant qu'investisseur, je dois voir beaucoup de biens. VisiteHub me permet de faire un premier tri efficace avant de me déplacer.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
            Ce que disent nos clients
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages de propriétaires et acheteurs 
            qui ont transformé leur expérience immobilière avec VisiteHub.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <i key={i} className="fas fa-star text-yellow-400"></i>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 italic">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role} • {testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-emerald-500 mb-2">500+</div>
            <p className="text-gray-600">Biens vendus</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-500 mb-2">92%</div>
            <p className="text-gray-600">Satisfaction client</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-500 mb-2">48h</div>
            <p className="text-gray-600">Mise en ligne moyenne</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-500 mb-2">15+</div>
            <p className="text-gray-600">Plateformes partenaires</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Testimonials }; 