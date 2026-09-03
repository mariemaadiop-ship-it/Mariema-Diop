# Portfolio de Mariema Diop

Portfolio personnel présentant mon parcours, mes compétences et mes projets dans le domaine du digital, du Design Graphique et de l'UX/UI Design.

---

## Technologies utilisées

- HTML5 — structure sémantique et accessible
- CSS3 — variables CSS, Grid, Flexbox, animations
- JavaScript Vanilla — interactions, navigation, animations au scroll

Aucun framework ni dépendance externe. Le site fonctionne directement dans tout navigateur moderne.

---

## Structure des fichiers

```
portfolio-mariema-diop/
│
├── index.html              ← Page principale
├── style.css               ← Feuille de styles
├── script.js               ← JavaScript (interactions)
├── README.md               ← Ce fichier
│
└── assets/
    ├── images/
    │   ├── mariema-profile.jpg     ← [Ajouter photo professionnelle]
    │   ├── protecta.jpg            ← [Ajouter aperçu projet PROTECTA]
    │   ├── remaflow.jpg            ← [Ajouter aperçu projet REMAFLOW]
    │   ├── joj-dakar.jpg           ← [Ajouter aperçu projet JOJ Dakar]
    │   └── jigeen-business.jpg     ← [Ajouter aperçu projet Jigeen Business]
    └── icons/                      ← Réservé pour icônes supplémentaires
```

---

## Installation

1. Télécharger ou cloner ce dossier.
2. Ouvrir le dossier dans **Visual Studio Code**.
3. Ouvrir `index.html` directement dans un navigateur.

**Option recommandée :** Utiliser l'extension **Live Server** dans Visual Studio Code pour un rechargement automatique.

---

## Personnalisation — checklist

Les éléments suivants sont des placeholders à remplacer :

### Images
- `assets/images/mariema-profile.jpg` — Ajouter la photo professionnelle de Mariema Diop
- `assets/images/protecta.jpg` — Ajouter un aperçu ou mockup du projet PROTECTA
- `assets/images/remaflow.jpg` — Ajouter un aperçu ou mockup du projet REMAFLOW
- `assets/images/joj-dakar.jpg` — Ajouter un aperçu ou mockup du projet JOJ Dakar
- `assets/images/jigeen-business.jpg` — Ajouter un aperçu ou mockup du projet Jigeen Business

### Liens
Rechercher dans `index.html` les textes suivants et remplacer par les vraies valeurs :
- `[Ajouter lien LinkedIn]` → URL LinkedIn (ex : `https://linkedin.com/in/mariema-diop`)
- `[Ajouter lien GitHub]` → URL GitHub (ex : `https://github.com/mariema-diop`)
- `[Lien vers CV]` → URL ou chemin du fichier PDF du CV (ex : `assets/cv-mariema-diop.pdf`)
- `[Ajouter lien du projet]` → URL de chaque projet Figma ou site

### Coordonnées
- `[Ajouter adresse email]` → Adresse email professionnelle

### Parcours
- `[Ajouter diplôme / année]` → Intitulé du diplôme et années à l'UVS

### Témoignages
- `[Témoignage professionnel à ajouter]` → Vrais témoignages
- `[Nom du contact]` → Nom de la personne
- `[Poste, Organisation]` → Poste et organisation

---

## Formulaire de contact

Le formulaire de contact affiche une confirmation visuelle mais ne transmet pas réellement de données sans un service backend.

Pour activer l'envoi réel, intégrer l'une des solutions suivantes :

- **Formspree** — `https://formspree.io` (gratuit jusqu'à 50 messages/mois)
- **Netlify Forms** — Si hébergé sur Netlify
- **EmailJS** — Envoi direct côté client via `emailjs.com`

---

## Design system

| Élément | Valeur |
|---|---|
| Couleur principale | `#5B3A8C` (violet profond) |
| Couleur secondaire | `#CDB4DB` (lavande douce) |
| Couleur de fond | `#F8D7E3` (rose très clair) |
| Police titres | Poppins 600–800 |
| Police texte | Inter 400–500 |
| Coins arrondis | 14–20px |

---

## Fonctionnalités JavaScript

- Navigation sticky avec détection du scroll
- Menu hamburger animé (mobile)
- Lien actif selon la section visible à l'écran
- Smooth scroll vers les sections
- Animation d'apparition au scroll (IntersectionObserver)
- Filtre des projets par catégorie
- Bouton retour en haut
- Gestion des images manquantes (placeholder automatique)
- Validation du formulaire et retour visuel

---

## Hébergement

Ce portfolio peut être hébergé gratuitement sur :

- **GitHub Pages** — `github.io`
- **Netlify** — glisser-déposer le dossier sur `netlify.com`
- **Vercel** — connexion GitHub automatique

---

© 2026 Mariema Diop — Portfolio personnel.
