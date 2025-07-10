// Configuration Stripe
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key';

export const getStripe = async () => {
  const { loadStripe } = await import('@stripe/stripe-js');
  return loadStripe(stripePublishableKey);
};

// Types pour les paiements
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface ServicePrice {
  id: string;
  name: string;
  price: number;
  description: string;
  duration: string;
  category: string;
}

// Prix des services (en FCFA)
export const servicePrices: ServicePrice[] = [
  {
    id: 'diagnostic',
    name: 'Diagnostic électronique',
    price: 15000,
    description: 'Diagnostic complet avec valise professionnelle',
    duration: '15-45 minutes',
    category: 'diagnostic'
  },
  {
    id: 'vidange',
    name: 'Vidange + Entretien',
    price: 35000,
    description: 'Vidange complète avec filtres et vérifications',
    duration: '45 minutes',
    category: 'entretien'
  },
  {
    id: 'freinage',
    name: 'Système de freinage',
    price: 45000,
    description: 'Contrôle et réparation système de freinage',
    duration: '90 minutes',
    category: 'securite'
  },
  {
    id: 'climatisation',
    name: 'Climatisation',
    price: 25000,
    description: 'Entretien et réparation climatisation',
    duration: '60-90 minutes',
    category: 'confort'
  },
  {
    id: 'pneus',
    name: 'Pneus + Géométrie',
    price: 15000,
    description: 'Montage, équilibrage et géométrie',
    duration: '60 minutes',
    category: 'securite'
  },
  {
    id: 'reparation',
    name: 'Réparation mécanique',
    price: 0, // Prix sur devis
    description: 'Réparations mécaniques diverses',
    duration: 'Variable',
    category: 'reparation'
  },
  {
    id: 'revision',
    name: 'Révision complète',
    price: 75000,
    description: 'Révision selon carnet constructeur',
    duration: '2 heures',
    category: 'entretien'
  },
  {
    id: 'autre',
    name: 'Autre service',
    price: 0, // Prix sur devis
    description: 'Service personnalisé selon vos besoins',
    duration: 'Variable',
    category: 'autre'
  }
];

export const getServicePrice = (serviceId: string): ServicePrice | null => {
  return servicePrices.find(service => service.id === serviceId) || null;
}