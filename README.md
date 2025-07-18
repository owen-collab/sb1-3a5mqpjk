# 📝 Gestionnaire de Tâches React + Supabase

Une application simple de gestion de tâches construite avec React et Supabase.

## 🚀 Fonctionnalités

- ✅ Afficher toutes les tâches
- ➕ Ajouter de nouvelles tâches
- ✏️ Marquer les tâches comme complétées/non complétées
- 🗑️ Supprimer des tâches
- 📊 Statistiques en temps réel
- 🎨 Interface moderne et responsive

## 🛠️ Technologies

- **React 18** avec Hooks
- **Supabase** pour la base de données
- **Vite** pour le build
- **CSS moderne** avec animations

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd gestionnaire-taches
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**

Créez un fichier `.env` à la racine du projet :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase
```

4. **Créer la table dans Supabase**

Dans votre dashboard Supabase, exécutez cette requête SQL :

```sql
-- Créer la table tasks
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS (Row Level Security)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre toutes les opérations (pour la démo)
CREATE POLICY "Allow all operations on tasks" ON tasks
  FOR ALL USING (true);
```

5. **Démarrer l'application**
```bash
npm run dev
```

## 🗄️ Structure de la base de données

### Table `tasks`
| Colonne | Type | Description |
|---------|------|-------------|
| `id` | BIGSERIAL | Identifiant unique (clé primaire) |
| `title` | TEXT | Titre de la tâche |
| `completed` | BOOLEAN | Statut de completion (défaut: false) |
| `created_at` | TIMESTAMP | Date de création |

## 🎯 Utilisation

1. **Ajouter une tâche** : Tapez dans le champ texte et cliquez sur "Ajouter"
2. **Marquer comme complétée** : Cochez la case à côté de la tâche
3. **Supprimer une tâche** : Cliquez sur l'icône poubelle 🗑️
4. **Voir les statistiques** : En bas de la page

## 🔧 Développement

### Scripts disponibles
- `npm run dev` - Démarrer en mode développement
- `npm run build` - Construire pour la production
- `npm run preview` - Prévisualiser la build de production

### Structure du projet
```
src/
├── lib/
│   └── supabaseClient.js    # Configuration Supabase
├── App.jsx                  # Composant principal
├── App.css                  # Styles de l'application
├── main.jsx                 # Point d'entrée
└── index.css               # Styles globaux
```

## 🚀 Déploiement

1. **Build de production**
```bash
npm run build
```

2. **Déployer sur Netlify/Vercel**
- Connectez votre repository
- Ajoutez les variables d'environnement
- Déployez automatiquement

## 🔒 Sécurité

⚠️ **Important** : Cette application utilise une politique RLS permissive pour la démo. En production, implémentez des politiques de sécurité appropriées basées sur l'authentification des utilisateurs.

## 📝 Licence

MIT License - Libre d'utilisation pour vos projets !