'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService, Paper } from '../../../api';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Appartement' },
  { value: 'villa', label: 'Villa' },
  { value: 'studio', label: 'Studio' },
  { value: 'house', label: 'Maison' },
  { value: 'land', label: 'Terrain' },
  { value: 'commercial', label: 'Commercial' }
];

type PropertyRequestFormProps = {
  defaultType?: string;
  defaultWilaya?: string;
};

export default function PropertyRequestForm({ defaultType = '', defaultWilaya = '' }: PropertyRequestFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyType, setPropertyType] = useState(defaultType);
  const [wilaya, setWilaya] = useState(defaultWilaya);
  const [propertyIntention, setPropertyIntention] = useState<'sell' | 'rent'>('sell');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [want360, setWant360] = useState(true);
  const [selectedPapiers, setSelectedPapiers] = useState<string[]>([]);
  const [sendMode, setSendMode] = useState<'email' | 'whatsapp'>('email');

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const papersData = await apiService.getPapers();
        setPapers(papersData);
      } catch (error) {
        console.error('Failed to fetch papers:', error);
        setPapers([
          { id: '1', name: 'Décision', createdAt: '', updatedAt: '' },
          { id: '2', name: 'Promotion immobilière', createdAt: '', updatedAt: '' },
          { id: '3', name: 'Acte notarié', createdAt: '', updatedAt: '' },
          { id: '4', name: "Acte dans l'indivision", createdAt: '', updatedAt: '' },
          { id: '5', name: 'Papier timbré', createdAt: '', updatedAt: '' },
          { id: '6', name: 'Livret foncier', createdAt: '', updatedAt: '' },
          { id: '7', name: 'Permis de construire', createdAt: '', updatedAt: '' }
        ]);
      }
    };
    fetchPapers();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...fileArray]);
    }
  };

  const removeImage = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

  const handlePapierToggle = (papier: string) => {
    setSelectedPapiers(prev =>
      prev.includes(papier)
        ? prev.filter(p => p !== papier)
        : [...prev, papier]
    );
  };

  const validateStep = (step: number): boolean => {
    setError(null);
    
    if (step === 1) {
      if (!name || !phone || !email) {
        setError('Veuillez remplir tous les champs requis.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Veuillez entrer une adresse email valide.');
        return false;
      }
    }
    
    if (step === 2) {
      if (!propertyType) {
        setError('Veuillez sélectionner le type de bien.');
        return false;
      }
      if (!wilaya) {
        setError('Veuillez sélectionner la wilaya.');
        return false;
      }
    }
    
    if (step === 3) {
      if (!description || description.trim().length < 10) {
        setError('Veuillez fournir une description d\'au moins 10 caractères.');
        return false;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      if (!propertyType) {
        setError('Veuillez sélectionner le type de bien.');
        setIsSubmitting(false);
        return;
      }
      if (!wilaya) {
        setError('Veuillez sélectionner la wilaya.');
        setIsSubmitting(false);
        return;
      }

      let message = description;
      if (want360) message += '\nSouhaite visite virtuelle 360°';
      if (selectedPapiers.length > 0) message += `\nPapiers disponibles: ${selectedPapiers.join(', ')}`;

      const demandeData = {
        name,
        email,
        phone,
        propertyType,
        propertyLocation: wilaya,
        propertyIntention,
        message,
        whatsappContact: sendMode === 'whatsapp',
        emailContact: sendMode === 'email',
      };

      // Save demande with images if any
      if (images.length > 0) {
        await apiService.createDemandeWithImages(demandeData, images);
      } else {
        await apiService.createDemande(demandeData);
      }

      // Build query params for thank you page
      const queryParams = new URLSearchParams({
        name: name || '',
        propertyType: propertyType || '',
        wilaya: wilaya || '',
        intention: propertyIntention,
        want360: want360.toString(),
        sendMode: sendMode
      });

      if (sendMode === 'whatsapp') {
        const body = encodeURIComponent(
          `Bonjour, je souhaite mettre mon bien en ligne.\n` +
          `Nom: ${name}\nTéléphone: ${phone}\nEmail: ${email}\n` +
          `Type de bien: ${propertyType}\nLocalisation: ${wilaya}\n` +
          `Intention: ${propertyIntention === 'sell' ? 'Vendre' : 'Louer'}\n` +
          `${want360 ? 'Souhaite une visite 360°.\n' : ''}` +
          `${selectedPapiers.length > 0 ? `Papiers: ${selectedPapiers.join(', ')}` : ''}\n` +
          `Message: ${description}`
        );
        const phoneNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '213561278961').replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${phoneNumber}?text=${body}`, '_blank');
      }

      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setPropertyType('');
      setWilaya('');
      setPropertyIntention('sell');
      setDescription('');
      setImages([]);
      setWant360(true);
      setSelectedPapiers([]);

      // Redirect to thank you page
      router.push(`/vendre-louer/merci?${queryParams.toString()}`);
    } catch (err) {
      console.error('Error sending demande:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'envoi de la demande';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <section className="min-h-screen bg-slate-50 py-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-6 md:p-12">
        <h3 className="text-3xl font-bold text-center text-slate-800 mb-4">
          Mettre mon bien en ligne
        </h3>

        {/* Progress Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[
              { num: 1, label: 'Vos coordonnées' },
              { num: 2, label: 'Informations bien' },
              { num: 3, label: 'Documents & Description' }
            ].map((step, index) => (
              <div key={step.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    currentStep >= step.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.num}
                  </div>
                  <span className={`text-xs md:text-sm mt-2 text-center ${
                    currentStep >= step.num ? 'text-emerald-600 font-semibold' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    currentStep > step.num ? 'bg-emerald-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          {/* Step 1: Contact Details */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h4 className="text-2xl font-semibold text-slate-700 mb-6 text-center">Vos coordonnées</h4>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                  <input
                    type="text"
                    placeholder="Ex: Ahmed Ben Ali"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    placeholder="Ex: 0561 27 89 61"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    placeholder="Ex: votreemail@exemple.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property Information */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h4 className="text-2xl font-semibold text-slate-700 mb-6 text-center">Informations sur votre bien</h4>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de bien *</label>
                  <select
                    required
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Sélectionnez le type</option>
                    {PROPERTY_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wilaya *</label>
                  <select
                    required
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Sélectionnez la wilaya</option>
                    <option value="Adrar">01 - Adrar</option>
                    <option value="Chlef">02 - Chlef</option>
                    <option value="Laghouat">03 - Laghouat</option>
                    <option value="Oum El Bouaghi">04 - Oum El Bouaghi</option>
                    <option value="Batna">05 - Batna</option>
                    <option value="Béjaïa">06 - Béjaïa</option>
                    <option value="Biskra">07 - Biskra</option>
                    <option value="Béchar">08 - Béchar</option>
                    <option value="Blida">09 - Blida</option>
                    <option value="Bouira">10 - Bouira</option>
                    <option value="Tamanrasset">11 - Tamanrasset</option>
                    <option value="Tébessa">12 - Tébessa</option>
                    <option value="Tlemcen">13 - Tlemcen</option>
                    <option value="Tiaret">14 - Tiaret</option>
                    <option value="Tizi Ouzou">15 - Tizi Ouzou</option>
                    <option value="Alger">16 - Alger</option>
                    <option value="Djelfa">17 - Djelfa</option>
                    <option value="Jijel">18 - Jijel</option>
                    <option value="Sétif">19 - Sétif</option>
                    <option value="Saïda">20 - Saïda</option>
                    <option value="Skikda">21 - Skikda</option>
                    <option value="Sidi Bel Abbès">22 - Sidi Bel Abbès</option>
                    <option value="Annaba">23 - Annaba</option>
                    <option value="Guelma">24 - Guelma</option>
                    <option value="Constantine">25 - Constantine</option>
                    <option value="Médéa">26 - Médéa</option>
                    <option value="Mostaganem">27 - Mostaganem</option>
                    <option value="M'Sila">28 - M'Sila</option>
                    <option value="Mascara">29 - Mascara</option>
                    <option value="Ouargla">30 - Ouargla</option>
                    <option value="Oran">31 - Oran</option>
                    <option value="El Bayadh">32 - El Bayadh</option>
                    <option value="Illizi">33 - Illizi</option>
                    <option value="Bordj Bou Arreridj">34 - Bordj Bou Arreridj</option>
                    <option value="Boumerdès">35 - Boumerdès</option>
                    <option value="El Tarf">36 - El Tarf</option>
                    <option value="Tindouf">37 - Tindouf</option>
                    <option value="Tissemsilt">38 - Tissemsilt</option>
                    <option value="El Oued">39 - El Oued</option>
                    <option value="Khenchela">40 - Khenchela</option>
                    <option value="Souk Ahras">41 - Souk Ahras</option>
                    <option value="Tipaza">42 - Tipaza</option>
                    <option value="Mila">43 - Mila</option>
                    <option value="Aïn Defla">44 - Aïn Defla</option>
                    <option value="Naâma">45 - Naâma</option>
                    <option value="Aïn Témouchent">46 - Aïn Témouchent</option>
                    <option value="Ghardaïa">47 - Ghardaïa</option>
                    <option value="Relizane">48 - Relizane</option>
                    <option value="Timimoun">49 - Timimoun</option>
                    <option value="Bordj Badji Mokhtar">50 - Bordj Badji Mokhtar</option>
                    <option value="Ouled Djellal">51 - Ouled Djellal</option>
                    <option value="Béni Abbès">52 - Béni Abbès</option>
                    <option value="In Salah">53 - In Salah</option>
                    <option value="In Guezzam">54 - In Guezzam</option>
                    <option value="Touggourt">55 - Touggourt</option>
                    <option value="Djanet">56 - Djanet</option>
                    <option value="El M'Ghair">57 - El M'Ghair</option>
                    <option value="El Meniaa">58 - El Meniaa</option>
                    <option value="Aflou">59 - Aflou</option>
                    <option value="El Abiodh Sidi Cheikh">60 - El Abiodh Sidi Cheikh</option>
                    <option value="El Aricha">61 - El Aricha</option>
                    <option value="El Kantara">62 - El Kantara</option>
                    <option value="Barika">63 - Barika</option>
                    <option value="Bou Saâda">64 - Bou Saâda</option>
                    <option value="Bir El Ater">65 - Bir El Ater</option>
                    <option value="Ksar El Boukhari">66 - Ksar El Boukhari</option>
                    <option value="Ksar Chellala">67 - Ksar Chellala</option>
                    <option value="Aïn Oussara">68 - Aïn Oussara</option>
                    <option value="Messaad">69 - Messaad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photos de votre bien (optionnel)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-sm text-gray-500 mt-2">Maximum 10 images</p>
                </div>
              </div>

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-6">
                  <h5 className="text-lg font-semibold text-slate-700 mb-3">
                    Images sélectionnées ({images.length}/10)
                  </h5>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Documents & Description */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h4 className="text-2xl font-semibold text-slate-700 mb-6 text-center">Documents et Description</h4>
              
              {/* Legal Documents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Documents légaux disponibles (optionnel)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {papers.map((paper) => (
                    <label
                      key={paper.id}
                      className="flex items-center p-3 border border-gray-300 rounded-lg hover:border-emerald-400 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPapiers.includes(paper.name)}
                        onChange={() => handlePapierToggle(paper.name)}
                        className="mr-3 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-gray-700 text-sm">{paper.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description de votre bien *
                </label>
                <textarea
                  placeholder="Décrivez votre bien : surface, nombre de pièces, prix souhaité, adresse exacte, état du bien, etc..."
                  rows={5}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-sm text-gray-500 mt-1">Minimum 10 caractères</p>
              </div>

              {/* 360 Tour */}
              <div className="flex items-start p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={want360}
                    onChange={(e) => setWant360(e.target.checked)}
                    className="mt-1 mr-3 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-gray-800 font-medium">
                      Je souhaite une visite virtuelle 360° professionnelle
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Augmentez vos chances de vente avec une visite virtuelle immersive
                    </p>
                  </div>
                </label>
              </div>

              {/* Send Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Mode de contact préféré
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className="flex-1 flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-emerald-400" style={{
                    borderColor: sendMode === 'email' ? '#10b981' : '#d1d5db',
                    backgroundColor: sendMode === 'email' ? '#f0fdf4' : 'white'
                  }}>
                    <input
                      type="radio"
                      name="sendMode"
                      checked={sendMode === 'email'}
                      onChange={() => setSendMode('email')}
                      className="mr-3 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-medium text-gray-800 flex items-center">
                        <i className="fas fa-envelope mr-2 text-emerald-600"></i>
                        Email
                      </span>
                    </div>
                  </label>
                  <label className="flex-1 flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-emerald-400" style={{
                    borderColor: sendMode === 'whatsapp' ? '#10b981' : '#d1d5db',
                    backgroundColor: sendMode === 'whatsapp' ? '#f0fdf4' : 'white'
                  }}>
                    <input
                      type="radio"
                      name="sendMode"
                      checked={sendMode === 'whatsapp'}
                      onChange={() => setSendMode('whatsapp')}
                      className="mr-3 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-medium text-gray-800 flex items-center">
                        <i className="fab fa-whatsapp mr-2 text-emerald-600"></i>
                        WhatsApp
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-10 flex gap-4">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Précédent
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-emerald-500 text-white py-4 rounded-xl font-semibold shadow-md hover:bg-emerald-600 transition-all flex items-center justify-center group"
              >
                Suivant
                <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-500 text-white py-4 rounded-xl font-semibold shadow-md hover:bg-emerald-600 transition-all flex items-center justify-center group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    Envoyer ma demande
                    <i className="fas fa-paper-plane ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            En soumettant ce formulaire, vous acceptez d'être contacté par nos équipes.<br />
            Aucun engagement financier à cette étape.
          </p>
        </form>
      </div>
    </section>
  );
}
