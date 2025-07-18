import React, { useState, useEffect } from 'react';
import { Calendar, Users, CreditCard, TrendingUp, Eye, Edit, Trash2, Phone, Mail, Clock, CheckCircle, XCircle, AlertCircle, Filter, Search, Download, RefreshCw } from 'lucide-react';
import { supabase, rendezVousService, paymentService, subscribeToRendezVous, subscribeToPayments, RendezVous, Payment } from '../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [rendezVous, setRendezVous] = useState<RendezVous[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'rendezvous' | 'payments'>('overview');
  const [selectedRendezVous, setSelectedRendezVous] = useState<RendezVous | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [newRendezVousCount, setNewRendezVousCount] = useState(0);

  // Charger les données initiales
  useEffect(() => {
    loadData();
    
    try {
      // S'abonner aux changements en temps réel
      const rendezVousSubscription = subscribeToRendezVous((payload) => {
        setLastUpdate(new Date());
        
        // Compter les nouveaux rendez-vous
        if (payload.eventType === 'INSERT') {
          setNewRendezVousCount(prev => prev + 1);
          // Réinitialiser le compteur après 5 secondes
          setTimeout(() => setNewRendezVousCount(0), 5000);
        }
        
        loadRendezVous();
      });

      const paymentsSubscription = subscribeToPayments((payload) => {
        setLastUpdate(new Date());
        loadPayments();
      });

      return () => {
        rendezVousSubscription.unsubscribe();
        paymentsSubscription.unsubscribe();
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des subscriptions:', error);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadRendezVous(), loadPayments()]);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRendezVous = async () => {
    try {
      const data = await rendezVousService.getAll();
      setRendezVous(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
    }
  };

  const loadPayments = async () => {
    try {
      const data = await paymentService.getAll();
      setPayments(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
    }
  };

  const updateRendezVousStatus = async (id: string, status: RendezVous['status']) => {
    try {
      await rendezVousService.update(id, { status });
      loadRendezVous();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const deleteRendezVous = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      try {
        await rendezVousService.delete(id);
        loadRendezVous();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Filtrer les rendez-vous
  const filteredRendezVous = rendezVous.filter(rdv => {
    const matchesStatus = filterStatus === 'all' || rdv.status === filterStatus;
    const matchesSearch = rdv.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rdv.telephone.includes(searchTerm) ||
                         rdv.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Statistiques
  const stats = {
    totalRendezVous: rendezVous.length,
    nouveaux: rendezVous.filter(rdv => rdv.status === 'nouveau').length,
    confirmes: rendezVous.filter(rdv => rdv.status === 'confirme').length,
    termines: rendezVous.filter(rdv => rdv.status === 'termine').length,
    totalPaiements: payments.reduce((sum, payment) => sum + payment.amount, 0),
    paiementsReussis: payments.filter(payment => payment.status === 'succeeded').length,
    tauxConversion: rendezVous.length > 0 ? (payments.filter(p => p.status === 'succeeded').length / rendezVous.length * 100).toFixed(1) : '0'
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nouveau': return 'bg-blue-100 text-blue-800';
      case 'confirme': return 'bg-green-100 text-green-800';
      case 'en_cours': return 'bg-yellow-100 text-yellow-800';
      case 'termine': return 'bg-gray-100 text-gray-800';
      case 'annule': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-gray-600">Gestion des rendez-vous et paiements IN AUTO</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Dernière mise à jour : {lastUpdate.toLocaleTimeString('fr-FR')}
                {newRendezVousCount > 0 && (
                  <span className="ml-4 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold animate-bounce">
                    +{newRendezVousCount} nouveau{newRendezVousCount > 1 ? 'x' : ''}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={loadData}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
            { id: 'rendezvous', label: 'Rendez-vous', icon: Calendar },
            { id: 'payments', label: 'Paiements', icon: CreditCard }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Rendez-vous</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalRendezVous}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Confirmés</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.confirmes}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Revenus</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stats.totalPaiements.toLocaleString()} FCFA
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Taux Conversion</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.tauxConversion}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rendez-vous récents */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Rendez-vous récents</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                    Temps réel
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rendezVous.slice(0, 5).map((rdv) => (
                      <tr key={rdv.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{rdv.nom}</div>
                            <div className="text-sm text-gray-500">{rdv.telephone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rdv.service}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rdv.date ? new Date(rdv.date).toLocaleDateString('fr-FR') : 'Non définie'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(rdv.status)}`}>
                            {rdv.status}
                            {rdv.created_at && new Date(rdv.created_at) > new Date(Date.now() - 60000) && (
                              <span className="ml-1 text-xs">🆕</span>
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {rendezVous.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun rendez-vous pour le moment</p>
                  <p className="text-sm">Les nouveaux rendez-vous apparaîtront ici en temps réel</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gestion des rendez-vous */}
        {activeTab === 'rendezvous' && (
          <div className="space-y-6">
            {/* Filtres et recherche */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Rechercher par nom, téléphone ou service..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="nouveau">Nouveau</option>
                    <option value="confirme">Confirmé</option>
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                    <option value="annule">Annulé</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des rendez-vous */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Tous les rendez-vous ({filteredRendezVous.length})
                  </h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Synchronisation automatique
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Heure</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paiement</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRendezVous.map((rdv) => (
                      <tr key={rdv.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{rdv.nom}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {rdv.telephone}
                            </div>
                            {rdv.email && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Mail className="h-3 w-3 mr-1" />
                                {rdv.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{rdv.service}</div>
                          {rdv.message && (
                            <div className="text-xs text-gray-500 max-w-xs truncate">{rdv.message}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {rdv.date ? new Date(rdv.date).toLocaleDateString('fr-FR') : 'Non définie'}
                          </div>
                          {rdv.heure && (
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {rdv.heure}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={rdv.status}
                            onChange={(e) => updateRendezVousStatus(rdv.id, e.target.value as RendezVous['status'])}
                            className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(rdv.status)}`}
                          >
                            <option value="nouveau">Nouveau</option>
                            <option value="confirme">Confirmé</option>
                            <option value="en_cours">En cours</option>
                            <option value="termine">Terminé</option>
                            <option value="annule">Annulé</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(rdv.payment_status)}`}>
                            {rdv.payment_status}
                            {rdv.created_at && new Date(rdv.created_at) > new Date(Date.now() - 300000) && (
                              <span className="ml-1 text-xs animate-pulse">🆕</span>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedRendezVous(rdv)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteRendezVous(rdv.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredRendezVous.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Aucun rendez-vous trouvé</p>
                  <p className="text-sm">
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Essayez de modifier vos filtres de recherche'
                      : 'Les nouveaux rendez-vous apparaîtront ici automatiquement'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gestion des paiements */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Historique des paiements ({payments.length})
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Temps réel
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Méthode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {payment.stripe_payment_id || payment.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(payment as any).rendezvous?.nom || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {payment.amount.toLocaleString()} {payment.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.payment_method || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(payment.status)}`}>
                          {payment.status}
                          {payment.created_at && new Date(payment.created_at) > new Date(Date.now() - 300000) && (
                            <span className="ml-1 text-xs animate-pulse">🆕</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {payments.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <CreditCard className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Aucun paiement enregistré</p>
                <p className="text-sm">Les transactions apparaîtront ici en temps réel</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de détails du rendez-vous */}
      {selectedRendezVous && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Détails du rendez-vous</h3>
                <button
                  onClick={() => setSelectedRendezVous(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <p className="text-sm text-gray-900">{selectedRendezVous.nom}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <p className="text-sm text-gray-900">{selectedRendezVous.telephone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedRendezVous.email || 'Non fourni'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service</label>
                  <p className="text-sm text-gray-900">{selectedRendezVous.service}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-sm text-gray-900">
                    {selectedRendezVous.date ? new Date(selectedRendezVous.date).toLocaleDateString('fr-FR') : 'Non définie'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Heure</label>
                  <p className="text-sm text-gray-900">{selectedRendezVous.heure || 'Non définie'}</p>
                </div>
              </div>
              {selectedRendezVous.message && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRendezVous.message}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRendezVous.status)}`}>
                    {selectedRendezVous.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Statut paiement</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(selectedRendezVous.payment_status)}`}>
                    {selectedRendezVous.payment_status}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <p>Créé le : {new Date(selectedRendezVous.created_at).toLocaleString('fr-FR')}</p>
                <p>Modifié le : {new Date(selectedRendezVous.updated_at).toLocaleString('fr-FR')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;