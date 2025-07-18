import React, { useState, useEffect } from 'react';
import { X, CreditCard, Shield, Clock, CheckCircle, AlertCircle, Loader2, Smartphone, Wifi, Phone, DollarSign, Info } from 'lucide-react';
import { getStripe, ServicePrice } from '../lib/stripe';
import { supabase, rendezVousService, paymentService } from '../lib/supabase';
import { mobilePayment, mobilePaymentProviders, MobilePaymentRequest } from '../lib/mobilePayment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServicePrice;
  customerInfo: {
    nom: string;
    telephone: string;
    email: string;
  };
  onPaymentSuccess: (paymentId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  service,
  customerInfo,
  onPaymentSuccess
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mtn_momo' | 'orange_money'>('card');
  const [mobilePhone, setMobilePhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [paymentStep, setPaymentStep] = useState<'method' | 'details' | 'confirmation' | 'processing'>('method');
  const [fees, setFees] = useState<{ amount: number; description: string } | null>(null);

  // Détecter automatiquement le fournisseur basé sur le numéro
  useEffect(() => {
    if (mobilePhone) {
      const provider = mobilePayment.getProviderByPhone(mobilePhone);
      if (provider) {
        setPaymentMethod(provider.id as 'mtn_momo' | 'orange_money');
        const feeAmount = mobilePayment.calculateFees(service.price, provider.id);
        setFees({
          amount: feeAmount,
          description: `Frais ${provider.name}: ${feeAmount} FCFA`
        });
      }
    }
  }, [mobilePhone, service.price]);

  // Simulation du processus de paiement (remplacez par l'intégration Stripe réelle)
  const handleCardPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // 1. Créer d'abord le rendez-vous
      const rendezVous = await rendezVousService.create({
        nom: customerInfo.nom,
        telephone: customerInfo.telephone,
        email: customerInfo.email,
        service: service.id,
        payment_status: 'pending'
      });

      // 2. Créer l'enregistrement de paiement
      const payment = await paymentService.create({
        rendezvous_id: rendezVous.id,
        amount: service.price,
        currency: 'XAF',
        status: 'pending',
        payment_method: 'card',
        metadata: {
          service_name: service.name,
          customer_info: customerInfo
        }
      });

      // 3. Simulation du traitement Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 4. Mettre à jour le statut du paiement
      await paymentService.update(payment.id, {
        status: 'succeeded',
        stripe_payment_id: `pay_${Date.now()}`
      });

      // 5. Mettre à jour le statut du rendez-vous
      await rendezVousService.update(rendezVous.id, {
        payment_status: 'paid',
        status: 'confirme'
      });

      setPaymentStatus('success');
      
      setTimeout(() => {
        onPaymentSuccess(payment.id);
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Erreur de paiement:', error);
      setPaymentStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMobilePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');
    setPaymentStep('processing');

    try {
      // 1. Créer le rendez-vous
      const rendezVous = await rendezVousService.create({
        nom: customerInfo.nom,
        telephone: customerInfo.telephone,
        email: customerInfo.email,
        service: service.id,
        payment_status: 'pending'
      });

      // 2. Préparer la requête de paiement mobile
      const paymentRequest: MobilePaymentRequest = {
        amount: service.price,
        currency: 'XAF',
        phoneNumber: mobilePayment.formatPhoneNumber(mobilePhone),
        provider: paymentMethod,
        description: `Paiement ${service.name} - IN AUTO`,
        customerInfo: customerInfo,
        metadata: {
          rendezvous_id: rendezVous.id,
          service_name: service.name
        }
      };

      // 3. Initier le paiement mobile
      const mobileResponse = await mobilePayment.initiatePayment(paymentRequest);
      
      if (!mobileResponse.success) {
        throw new Error(mobileResponse.message);
      }

      setTransactionId(mobileResponse.transactionId || '');
      
      // 4. Créer l'enregistrement de paiement
      const payment = await paymentService.create({
        rendezvous_id: rendezVous.id,
        amount: service.price,
        currency: 'XAF',
        status: 'pending',
        payment_method: 'mobile_money',
        stripe_payment_id: mobileResponse.transactionId,
        metadata: {
          provider: paymentMethod,
          phone_number: mobilePhone,
          customer_info: customerInfo,
          fees: mobileResponse.fees
        }
      });

      // 5. Attendre la confirmation (simulation)
      setPaymentStep('confirmation');
      
      // Simuler l'attente de confirmation utilisateur
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Vérifier le statut final
      const statusCheck = await mobilePayment.checkPaymentStatus(mobileResponse.transactionId || '');
      
      if (statusCheck.status === 'success') {
        // Mettre à jour le statut du paiement
        await paymentService.update(payment.id, {
          status: 'succeeded'
        });

        // Mettre à jour le statut du rendez-vous
        await rendezVousService.update(rendezVous.id, {
          payment_status: 'paid',
          status: 'confirme'
        });

        setPaymentStatus('success');
        
        setTimeout(() => {
          onPaymentSuccess(payment.id);
          onClose();
        }, 2000);
      } else {
        throw new Error(statusCheck.message);
      }

    } catch (error) {
      console.error('Erreur de paiement mobile:', error);
      setPaymentStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue lors du paiement mobile.');
      setPaymentStep('method');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'card') {
      return handleCardPayment();
    } else {
      return handleMobilePayment();
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setPaymentStep('method');
    setErrorMessage('');
    setTransactionId('');
    setFees(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-8 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Paiement Sécurisé</h3>
            <p className="text-gray-600">Finalisez votre réservation</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isProcessing}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Récapitulatif du service */}
          <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Récapitulatif de votre commande</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Service :</span>
                <span className="font-semibold">{service.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Description :</span>
                <span className="text-sm text-gray-600 text-right max-w-xs">{service.description}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Durée estimée :</span>
                <span className="text-gray-600">{service.duration}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Total :</span>
                <span className="text-2xl font-bold text-blue-600">
                  {service.price.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Informations client */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Informations client</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Nom :</span> {customerInfo.nom}</p>
              <p><span className="font-medium">Téléphone :</span> {customerInfo.telephone}</p>
              {customerInfo.email && (
                <p><span className="font-medium">Email :</span> {customerInfo.email}</p>
              )}
            </div>
          </div>

          {/* Méthodes de paiement */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Méthode de paiement</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">Carte bancaire</div>
                <div className="text-xs text-gray-500">Visa, Mastercard</div>
              </button>
              <button
                onClick={() => setPaymentMethod('mtn_momo')}
                className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                  paymentMethod === 'mtn_momo'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="h-8 w-8 mx-auto mb-2 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🟡</span>
                </div>
                <div className="text-sm font-medium">MTN Mobile Money</div>
                <div className="text-xs text-gray-500">67, 68, 65, 66</div>
              </button>
              <button
                onClick={() => setPaymentMethod('orange_money')}
                className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                  paymentMethod === 'orange_money'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="h-8 w-8 mx-auto mb-2 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🟠</span>
                </div>
                <div className="text-sm font-medium">Orange Money</div>
                <div className="text-xs text-gray-500">69, 65, 66</div>
              </button>
            </div>

            {/* Formulaire de paiement simulé */}
            <div className="bg-gray-50 rounded-2xl p-6">
              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isProcessing}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isProcessing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>
              ) : paymentMethod === 'mtn_momo' || paymentMethod === 'orange_money' ? (
                <div className="space-y-4">
                  {/* Informations sur le fournisseur */}
                  <div className={`p-4 rounded-lg border-2 ${
                    paymentMethod === 'mtn_momo' ? 'border-yellow-200 bg-yellow-50' : 'border-orange-200 bg-orange-50'
                  }`}>
                    <div className="flex items-center mb-2">
                      <Smartphone className="h-5 w-5 mr-2" />
                      <span className="font-semibold">
                        {paymentMethod === 'mtn_momo' ? 'MTN Mobile Money' : 'Orange Money'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Paiement sécurisé via votre compte mobile money
                    </p>
                    {fees && (
                      <div className="flex items-center text-sm">
                        <Info className="h-4 w-4 mr-1 text-blue-500" />
                        <span>{fees.description}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de téléphone
                    </label>
                    <input
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      value={mobilePhone || customerInfo.telephone}
                      onChange={(e) => setMobilePhone(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isProcessing}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Le numéro doit correspondre à votre compte {paymentMethod === 'mtn_momo' ? 'MTN Mobile Money' : 'Orange Money'}
                    </p>
                  </div>
                  
                  {/* Récapitulatif des frais */}
                  {fees && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-2">Récapitulatif des frais</h5>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Montant du service :</span>
                          <span>{service.price.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frais de transaction :</span>
                          <span>{fees.amount.toLocaleString()} FCFA</span>
                        </div>
                        <div className="border-t pt-1 flex justify-between font-semibold">
                          <span>Total à payer :</span>
                          <span>{(service.price + fees.amount).toLocaleString()} FCFA</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Instructions de paiement */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <Info className="h-4 w-4 mr-2" />
                      Instructions de paiement
                    </h5>
                    <ol className="text-sm text-blue-700 space-y-1">
                      <li>1. Vérifiez que votre numéro est correct</li>
                      <li>2. Assurez-vous d'avoir suffisamment de solde</li>
                      <li>3. Cliquez sur "Payer" pour initier la transaction</li>
                      <li>4. Confirmez le paiement sur votre téléphone</li>
                    </ol>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Étapes de paiement mobile */}
            {(paymentMethod === 'mtn_momo' || paymentMethod === 'orange_money') && paymentStep !== 'method' && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Progression du paiement</h4>
                  <button
                    onClick={resetPayment}
                    className="text-sm text-gray-500 hover:text-gray-700"
                    disabled={isProcessing}
                  >
                    Recommencer
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Étape 1: Initiation */}
                  <div className={`flex items-center p-4 rounded-lg ${
                    paymentStep === 'processing' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      paymentStep === 'processing' ? 'bg-blue-500 text-white' : 'bg-gray-300'
                    }`}>
                      {paymentStep === 'processing' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="text-sm font-bold">1</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">Initiation du paiement</div>
                      <div className="text-sm text-gray-600">
                        {paymentStep === 'processing' ? 'Connexion en cours...' : 'En attente'}
                      </div>
                    </div>
                  </div>

                  {/* Étape 2: Confirmation */}
                  <div className={`flex items-center p-4 rounded-lg ${
                    paymentStep === 'confirmation' ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                      paymentStep === 'confirmation' ? 'bg-yellow-500 text-white animate-pulse' : 'bg-gray-300'
                    }`}>
                      {paymentStep === 'confirmation' ? (
                        <Phone className="h-4 w-4" />
                      ) : (
                        <span className="text-sm font-bold">2</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">Confirmation sur votre téléphone</div>
                      <div className="text-sm text-gray-600">
                        {paymentStep === 'confirmation' 
                          ? 'Vérifiez votre téléphone et confirmez le paiement'
                          : 'En attente de l\'étape précédente'
                        }
                      </div>
                      {paymentStep === 'confirmation' && transactionId && (
                        <div className="text-xs text-gray-500 mt-1">
                          ID Transaction: {transactionId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Messages de statut */}
          {paymentStatus === 'processing' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-3" />
              <div className="flex-1">
                <span className="text-blue-700 font-medium">
                  {paymentMethod === 'card' 
                    ? 'Traitement du paiement par carte...'
                    : `Initiation du paiement ${paymentMethod === 'mtn_momo' ? 'MTN Mobile Money' : 'Orange Money'}...`
                  }
                </span>
                {(paymentMethod === 'mtn_momo' || paymentMethod === 'orange_money') && (
                  <div className="text-sm text-blue-600 mt-1">
                    Vous allez recevoir une notification sur votre téléphone
                  </div>
                )}
              </div>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <span className="text-green-700 font-medium">Paiement effectué avec succès ! 🎉</span>
                {transactionId && (
                  <div className="text-sm text-green-600 mt-1">
                    Transaction ID: {transactionId}
                  </div>
                )}
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
              <span className="text-red-700">{errorMessage}</span>
            </div>
          )}

          {/* Sécurité */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              <span>
                {paymentMethod === 'card' 
                  ? 'Paiement sécurisé SSL 256-bit • Vos données sont protégées'
                  : 'Paiement sécurisé via votre opérateur mobile • Aucune donnée bancaire stockée'
                }
              </span>
            </div>
            {(paymentMethod === 'mtn_momo' || paymentMethod === 'orange_money') && (
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <Wifi className="h-4 w-4 mr-2 text-blue-500" />
                <span>Connexion directe avec {paymentMethod === 'mtn_momo' ? 'MTN' : 'Orange'} • Authentification par PIN</span>
              </div>
            )}
          </div>

          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Annuler
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || paymentStatus === 'success' || 
                       ((paymentMethod === 'mtn_momo' || paymentMethod === 'orange_money') && !mobilePhone)}
              className={`flex-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center ${
                isProcessing || paymentStatus === 'success'
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-blue-600 to-red-500 hover:from-blue-700 hover:to-red-600 text-white transform hover:scale-105'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Traitement...
                </>
              ) : paymentStatus === 'success' ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Payé
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payer {
                    paymentMethod === 'card' 
                      ? service.price.toLocaleString()
                      : fees 
                        ? (service.price + fees.amount).toLocaleString()
                        : service.price.toLocaleString()
                  } FCFA
                  {paymentMethod !== 'card' && fees && (
                    <span className="text-sm ml-1">(+ frais)</span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;