# Boussole — la banque qui t'explique tout

## C'est quoi ce projet ?

Boussole est une **application bancaire mobile pour les jeunes (15-19 ans)** qui découvrent
la banque pour la première fois. Sa mission : enlever la peur et expliquer chaque chose
simplement. Projet réalisé pour un coding jam (équipe débutante en code).

La fonctionnalité-vedette est le **Bouclier anti-arnaque** : un outil qui analyse les
messages douteux (faux SMS, phishing) et un mini-jeu pour apprendre à repérer les pièges.

## Stack technique

- **React 18** + **Vite** (pas de TypeScript, pour rester simple)
- **lucide-react** pour les icônes
- Tout le code de l'app est dans un seul fichier : `src/App.jsx`
- Aucune base de données : tout l'état est géré en mémoire avec `useState`
- Les polices (Fredoka, Nunito) sont chargées via Google Fonts dans le composant `Style`

## Comment lancer le projet

```bash
npm install      # installe les dépendances (une seule fois)
npm run dev      # lance l'appli en local, ouvre le lien http://localhost:5173
```

## Structure des fichiers

- `src/App.jsx` — TOUTE l'application (écrans, composants, styles inline)
- `src/main.jsx` — point d'entrée (ne pas toucher)
- `index.html` — page HTML (ne pas toucher)

## Les écrans de l'app (gérés par la variable `screen`)

- `onboarding` — accueil au premier lancement (3 slides)
- `accueil` — solde, carte, opérations, accès au Bouclier
- `bouclier` — analyseur d'arnaques + mini-jeu "Vrai ou Arnaque ?" (LA vedette)
- `virement` — envoyer de l'argent, avec explications sur chaque champ
- `objectifs` — tirelires d'épargne avec barres de progression
- `lexique` — dictionnaire des mots de banque expliqués simplement

## Le "mode découverte"

Quand `debutant` est à `true`, des bulles d'aide (composant `Astuce`, avec la mascotte Pia)
et des boutons "?" (composant `Aide`) apparaissent partout pour tout expliquer.

## Idées d'améliorations (si tu veux aider l'équipe à aller plus loin)

- Ajouter de nouveaux messages dans le tableau `QUIZ` du mini-jeu
- Ajouter des mots dans le tableau `lexique`
- Ajouter de nouveaux pièges d'arnaque dans le tableau `FLAGS`
- Créer un écran "badges/permis bancaire" qui se débloque quand le score du Bouclier monte
- Ajouter une page "réglages" pour changer le prénom affiché (actuellement "Sofia")

## Règles importantes pour modifier le code

- Garder l'app dans UN seul fichier `App.jsx` tant que possible (plus simple pour des débutants)
- Garder le français partout dans l'interface
- Garder le ton bienveillant et non-culpabilisant
- Ne pas utiliser localStorage (juste useState)
