import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerSections = [
    {
      title: 'Services',
      links: [
        { href: '/vendre-louer', label: 'Vendre/Louer' },
        { href: '/properties', label: 'Propriétés 360°' },
        { href: '/contact', label: 'Estimation gratuite' },
        { href: '/about', label: 'Nos services' },
      ],
    },
    {
      title: 'Liens rapides',
      links: [
        { href: '/properties', label: 'Propriétés' },
        { href: '/about', label: 'À propos' },
        { href: '/contact', label: 'Contact' },
        { href: '/blog', label: 'Blog' },
      ],
    },
  ];
  
  return (
    <footer className="bg-slate-800 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
<img
  src="/logowhite.png"
  alt="VisiteHub logo"
  width={180}
  height={60}
  className="h-12 w-auto"
  
/>
            </div>
            <p className="text-gray-300 mb-6">
              L'agence immobilière nouvelle génération qui révolutionne la vente avec la technologie 360°.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://www.facebook.com/visitehub" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-emerald-400 transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a 
                href="https://www.instagram.com/visitehub" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-emerald-400 transition-colors"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a 
                href="https://www.linkedin.com/company/visitehub/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-emerald-400 transition-colors"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in text-xl"></i>
              </a>
              <a 
                href="https://www.tiktok.com/@visitehub" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-emerald-400 transition-colors"
                aria-label="TikTok"
              >
                <i className="fab fa-tiktok text-xl"></i>
              </a>
              <a 
                href="https://wa.me/213561278961" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-emerald-400 transition-colors"
                aria-label="WhatsApp"
              >
                <i className="fab fa-whatsapp text-xl"></i>
              </a>
            </div>
          </div>
          
          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-6 text-white">{section.title}</h4>
              <ul className="space-y-3 text-gray-300">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact</h4>
            <div className="space-y-3 text-gray-300">
              <a href="https://maps.app.goo.gl/JRhtzij1GpBsApZ16" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-emerald-400 transition-colors">
                <i className="fas fa-map-marker-alt mr-3 text-emerald-400"></i>
                <span>Oran, Algérie</span>
              </a>
              <div className="flex items-center">
                <i className="fas fa-phone mr-3 text-emerald-400"></i>
                <span>+213 561 278 961</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope mr-3 text-emerald-400"></i>
                <span>contact@visitehub.com</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-clock mr-3 text-emerald-400"></i>
                <span>Dim-Jeu: 9h-18h</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>
            &copy; {currentYear} VisiteHub. Tous droits réservés. 
            Révolutionnons l'immobilier ensemble.
          </p>
        </div>
      </div>
    </footer>
  );
};