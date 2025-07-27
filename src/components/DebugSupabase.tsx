import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Database, Eye, RefreshCw, Settings, Zap, Copy, ExternalLink } from 'lucide-react';
import { supabase, testSupabaseConnection, testSupabaseInsert, getSupabaseStats, rendezVousService } from '../lib/supabase';

const DebugSupabase: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>({});
  const [liveData, setLiveData] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);

  const runDiagnostic = async () => {
    setIsLoading(true);
    console.log('🔍 === DÉBUT DU DIAGNOSTIC SUPABASE ===');
    const results: any = {};

    try {
      // 1. Vérifier les variables d'environnement
      console.log('1️⃣ Vérification des variables d\'environnement...');
      results.env = {
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'NON DÉFINI',
        supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'DÉFINI' : 'NON DÉFINI',
        hasClient: !!supabase,
        urlValid: import.meta.env.VITE_SUPABASE_URL?.includes('supabase.co') || false,
        keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0
      };
      console.log('📊 Variables d\'environnement:', results.env);

      // 2. Test de connexion basique
      console.log('2️⃣ Test de connexion basique...');
      if (supabase) {
        try {
          const connectionTest = await testSupabaseConnection();
          results.connection = {
            status: connectionTest ? 'SUCCÈS' : 'ERREUR',
            connected: connectionTest
          };
        } catch (error) {
          results.connection = {
            status: 'ERREUR',
            error: error instanceof Error ? error.message : 'Erreur de connexion inconnue'
          };
        }
      } else {
        results.connection = {
          status: 'ERREUR',
          error: 'Client Supabase non initialisé - vérifiez vos variables d\'environnement'
        };
      }
      console.log('🔗 Test de connexion:', results.connection);

      // 3. Test d'insertion
      console.log('3️⃣ Test d\'insertion...');
      if (supabase && results.connection.status === 'SUCCÈS') {
        const insertTest = await testSupabaseInsert();
        results.insert = {
          status: insertTest ? 'SUCCÈS' : 'ERREUR',
          tested: true
        };
      } else {
        results.insert = {
          status: 'IGNORÉ',
          error: 'Connexion échouée'
        };
      }
      console.log('📝 Test d\'insertion:', results.insert);

      // 4. Statistiques
      console.log('4️⃣ Récupération des statistiques...');
      const stats = await getSupabaseStats();
      results.stats = stats;
      console.log('📊 Statistiques:', stats);

      // 5. Test de lecture des données
      console.log('5️⃣ Test de lecture des données...');
      if (supabase && results.connection.status === 'SUCCÈS') {
        try {
          const readResult = await rendezVousService.getAll();
          results.read = {
            status: 'SUCCÈS',
            count: readResult?.length || 0,
            data: readResult?.slice(0, 5) // Premiers 5 éléments
          };
        } catch (err) {
          results.read = {
            status: 'ERREUR',
            error: err instanceof Error ? err.message : 'Erreur inconnue'
          };
        }
      } else {
        results.read = {
          status: 'ERREUR',
          error: 'Connexion échouée'
        };
      }
      console.log('👁️ Test de lecture:', results.read);

    } catch (error) {
      console.error('💥 Erreur globale lors du diagnostic:', error);
      results.global = {
        status: 'ERREUR',
        error: error instanceof Error ? error.message : 'Erreur globale inconnue'
      };
    }

    console.log('🏁 === FIN DU DIAGNOSTIC ===');
    console.log('📋 Résultats complets:', results);
    setTestResults(results);
    setIsLoading(false);
  };

  const startLiveMonitoring = () => {
    if (!supabase) return;
    
    setIsListening(true);
    
    // S'abonner aux changements en temps réel
    const subscription = supabase
      .channel('debug-live-data')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'rendezvous' }, 
        (payload) => {
          console.log('🔴 LIVE: Changement détecté:', payload);
          setLiveData(prev => [
            {
              timestamp: new Date().toLocaleTimeString('fr-FR'),
              event: payload.eventType,
              table: 'rendezvous',
              data: payload.new || payload.old,
              id: Math.random()
            },
            ...prev.slice(0, 9) // Garder seulement les 10 derniers
          ]);
        }
      )
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
      setIsListening(false);
    };
  };

  const stopLiveMonitoring = () => {
    setIsListening(false);
    setLiveData([]);
  };

  useEffect(() => {
    runDiagnostic();
    
    // Démarrer automatiquement le monitoring si Supabase est configuré
    if (supabase) {
      const cleanup = startLiveMonitoring();
      return cleanup;
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCÈS':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'ERREUR':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCÈS':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'ERREUR':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'IGNORÉ':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Database className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Diagnostic Supabase</h2>
            <p className="text-gray-600">Vérification complète de la connexion et configuration</p>
          </div>
        </div>
        <button
          onClick={runDiagnostic}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Test en cours...' : 'Relancer les tests'}
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={isListening ? stopLiveMonitoring : startLiveMonitoring}
            disabled={!supabase}
            className={`flex items-center px-4 py-2 rounded-lg font-medium ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            } disabled:opacity-50`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${isListening ? 'bg-white animate-pulse' : 'bg-white'}`}></div>
            {isListening ? 'Arrêter le monitoring' : 'Monitoring temps réel'}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Monitoring temps réel */}
        {supabase && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg font-semibold">Monitoring temps réel</h3>
              </div>
              <div className={`flex items-center text-sm ${isListening ? 'text-green-600' : 'text-gray-500'}`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {isListening ? 'En écoute' : 'Arrêté'}
              </div>
            </div>
            
            {liveData.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {liveData.map((event) => (
                  <div key={event.id} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 text-xs rounded font-medium ${
                            event.event === 'INSERT' ? 'bg-green-100 text-green-800' :
                            event.event === 'UPDATE' ? 'bg-blue-100 text-blue-800' :
                            event.event === 'DELETE' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {event.event}
                          </span>
                          <span className="text-sm font-medium">{event.table}</span>
                        </div>
                        {event.data && (
                          <div className="text-sm text-gray-600">
                            <strong>{event.data.nom}</strong> - {event.data.service}
                            {event.data.telephone && ` (${event.data.telephone})`}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{event.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6" />
                </div>
                <p>Aucun événement détecté</p>
                <p className="text-sm">
                  {isListening 
                    ? 'Les changements en base apparaîtront ici en temps réel'
                    : 'Activez le monitoring pour voir les événements'
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {/* Variables d'environnement */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Settings className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold">1. Variables d'environnement</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`p-3 rounded border ${testResults.env?.supabaseUrl !== 'NON DÉFINI' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="font-medium">VITE_SUPABASE_URL</div>
              <div className="text-sm text-gray-600 break-all">{testResults.env?.supabaseUrl}</div>
              {testResults.env?.supabaseUrl !== 'NON DÉFINI' && (
                <button 
                  onClick={() => copyToClipboard(testResults.env.supabaseUrl)}
                  className="text-xs text-blue-600 hover:underline mt-1"
                >
                  Copier
                </button>
              )}
            </div>
            <div className={`p-3 rounded border ${testResults.env?.supabaseKey === 'DÉFINI' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="font-medium">VITE_SUPABASE_ANON_KEY</div>
              <div className="text-sm text-gray-600">{testResults.env?.supabaseKey}</div>
            </div>
            <div className={`p-3 rounded border ${testResults.env?.hasClient ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="font-medium">Client Supabase</div>
              <div className="text-sm text-gray-600">{testResults.env?.hasClient ? 'Initialisé' : 'Non initialisé'}</div>
            </div>
            <div className={`p-3 rounded border ${testResults.env?.urlValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="font-medium">URL Valide</div>
              <div className="text-sm text-gray-600">{testResults.env?.urlValid ? 'Oui' : 'Non'}</div>
            </div>
          </div>
          
          {/* Instructions pour les variables */}
          {(!testResults.env?.supabaseUrl || testResults.env?.supabaseUrl === 'NON DÉFINI' || testResults.env?.supabaseKey !== 'DÉFINI') && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">🔧 Configuration requise</h4>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>1. Créez un fichier <code className="bg-yellow-100 px-1 rounded">.env</code> à la racine du projet</p>
                <p>2. Ajoutez ces lignes :</p>
                <div className="bg-yellow-100 p-2 rounded font-mono text-xs">
                  VITE_SUPABASE_URL=https://votre-projet.supabase.co<br/>
                  VITE_SUPABASE_ANON_KEY=votre_clé_anonyme
                </div>
                <p>3. Redémarrez le serveur de développement</p>
                <a 
                  href="https://supabase.com/dashboard" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Aller au Dashboard Supabase
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Test de connexion */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Zap className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold">2. Test de connexion</h3>
          </div>
          <div className={`p-4 rounded border ${getStatusColor(testResults.connection?.status)}`}>
            <div className="flex items-center mb-2">
              {getStatusIcon(testResults.connection?.status)}
              <span className="ml-2 font-medium">Statut: {testResults.connection?.status}</span>
            </div>
            {testResults.connection?.error && (
              <div className="text-sm mt-2">
                <strong>Erreur:</strong> {testResults.connection.error}
              </div>
            )}
          </div>
        </div>

        {/* Statistiques */}
        {testResults.stats && (
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Database className="h-5 w-5 text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold">3. Statistiques de la base</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                <div className="text-2xl font-bold text-blue-800">{testResults.stats.rendezvous}</div>
                <div className="text-sm text-blue-600">Rendez-vous</div>
                {testResults.stats.errors.rendezvous && (
                  <div className="text-xs text-red-600 mt-1">Erreur: {testResults.stats.errors.rendezvous}</div>
                )}
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <div className="text-2xl font-bold text-green-800">{testResults.stats.payments}</div>
                <div className="text-sm text-green-600">Paiements</div>
                {testResults.stats.errors.payments && (
                  <div className="text-xs text-red-600 mt-1">Erreur: {testResults.stats.errors.payments}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Test d'insertion */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Eye className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold">4. Tests d'insertion et lecture</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded border ${getStatusColor(testResults.insert?.status)}`}>
              <div className="flex items-center mb-2">
                {getStatusIcon(testResults.insert?.status)}
                <span className="ml-2 font-medium">Test d'insertion</span>
              </div>
              {testResults.insert?.error && (
                <div className="text-sm mt-2">
                  <strong>Erreur:</strong> {testResults.insert.error}
                </div>
              )}
            </div>
            <div className={`p-4 rounded border ${getStatusColor(testResults.read?.status)}`}>
              <div className="flex items-center mb-2">
                {getStatusIcon(testResults.read?.status)}
                <span className="ml-2 font-medium">Lecture</span>
              </div>
              {testResults.read?.count !== undefined && (
                <div className="text-sm mt-2">
                  <strong>Nombre d'enregistrements:</strong> {testResults.read.count}
                </div>
              )}
              {testResults.read?.error && (
                <div className="text-sm mt-2 text-red-600">
                  <strong>Erreur:</strong> {testResults.read.error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Données actuelles */}
        {testResults.read?.data && testResults.read.data.length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">5. Données actuelles (5 premiers)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Créé le</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testResults.read.data.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.nom}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.telephone}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{item.service}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'nouveau' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'confirme' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(item.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions de résolution */}
        <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
          <h3 className="text-lg font-semibold mb-3 text-orange-800">🛠️ Guide de résolution des problèmes</h3>
          <div className="space-y-4 text-sm text-orange-700">
            
            <div>
              <p className="font-semibold">1. Variables d'environnement manquantes :</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Créez un fichier <code>.env</code> à la racine du projet</li>
              <li>Ajoutez : <code>VITE_SUPABASE_URL=https://votre-projet.supabase.co</code></li>
              <li>Ajoutez : <code>VITE_SUPABASE_ANON_KEY=votre_clé_anonyme</code></li>
                <li>Redémarrez le serveur avec <code>npm run dev</code></li>
            </ul>
            </div>
            
            <div>
              <p className="font-semibold">2. Tables manquantes ou erreurs de connexion :</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Allez dans votre dashboard Supabase</li>
              <li>Section "SQL Editor"</li>
                <li>Copiez-collez le contenu de <code>supabase/migrations/20250709050000_complete_reset.sql</code></li>
                <li>Cliquez sur "Run" pour exécuter la migration</li>
            </ul>
            </div>
            
            <div>
              <p className="font-semibold">3. Problèmes de politiques RLS :</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Vérifiez que RLS est activé sur les tables</li>
                <li>Les politiques doivent permettre l'insertion anonyme</li>
                <li>Utilisez la migration complète pour reset les politiques</li>
            </ul>
            </div>
            
            <div className="bg-orange-100 p-3 rounded border border-orange-300">
              <p className="font-semibold">🚨 Si rien ne fonctionne :</p>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                <li>Vérifiez que votre projet Supabase est actif</li>
                <li>Vérifiez que l'URL contient bien ".supabase.co"</li>
                <li>Régénérez vos clés API dans le dashboard</li>
                <li>Exécutez la migration complète de reset</li>
                <li>Redémarrez votre serveur de développement</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugSupabase;

// Test d'insertion simple
const { data, error } = await supabase
  .from('rendezvous')
  .insert([
    {
      name: 'Test Debug',
      phone: '+237600000000',
      service: 'test',
      status: 'nouveau'
    }
  ]);

console.log('Data:', data);
console.log('Error:', error);