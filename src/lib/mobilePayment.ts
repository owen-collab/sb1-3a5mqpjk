// Configuration des paiements mobiles pour le Cameroun
export interface MobilePaymentProvider {
  id: string;
  name: string;
  logo: string;
  color: string;
  apiEndpoint: string;
  supportedCurrencies: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
}

export const mobilePaymentProviders: MobilePaymentProvider[] = [
  {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    logo: '🟡',
    color: 'bg-yellow-500',
    apiEndpoint: 'https://sandbox.momodeveloper.mtn.com',
    supportedCurrencies: ['XAF'],
    fees: {
      percentage: 1.5,
      fixed: 100
    }
  },
  {
    id: 'orange_money',
    name: 'Orange Money',
    logo: '🟠',
    color: 'bg-orange-500',
    apiEndpoint: 'https://api.orange.com/orange-money-webpay',
    supportedCurrencies: ['XAF'],
    fees: {
      percentage: 1.8,
      fixed: 150
    }
  }
];

export interface MobilePaymentRequest {
  amount: number;
  currency: string;
  phoneNumber: string;
  provider: string;
  description: string;
  customerInfo: {
    nom: string;
    telephone: string;
    email?: string;
  };
  metadata?: Record<string, any>;
}

export interface MobilePaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  message: string;
  fees?: {
    amount: number;
    description: string;
  };
}

// Simulation des APIs de paiement mobile (à remplacer par les vraies APIs)
export class MobilePaymentService {
  private static instance: MobilePaymentService;
  
  static getInstance(): MobilePaymentService {
    if (!MobilePaymentService.instance) {
      MobilePaymentService.instance = new MobilePaymentService();
    }
    return MobilePaymentService.instance;
  }

  async initiateMTNPayment(request: MobilePaymentRequest): Promise<MobilePaymentResponse> {
    console.log('🟡 Initiation paiement MTN Mobile Money:', request);
    
    try {
      // Validation du numéro MTN (commence par 67, 68, 65, 66)
      const mtnPrefixes = ['67', '68', '65', '66'];
      const phoneDigits = request.phoneNumber.replace(/\D/g, '');
      const prefix = phoneDigits.slice(-9, -7); // Prendre les 2 chiffres après l'indicatif
      
      if (!mtnPrefixes.includes(prefix)) {
        return {
          success: false,
          status: 'failed',
          message: 'Numéro de téléphone non compatible avec MTN Mobile Money'
        };
      }

      // Calcul des frais
      const provider = mobilePaymentProviders.find(p => p.id === 'mtn_momo')!;
      const feeAmount = Math.round(request.amount * provider.fees.percentage / 100) + provider.fees.fixed;
      
      // Simulation de l'appel API MTN
      await this.simulateApiCall(2000);
      
      // Simulation d'une réponse réussie (85% de chance)
      const isSuccess = Math.random() > 0.15;
      
      if (isSuccess) {
        return {
          success: true,
          transactionId: `MTN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          message: 'Paiement initié avec succès. Veuillez confirmer sur votre téléphone.',
          fees: {
            amount: feeAmount,
            description: `Frais MTN Mobile Money: ${feeAmount} FCFA`
          }
        };
      } else {
        return {
          success: false,
          status: 'failed',
          message: 'Échec de l\'initiation du paiement. Vérifiez votre solde et réessayez.'
        };
      }
    } catch (error) {
      console.error('Erreur MTN Mobile Money:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Erreur technique lors du paiement MTN'
      };
    }
  }

  async initiateOrangePayment(request: MobilePaymentRequest): Promise<MobilePaymentResponse> {
    console.log('🟠 Initiation paiement Orange Money:', request);
    
    try {
      // Validation du numéro Orange (commence par 69, 65, 66)
      const orangePrefixes = ['69', '65', '66'];
      const phoneDigits = request.phoneNumber.replace(/\D/g, '');
      const prefix = phoneDigits.slice(-9, -7);
      
      if (!orangePrefixes.includes(prefix)) {
        return {
          success: false,
          status: 'failed',
          message: 'Numéro de téléphone non compatible avec Orange Money'
        };
      }

      // Calcul des frais
      const provider = mobilePaymentProviders.find(p => p.id === 'orange_money')!;
      const feeAmount = Math.round(request.amount * provider.fees.percentage / 100) + provider.fees.fixed;
      
      // Simulation de l'appel API Orange
      await this.simulateApiCall(2500);
      
      // Simulation d'une réponse réussie (80% de chance)
      const isSuccess = Math.random() > 0.20;
      
      if (isSuccess) {
        return {
          success: true,
          transactionId: `ORG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          message: 'Paiement initié avec succès. Confirmez avec votre code Orange Money.',
          fees: {
            amount: feeAmount,
            description: `Frais Orange Money: ${feeAmount} FCFA`
          }
        };
      } else {
        return {
          success: false,
          status: 'failed',
          message: 'Échec de l\'initiation du paiement. Vérifiez votre compte Orange Money.'
        };
      }
    } catch (error) {
      console.error('Erreur Orange Money:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Erreur technique lors du paiement Orange Money'
      };
    }
  }

  async checkPaymentStatus(transactionId: string): Promise<MobilePaymentResponse> {
    console.log('🔍 Vérification statut paiement:', transactionId);
    
    try {
      // Simulation de vérification de statut
      await this.simulateApiCall(1000);
      
      // Simulation de différents statuts
      const statuses = ['success', 'pending', 'failed'] as const;
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      return {
        success: randomStatus !== 'failed',
        transactionId,
        status: randomStatus,
        message: this.getStatusMessage(randomStatus)
      };
    } catch (error) {
      return {
        success: false,
        transactionId,
        status: 'failed',
        message: 'Erreur lors de la vérification du statut'
      };
    }
  }

  private async simulateApiCall(delay: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private getStatusMessage(status: string): string {
    switch (status) {
      case 'success':
        return 'Paiement confirmé avec succès !';
      case 'pending':
        return 'Paiement en attente de confirmation...';
      case 'failed':
        return 'Paiement échoué. Veuillez réessayer.';
      case 'cancelled':
        return 'Paiement annulé par l\'utilisateur.';
      default:
        return 'Statut inconnu';
    }
  }

  // Méthode principale pour initier un paiement
  async initiatePayment(request: MobilePaymentRequest): Promise<MobilePaymentResponse> {
    switch (request.provider) {
      case 'mtn_momo':
        return this.initiateMTNPayment(request);
      case 'orange_money':
        return this.initiateOrangePayment(request);
      default:
        return {
          success: false,
          status: 'failed',
          message: 'Fournisseur de paiement non supporté'
        };
    }
  }

  // Utilitaires
  getProviderByPhone(phoneNumber: string): MobilePaymentProvider | null {
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    const prefix = phoneDigits.slice(-9, -7);
    
    // MTN: 67, 68, 65, 66
    if (['67', '68', '65', '66'].includes(prefix)) {
      return mobilePaymentProviders.find(p => p.id === 'mtn_momo') || null;
    }
    
    // Orange: 69, 65, 66 (65, 66 peuvent être les deux)
    if (['69'].includes(prefix)) {
      return mobilePaymentProviders.find(p => p.id === 'orange_money') || null;
    }
    
    return null;
  }

  calculateFees(amount: number, providerId: string): number {
    const provider = mobilePaymentProviders.find(p => p.id === providerId);
    if (!provider) return 0;
    
    return Math.round(amount * provider.fees.percentage / 100) + provider.fees.fixed;
  }

  formatPhoneNumber(phone: string): string {
    // Nettoyer et formater le numéro
    const cleaned = phone.replace(/\D/g, '');
    
    // Si commence par 237, garder tel quel
    if (cleaned.startsWith('237')) {
      return `+${cleaned}`;
    }
    
    // Si commence par 6, ajouter 237
    if (cleaned.startsWith('6') && cleaned.length === 9) {
      return `+237${cleaned}`;
    }
    
    return phone; // Retourner tel quel si format non reconnu
  }
}

// Export de l'instance singleton
export const mobilePayment = MobilePaymentService.getInstance();