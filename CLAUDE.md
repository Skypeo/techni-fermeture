# CLAUDE.md — Techni Fermetures

## Projet
Refonte du site de **TECHNI FERMETURES**, entreprise de menuiserie à Mulhouse (depuis 1999).
Objectif : transformer une **maquette one page** (refonte validée par le client) en **site complet multi-pages**, en reprenant le **contenu textuel de l'ancien site** (https://www.techni-fermetures.com/) adapté au nouveau design.

## État d'avancement
- ✅ **Contenu textuel récupéré** : les 13 pages de l'ancien site scrapées (verbatim) dans `content/`.
- ✅ **Site complet construit** : 13 pages HTML déclinant le design de la maquette (`index.html`) sur le contenu de l'ancien site.
- ⏳ **Restes éventuels** : page Mentions légales / Vie privée / Cookies (liens présents, pages à créer si besoin) ; formulaire de contact à brancher (back-end) ; remplacer la photo « aluminium » de `fenetres.html` si une meilleure image est fournie.

## Stack technique
HTML statique + **Tailwind CSS (CDN)** + polices Inter/Manrope. Pas de framework, pas de build. Hébergeable partout (Vercel, OVH…).

## Design system (défini dans assets/js/tailwind-config.js + assets/css/site.css)
- Couleurs : `ink` #0F1419, `inksoft` #1A2128, `accent` #C00000 (rouge), `teal` #2D5547, `bone` #FAFAF7, `stone` #F4F1EA, `slate2` #5A6470
- Titres **Manrope**, texte **Inter**. Coins arrondis, ombres `soft`/`lift`, animations `.reveal` au scroll.

## Fichiers principaux
- `index.html` — accueil (maquette validée, allégée, **hero vidéo `hero-animation.mp4` conservée**)
- Pages produit : `fenetres.html`, `volets-roulants.html`, `portes-d-entree.html`, `stores-bso.html`, `portails.html`, `portes-de-garage.html`, `portes-industrielles.html`, `motorisations.html`, `sav-depannage.html`
- `notre-entreprise.html`, `realisations.html`, `contact.html`
- `assets/css/site.css`, `assets/js/site.js`, `assets/js/tailwind-config.js` — design system partagé par toutes les pages
- `img/` — logo, visuels produits, photos ; `content/` — texte source de l'ancien site (un `.md` par page)

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
