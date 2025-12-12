import React from 'react';
import { companyInfo } from '../../../data/data/mockCompany';

export const ContactMap = () => {
  return (
    <div className="h-[400px] w-full relative">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d960.721839325966!2d-0.6122698!3d35.7097883!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7e8971866cf2a7%3A0x4f2c9b040a0ee7bb!2sVisiteHub!5e1!3m2!1sen!2sdz!4v1762904023384!5m2!1sen!2sdz"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full"
      />
      {/* Link overlay */}
      <div className="absolute bottom-4 right-4">
        <a 
          href="https://maps.app.goo.gl/JRhtzij1GpBsApZ16" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-lg flex items-center gap-2"
        >
          <i className="fas fa-map-marker-alt"></i>
          <span>Ouvrir sur Google Maps</span>
        </a>
      </div>
    </div>
  );
};
