import React from 'react';

export const AboutMission = () => {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
               Comment tout a commencé
            </h2>
            <div className="space-y-5 text-base sm:text-lg text-gray-700 leading-relaxed">
              <p>
                Tout est parti d'un constat simple.
                Les photos classiques ne suffisaient plus à raconter l'histoire d'un lieu. Elles étaient plates, figées, incapables de transmettre l'émotion et l'atmosphère réelle.
              </p>
              <p>
                Et surtout : chercher un appartement ou un bien immobilier était devenu un parcours du combattant.
              </p>
              <p>
                Les clients perdaient des heures à se déplacer pour visiter des biens qui ne correspondaient pas à leurs attentes.
              </p>
              <p>
                Les propriétaires devaient sans cesse ouvrir leurs portes à des inconnus, parfois de simples curieux, sans réelle intention d'acheter ou de louer.
              </p>
              <p>
                Un processus frustrant, chronophage et peu sécurisé.
              </p>
              <p>
                Nous avons décidé de transformer ce problème en une opportunité : créer une solution immersive, simple et accessible, qui permet de visiter n'importe quel espace comme si vous y étiez.
              </p>
              <p className="font-semibold text-emerald-700">
                De cette idée est née VisiteHub.
              </p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-lime-50 p-6 sm:p-8 rounded-2xl border border-emerald-100">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
               Notre Vision – Voir le monde autrement
            </h3>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              Notre vision est audacieuse : faire de l'Algérie et de l'Afrique du Nord des pionniers de l'expérience immersive.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Nous voulons que chaque entreprise, chaque agence immobilière, chaque hôtel, chaque musée, chaque usine puisse offrir à ses clients une visite virtuelle inoubliable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};