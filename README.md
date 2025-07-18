# IN AUTO - Site Web Professionnel avec Paiements Stripe

Site web moderne pour IN AUTO, garage automobile professionnel à Douala, Cameroun. Système de gestion des rendez-vous avec base de données Supabase.

## 🚀 Fonctionnalités

### Site Web
- **Design moderne et responsive** avec Tailwind CSS
- **Optimisé pour le SEO** avec métadonnées et Schema.org
- **Performance optimisée** avec lazy loading des images
- **Chatbot intelligent** pour l'assistance client
- **Formulaire de contact avancé** avec validation

### Système de Rendez-vous
- **Gestion complète des rendez-vous** avec Supabase
- **Interface admin** pour gérer les demandes
- **Notifications automatiques** par email
- **Suivi en temps réel** des statuts
- **Dashboard utilisateur** pour les clients connectés

### Services Proposés
- Diagnostic électronique multi-marques
- Entretien mécanique complet
- Pneus et géométrie de précision
- Climatisation
- Système de freinage
- Réparations diverses

## 🛠️ Technologies Utilisées

- **Frontend** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS
- **Icons** : Lucide React
- **Base de données** : Supabase
- **Déploiement** : Netlify

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd in-auto-website
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env
```

Remplissez le fichier `.env` avec vos clés :
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
```

## 🗄️ Configuration de la Base de Données

### Supabase Setup

1. **Créer un projet Supabase** sur [supabase.com](https://supabase.com)

2. **Exécuter les migrations**
```sql
-- Copier et exécuter le contenu de supabase/migrations/create_payments_tables.sql
-- dans l'éditeur SQL de Supabase
```

3. **Déployer les Edge Functions**
```bash
# Installer Supabase CLI
npm install -g @supabase/cli

# Se connecter à votre projet
supabase login
supabase link --project-ref your-project-ref

# Déployer les fonctions
supabase functions deploy create-payment-intent
supabase functions deploy confirm-payment
```

### Structure des Tables

#### `rendezvous`
- Stockage des demandes de rendez-vous
- Statuts : nouveau, confirmé, en_cours, terminé, annulé



## 🎨 Personnalisation

### Couleurs et Thème
Les couleurs principales sont définies dans `tailwind.config.js` :
- **Bleu** : #3B82F6 (services techniques)
- **Rouge** : #EF4444 (urgences et CTA)

### Services et Prix
Les prix sont affichés à titre informatif dans les composants Services.

### Contenu
- **Textes** : Modifier directement dans les composants React
- **Images** : Remplacer les fichiers dans le dossier `public/`
- **Métadonnées SEO** : Modifier dans `index.html`

## 🚀 Déploiement

### Netlify (Recommandé)

## 🔧 Diagnostic et Debug

Si vous rencontrez des problèmes avec la base de données :

1. **Page de diagnostic** : Allez sur `/debug` pour voir l'état complet de votre connexion Supabase
2. **Vérifiez les variables d'environnement** dans votre fichier `.env`
3. **Exécutez la migration** dans votre dashboard Supabase

### Variables d'environnement requises
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase
```

1. Connecter votre repository GitHub à Netlify
2. Configurer les variables d'environnement dans Netlify
3. Déployer automatiquement

### Variables d'environnement de production
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

## 📱 Fonctionnalités Mobiles

- **Design responsive** optimisé pour tous les écrans
- **Touch-friendly** avec boutons et zones tactiles adaptés
- **Performance mobile** avec images optimisées
- **PWA ready** (peut être installé comme app)

## 🔒 Sécurité

- **Validation côté client et serveur**
- **Row Level Security** sur Supabase
- **Sanitisation des données** utilisateur
- **Protection CORS** sur les API

## 📊 Analytics et Monitoring

### Métriques importantes
- Taux de conversion des formulaires
- Temps de chargement des pages
- Utilisation du chatbot

### Outils recommandés
- Google Analytics 4
- Supabase Dashboard pour la base de données

## 🆘 Support et Maintenance

### Logs et Debugging
- **Frontend** : Console du navigateur
- **Supabase** : Logs dans le dashboard
- **Stripe** : Dashboard des événements

### Sauvegarde
- **Base de données** : Sauvegarde automatique Supabase
- **Code** : Repository Git
- **Assets** : Stockage cloud recommandé

## 📞 Contact

Pour toute question technique ou support :
- **Email** : infos@inauto.fr
- **Téléphone** : (+237) 675 978 777
- **Adresse** : Rue PAU, Akwa, Douala - Cameroun

## 📄 Licence

Ce projet est propriétaire d'IN AUTO. Tous droits réservés.