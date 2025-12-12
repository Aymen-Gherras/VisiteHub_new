'use client';

import { useState, useEffect } from 'react';
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
  const { showToast } = useToast();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        showToast('Demande enregistrée. Ouverture de WhatsApp…', 'success');
      } else {
        showToast('Votre demande a été envoyée par email et enregistrée.', 'success');
      }

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
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-8 md:p-12">
        <h3 className="text-3xl font-bold text-center text-slate-800 mb-10">
          Mettre mon bien en ligne
        </h3>

        {error && (
          <div className="max-w-4xl mx-auto mb-4 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          {/* Coordinates + Property Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left */}
            <div>
              <h4 className="text-xl font-semibold text-slate-700 mb-4">Vos coordonnées</h4>
              <div className="space-y-4">
                <input type="text" placeholder="Nom complet *" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input type="tel" placeholder="Téléphone *" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input type="email" placeholder="Email *" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>

            {/* Right */}
            <div>
              <h4 className="text-xl font-semibold text-slate-700 mb-4">Informations sur votre bien</h4>
              <div className="space-y-4">
                {/* Type de bien */}
                <select
                  required
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Type de bien *</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <select 
                  required 
                  value={wilaya} 
                  onChange={(e) => setWilaya(e.target.value)} 
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
  <option value="">Wilaya *</option>
  <option value="Adrar">Adrar</option>
  <option value="Aïn Defla">Aïn Defla</option>
  <option value="Aïn Témouchent">Aïn Témouchent</option>
  <option value="Alger">Alger</option>
  <option value="Annaba">Annaba</option>
  <option value="Batna">Batna</option>
  <option value="Béchar">Béchar</option>
  <option value="Béjaïa">Béjaïa</option>
  <option value="Béni Abbès">Béni Abbès</option>
  <option value="Biskra">Biskra</option>
  <option value="Blida">Blida</option>
  <option value="Bordj Badji Mokhtar">Bordj Badji Mokhtar</option>
  <option value="Bordj Bou Arreridj">Bordj Bou Arreridj</option>
  <option value="Bouira">Bouira</option>
  <option value="Boumerdès">Boumerdès</option>
  <option value="Chlef">Chlef</option>
  <option value="Constantine">Constantine</option>
  <option value="Djanet">Djanet</option>
  <option value="Djelfa">Djelfa</option>
  <option value="El Bayadh">El Bayadh</option>
  <option value="El Meghaier">El Meghaier</option>
  <option value="El Menia">El Menia</option>
  <option value="El Oued">El Oued</option>
  <option value="El Tarf">El Tarf</option>
  <option value="Ghardaïa">Ghardaïa</option>
  <option value="Guelma">Guelma</option>
  <option value="Illizi">Illizi</option>
  <option value="In Guezzam">In Guezzam</option>
  <option value="In Salah">In Salah</option>
  <option value="Jijel">Jijel</option>
  <option value="Khenchela">Khenchela</option>
  <option value="Laghouat">Laghouat</option>
  <option value="M'Sila">M'Sila</option>
  <option value="Mascara">Mascara</option>
  <option value="Médéa">Médéa</option>
  <option value="Mila">Mila</option>
  <option value="Mostaganem">Mostaganem</option>
  <option value="Naâma">Naâma</option>
  <option value="Oran">Oran</option>
  <option value="Ouargla">Ouargla</option>
  <option value="Ouled Djellal">Ouled Djellal</option>
  <option value="Oum El Bouaghi">Oum El Bouaghi</option>
  <option value="Relizane">Relizane</option>
  <option value="Saïda">Saïda</option>
  <option value="Sétif">Sétif</option>
  <option value="Sidi Bel Abbès">Sidi Bel Abbès</option>
  <option value="Skikda">Skikda</option>
  <option value="Souk Ahras">Souk Ahras</option>
  <option value="Tamanrasset">Tamanrasset</option>
  <option value="Tébessa">Tébessa</option>
  <option value="Tiaret">Tiaret</option>
  <option value="Timimoun">Timimoun</option>
  <option value="Tindouf">Tindouf</option>
  <option value="Tipaza">Tipaza</option>
  <option value="Tissemsilt">Tissemsilt</option>
  <option value="Tizi Ouzou">Tizi Ouzou</option>
  <option value="Tlemcen">Tlemcen</option>
  <option value="Touggourt">Touggourt</option>
</select>
                <div>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  <p className="text-sm text-gray-500 mt-1">Photos de votre bien (optionnel, max 10)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-slate-700 mb-3">Images sélectionnées ({images.length}/10)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {images.map((file, index) => (
                  <div key={index} className="relative">
                    <img src={URL.createObjectURL(file)} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                    <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Papers */}
          <div className="mt-10">
            <h4 className="text-xl font-semibold text-slate-700 mb-3">Documents légaux disponibles</h4>
            <p className="text-sm text-gray-500 mb-4">Sélectionnez les documents que vous possédez :</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers.map((paper) => (
                <label key={paper.id} className="flex items-center p-3 border border-gray-300 rounded-xl hover:border-emerald-400 cursor-pointer">
                  <input type="checkbox" checked={selectedPapiers.includes(paper.name)} onChange={() => handlePapierToggle(paper.name)} className="mr-3 rounded text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-gray-700 text-sm">{paper.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <textarea placeholder="Description de votre bien (surface, nombre de pièces, prix souhaité, adresse...)" rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          {/* Visit 360 */}
          <div className="mt-6 flex items-start">
            <label className="flex items-center">
              <input type="checkbox" checked={want360} onChange={(e) => setWant360(e.target.checked)} className="mr-3 rounded text-emerald-600 focus:ring-emerald-500" />
              <span className="text-gray-700">
                Je souhaite une visite virtuelle 360° professionnelle (4 000 DA - Offre de lancement)
              </span>
            </label>
          </div>

          {/* Mode d'envoi */}
          <div className="mt-8">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Mode d'envoi</h4>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="sendMode" checked={sendMode === 'email'} onChange={() => setSendMode('email')} className="text-emerald-600 focus:ring-emerald-500" />
                <span>Envoyer par email</span>
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="radio" name="sendMode" checked={sendMode === 'whatsapp'} onChange={() => setSendMode('whatsapp')} className="text-emerald-600 focus:ring-emerald-500" />
                <span>Envoyer par WhatsApp</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-emerald-500 text-white py-4 rounded-xl font-semibold shadow-md hover:bg-emerald-600 transition-all flex items-center justify-center group disabled:opacity-60">
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
