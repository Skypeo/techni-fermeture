# CLAUDE.md — Techni Fermetures

## Projet
Refonte du site de **TECHNI FERMETURES**, entreprise de menuiserie à Mulhouse (depuis 1999).
Objectif : transformer une **maquette one page** (refonte validée par le client) en **site complet multi-pages**, en reprenant le **contenu textuel de l'ancien site** (https://www.techni-fermetures.com/) adapté au nouveau design.

## État d'avancement
- ✅ **Contenu textuel récupéré** : les 13 pages de l'ancien site scrapées (verbatim) dans `content/`.
- ✅ **Site complet construit** : 13 pages HTML déclinant le design de la maquette (`index.html`) sur le contenu de l'ancien site.
- ⏳ **Restes éventuels** : page Mentions légales / Vie privée / Cookies (liens présents, pages à créer si besoin) ; formulaire de contact à brancher (back-end) ; remplacer la photo « aluminium » de `fenetres.html` si une meilleure image est fournie.

## Stack technique
HTML statique + **Tailwind CSS compilé** (CSS statique minifié, **plus de CDN**) + polices Inter/Manrope. Pas de framework JS. Hébergeable partout (Vercel, OVH…).

### Build CSS (Tailwind)
- Config : `tailwind.config.js` (couleurs/polices/ombres du design system), entrée `assets/css/tailwind-input.css`, sortie **`assets/css/tailwind.css`** (minifié, ~25 Ko / ~5,6 Ko gzip).
- Régénérer après ajout de **nouvelles classes Tailwind** dans le HTML/JS : `npm install` (1re fois) puis **`npm run build:css`** (ou `npm run watch:css` en dev). Le scan couvre `./*.html` + `./assets/js/*.js`. Safelist : `hidden`, `opacity-0`, `translate-y-24` (classes togglées en JS).
- **`assets/css/tailwind.css` est versionné** (le site statique le sert directement) ; `node_modules/` est ignoré.
- ⚠️ Si une classe n'apparaît plus après build → vérifier qu'elle est bien présente dans un fichier scanné (sinon purge). `site.css` (CSS pur, custom) est chargé **après** `tailwind.css`.

### Optimisation des images
- Images recompressées **en place** (script `optimize-images.mjs`, dépend de `sharp`) : côté long plafonné à **1920px en préservant le ratio** (donc les `width`/`height` du HTML restent valides → pas de modif HTML, CLS préservé), JPG mozjpeg q80, PNG palette q80, WebP q80, métadonnées strippées.
- Résultat : `img/` **52 → 30 Mo**, vidéo hero `hero-animation.mp4` **8,1 → 0,93 Mo** (H.264 CRF 27, sans audio, faststart). Poster vidéo : `img/hero-poster.jpg`.
- Re-lancer après ajout de **nouvelles** images : `npm run optimize:img` (ne ré-optimiser tout le lot que si nécessaire — la recompression d'images déjà traitées entraîne une légère perte).

## Design system (couleurs/polices/ombres dans tailwind.config.js + styles custom dans assets/css/site.css)
- Couleurs : `ink` #0F1419, `inksoft` #1A2128, `accent` #C00000 (rouge), `teal` #2D5547, `bone` #FAFAF7, `stone` #F4F1EA, `slate2` #5A6470
- Titres **Manrope**, texte **Inter**. Coins arrondis, ombres `soft`/`lift`, animations `.reveal` au scroll.

## Fichiers principaux
- `index.html` — accueil (maquette validée, allégée, **hero vidéo `hero-animation.mp4` conservée**)
- Pages produit : `fenetres.html`, `volets-roulants.html`, `portes-d-entree.html`, `stores-bso.html`, `portails.html`, `portes-de-garage.html`, `portes-industrielles.html`, `motorisations.html`, `sav-depannage.html`
- `notre-entreprise.html`, `realisations.html`, `contact.html`
- `assets/css/tailwind.css` (CSS Tailwind compilé, versionné), `assets/css/site.css` (styles custom), `assets/js/site.js` — partagés par toutes les pages
- `tailwind.config.js`, `assets/css/tailwind-input.css`, `package.json` — chaîne de build CSS
- `img/` — logo, visuels produits, photos ; `content/` — texte source de l'ancien site (un `.md` par page)
- SEO : `robots.txt`, `sitemap.xml` à la racine ; URLs absolues sur l'URL provisoire `https://techni-fermeture.vercel.app/`

## Gabarit page produit (réutilisable)
Header (nav-solid, dropdown services) → hero intérieur (image + fil d'ariane + H1 + CTA) → section 1 (clair) → section 2 (sombre) → bloc 4 atouts (stone) → section 3 (clair) → bande CTA (inksoft) → footer → sticky CTA mobile.

## Arborescence du site (13 pages)
Accueil · Notre Entreprise · Fenêtres · Volets roulants · Portes d'entrée · Stores / BSO · Portails · Portes de garage · Portes industrielles · Motorisations · SAV Dépannage · Réalisations · Contact

## Infos entreprise clés
- **Tél :** 03 89 64 14 84
- **Mail :** techni.fermetures@orange.fr
- **Adresse :** 2 Rue des Flandres – Village Artisanal Drouot – 68100 MULHOUSE
- **Horaires :** lun–jeu 08h15-12h15 / 13h30-17h15, ven 08h15-12h15
- **Zone :** Haut-Rhin (Mulhouse, Colmar, Saint-Louis, Cernay, Guebwiller, Illzach)

## Décisions importantes
- Méthode de récupération du contenu : **scraping headless** (innerText), car `WebFetch` résumait les paragraphes. Le scrap donne le texte mot pour mot — validé par le client de fait (pas de réécriture imposée à ce stade).
- Les pages produit suivent un **schéma récurrent** (hero → présentation → matériau A → 4 atouts → matériau B/motorisation → CTA) → bon candidat pour un template réutilisable.
