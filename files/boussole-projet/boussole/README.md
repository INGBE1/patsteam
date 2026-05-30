# 🧭 Boussole — Mode d'emploi (pour débutants)

Bienvenue ! Ce dossier contient votre application **Boussole** prête à lancer.
Pas de panique si vous ne connaissez rien au code : suivez les étapes dans l'ordre.

---

## Étape 1 — Installer Node.js (obligatoire)

L'appli a besoin de Node.js pour tourner sur votre ordinateur.

1. Allez sur **https://nodejs.org**
2. Téléchargez la version **LTS** (le gros bouton vert)
3. Installez-la (Suivant → Suivant → Terminer)
4. **Fermez puis rouvrez** votre terminal après l'installation

Pour vérifier, tapez dans un terminal : `node --version`
Vous devez voir un numéro qui commence par `v18`, `v20` ou `v22`.

> Le terminal, c'est : **Terminal** sur Mac, **PowerShell** sur Windows.

---

## Étape 2 — Lancer l'application

Ouvrez un terminal **dans ce dossier** (`boussole`), puis tapez ces 2 commandes,
une à la fois (appuyez sur Entrée après chaque) :

```bash
npm install
```

(attendez que ça se termine, ça peut prendre 1-2 minutes)

```bash
npm run dev
```

Une adresse va s'afficher, du style **http://localhost:5173**
Ouvrez-la dans votre navigateur : votre appli est en ligne ! 🎉

Pour l'arrêter : revenez dans le terminal et appuyez sur `Ctrl` + `C`.

---

## Étape 3 (recommandé) — Utiliser Claude Code pour aller plus loin

Claude Code peut lancer l'appli pour vous et vous aider à la modifier sans coder.

### Installer Claude Code

**Le plus simple (pas besoin de Node pour Claude Code lui-même) :**

- **Mac / Linux**, dans un terminal :
  ```bash
  curl -fsSL https://claude.ai/install.sh | bash
  ```
- **Windows**, dans PowerShell :
  ```powershell
  irm https://claude.ai/install.ps1 | iex
  ```

> Il existe aussi une **application Desktop** de Claude Code si vous préférez
> ne pas utiliser le terminal du tout.
> Il faut un compte Claude payant (Pro, Max, Team…) pour s'en servir.

### S'en servir

1. Ouvrez un terminal dans le dossier `boussole`
2. Tapez : `claude`
3. Demandez-lui en français, par exemple :
   - « Installe les dépendances et lance l'application »
   - « Ajoute 3 nouveaux messages dans le mini-jeu Vrai ou Arnaque »
   - « Change le prénom Sofia par Léa partout »
   - « Ajoute un écran de badges qui se débloquent avec le Bouclier »

Le fichier `CLAUDE.md` (à côté de ce README) explique déjà tout le projet à Claude Code,
donc il comprendra tout de suite comment ça marche.

---

## En cas de souci

- **« npm n'est pas reconnu »** → Node.js n'est pas (bien) installé. Refaites l'étape 1
  et rouvrez le terminal.
- **La page est blanche** → vérifiez que `npm run dev` tourne toujours dans le terminal.
- **Besoin d'aide ?** → lancez `claude` et expliquez-lui le message d'erreur, il vous guide.

Bon coding jam, et bonne chance pour la victoire ! 🏆
