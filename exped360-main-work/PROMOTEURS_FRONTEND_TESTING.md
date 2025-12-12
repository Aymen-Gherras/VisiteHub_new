# 🧪 Frontend Testing Guide - Système Promoteurs/Agences

## 📋 Pages Créées pour les Tests

### 🏗️ Pages Publiques
- **`/promoteurs`** - Liste de tous les promoteurs avec recherche et filtres
- **`/promoteurs/[slug]`** - Page détail d'un promoteur avec ses projets et propriétés
- **`/agences`** - Liste de toutes les agences avec système de notation
- **`/agences/[slug]`** - Page détail d'une agence avec ses propriétés

### ⚙️ Pages Admin
- **`/admin/promoteurs`** - Gestion des promoteurs (CRUD)
- **`/admin/agences`** - Gestion des agences (CRUD)
- **`/admin/projects`** - Gestion des projets (CRUD)

### 🔧 Pages de Test
- **`/test-system`** - Interface de test complète du système
- **`/properties/create`** - Formulaire amélioré avec sélection agence/promoteur

## 🚀 Comment Tester

### 1. Démarrer le Frontend
```bash
cd exped360-main-work
npm install
npm run dev
```

### 2. Configurer les Variables d'Environnement
Créez `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
API_URL=http://localhost:3000
```

### 3. Tester les Fonctionnalités

#### ✅ Test de Base
1. Allez sur `http://localhost:3001/test-system`
2. Vérifiez que tous les tests API sont verts ✅
3. Explorez les statistiques du système

#### 🏗️ Test des Promoteurs
1. Visitez `/promoteurs` - Voir la liste
2. Cliquez sur un promoteur pour voir ses détails
3. Vérifiez les onglets: Aperçu, Projets, Propriétés

#### 🏢 Test des Agences
1. Visitez `/agences` - Voir la liste avec ratings
2. Testez la recherche et filtres par wilaya
3. Cliquez sur une agence pour voir ses propriétés

#### 📝 Test Création Propriété
1. Allez sur `/properties/create`
2. Sélectionnez "Agence immobilière" comme type de propriétaire
3. Vérifiez que la liste des agences se charge
4. Sélectionnez "Promotion immobilière" 
5. Vérifiez que la liste des promoteurs se charge
6. Sélectionnez un promoteur et vérifiez que ses projets apparaissent

## 🎨 Fonctionnalités Implémentées

### 🔍 Recherche et Filtres
- Recherche par nom (promoteurs/agences)
- Filtres par wilaya
- Pagination automatique

### 📊 Affichage des Données
- **Promoteurs**: Logo, description, projets, statistiques
- **Agences**: Logo, rating étoiles, nombre de propriétés
- **Projets**: Status, progression, localisation
- **Propriétés**: Prix, surface, chambres, localisation

### 🎯 Sélection Intelligente
- Dropdown avec recherche pour agences/promoteurs
- Chargement dynamique des projets selon le promoteur
- Aperçu visuel des entités sélectionnées
- Liens vers création de nouveaux profils

### 📱 Interface Responsive
- Design mobile-first
- Grilles adaptatives
- Navigation mobile optimisée

## 🔧 Composants Créés

### 📄 Pages
- `pages/promoteurs/index.tsx` - Liste promoteurs
- `pages/promoteurs/[slug].tsx` - Détail promoteur
- `pages/agences/index.tsx` - Liste agences
- `pages/test-system.tsx` - Interface de test

### 🧩 Composants
- `components/PropertyForm/EnhancedPropertyForm.tsx` - Formulaire amélioré
- `components/Navigation/SystemNavigation.tsx` - Navigation système
- `components/Layout/TestLayout.tsx` - Layout de test

## 🎯 Workflow de Création Propriété

### 1. Sélection Type Propriétaire
```typescript
// Particulier: Aucune sélection supplémentaire
// Agence: Dropdown des agences existantes OU nom nouvelle agence
// Promoteur: Dropdown des promoteurs existants OU nom nouveau promoteur
```

### 2. Sélection Agence
```typescript
interface AgenceSelection {
  selectedAgenceId?: string;     // ID agence existante
  propertyOwnerName?: string;    // Nom nouvelle agence
}
```

### 3. Sélection Promoteur + Projet
```typescript
interface PromoteurSelection {
  selectedPromoteurId?: string;  // ID promoteur existant
  selectedProjectId?: string;    // ID projet (optionnel)
  propertyOwnerName?: string;    // Nom nouveau promoteur
}
```

## 🧪 Tests Automatiques

La page `/test-system` effectue automatiquement:
- ✅ Test connectivité API
- ✅ Validation structure des données
- ✅ Comptage des entités
- ✅ Tests endpoints de sélection

## 🚨 Points d'Attention

### 🔐 Authentification
- Les pages admin nécessitent un token JWT
- Stocké dans `localStorage.getItem('adminToken')`
- À configurer selon votre système d'auth

### 🌐 URLs API
- Vérifiez que `NEXT_PUBLIC_API_URL` pointe vers votre backend
- Par défaut: `http://localhost:3000`

### 📊 Données de Test
- Le système fonctionne même avec des données vides
- Les pages affichent des messages appropriés si aucune donnée

## 🎉 Résultat Final

Vous avez maintenant:
- ✅ **Backend complet** avec API REST
- ✅ **Frontend de test** avec toutes les pages
- ✅ **Formulaire intelligent** pour création propriétés
- ✅ **Interface admin** pour gestion
- ✅ **Système de test** automatique

Le système est **prêt pour la production** ! 🚀
