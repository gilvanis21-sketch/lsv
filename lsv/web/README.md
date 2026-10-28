# Site public LSV (front, Dev 1)

Site statique construit avec [Astro](https://astro.build). Le HTML est généré à la construction, servi par Caddy ; le formulaire parle à l'API Express existante (`/api/rdv`). Aucun serveur Node supplémentaire en production.

## Commandes

```bash
cd lsv/web
npm install
npm run dev        # http://localhost:4321, rechargement automatique
npm run build      # génère dist/ (SITE_URL=https://www.domaine.fr npm run build pour le sitemap)
npm run preview    # sert dist/ en local
```

En dev, les appels `/api/*` ne passent pas par Caddy : lancer l'API à côté et, si besoin, ajouter un proxy Vite dans `astro.config.mjs` (`vite.server.proxy`).

En production, rien à faire à la main : `docker compose up -d --build` construit le site (étape Node) puis l'embarque dans l'image Caddy (`web/Dockerfile`).

## Structure

```
src/
  layouts/      BaseLayout, PageLayout, NarrowLayout, ArticleLayout  ← gabarits à réutiliser
  components/   Header, Footer, Logo, Breadcrumbs, PageHero, Section, Card, NewsCard,
                Note, CtaBand, Field, RdvForm, VideoPlayer
  data/
    site.ts       nom, coordonnées, horaires, menu et liens du pied de page
    contenus.ts   services, anomalies, équipe, recherche, partenaires, actualités (provisoires)
  pages/        une page = un fichier (services/[slug] et actualites/[slug] générés depuis les données)
  scripts/      main.ts (menu, animations), rdv-form.ts (formulaire)
  styles/       global.css (tokens de couleur, thème sombre, toutes les classes)
  assets/provisoire/   images temporaires, optimisées automatiquement (WebP, plusieurs tailles)
public/media/   vidéo et sous-titres provisoires
```

## Pages

Accueil, Services (+ 1 page par service), La voix, Logiciel (POLYMNIVOX), Équipe, Recherche, Partenaires et témoignages, Actualités (+ 1 page par article), Contact (accès, horaires, tarifs), Rendez-vous, Mentions légales, Confidentialité, Cookies, Plan du site, 404. Catalogue interne des composants : `/gabarits/` (non référencé).

## Remplacer les contenus provisoires

- Textes, coordonnées, horaires, tarifs : `src/data/site.ts` et `src/data/contenus.ts` (tout ce qui est entre crochets ou en lorem).
- Images : remplacer les fichiers de `src/assets/provisoire/` (ou en ajouter et changer l'import). Astro génère les tailles et le WebP.
- Vidéo : remplacer `public/media/presentation-provisoire.mp4` et le `.vtt` (sous-titres obligatoires pour l'accessibilité). Encoder en H.264, `-movflags +faststart`.
- Menu et pied de page : `mainNav`, `footerNav`, `legalNav` dans `src/data/site.ts`.

## Formulaire de rendez-vous ↔ API

`POST /api/rdv`, JSON :

```json
{ "prenom": "", "nom": "", "email": "", "tel": "", "prestation": "Bilan vocal",
  "date": "AAAA-MM-JJ", "plage": "Matin", "consent": "on", "site": "" }
```

- `consent` vaut exactement `"on"` (le schéma zod attend `z.literal('on')`).
- `site` est le pot de miel anti-robots : vide pour un humain.
- `prestation` et `plage` doivent rester identiques aux enums de `api/server.js`. Les valeurs côté front viennent de `services[].prestation` dans `contenus.ts` : **si on modifie l'un, modifier l'autre**.
- Réponses gérées : 201 (succès), 204 (pot de miel, affiché comme succès), 400, 429, 5xx, coupure réseau, délai de 15 s.
- Présélection depuis une page service : `/rendez-vous/?prestation=Bilan%20vocal`.

## Pour le Dev 2 (espace membre, back-office)

- Pages membres : `PageLayout` ou `NarrowLayout` avec `noindex`. Exemple complet de page de connexion sur `/gabarits/`.
- Champs : composant `Field` (libellé, aide et erreur reliés). Pour afficher une erreur : écrire dans `#<id>-err` et poser `aria-invalid="true"`, comme dans `scripts/rdv-form.ts`.
- Vidéos protégées : `VideoPlayer` accepte n'importe quelle `src`, y compris une URL signée renvoyée par `/api/videos`.
- Actualités : format proposé pour `/api/actus`, identique au type `Actu` de `contenus.ts` :
  `{ slug, titre, categorie, date, lecture, resume, image, contenu[] }`. `ArticleLayout` et `NewsCard` l'affichent déjà.
- Exclure les pages membres du sitemap : compléter le `filter` dans `astro.config.mjs`.

## Pour le Dev 3 (boutique, sécurité)

- Le site ne contient **aucun script ni style en ligne** (hors données JSON-LD, non exécutées) : `'unsafe-inline'` peut être retiré de `script-src` et `style-src` dans la CSP du `Caddyfile`. À vérifier après chaque ajout (Turnstile, Stripe, mesure d'audience).
- Polices auto-hébergées (`@fontsource-variable/manrope`) : plus d'appel à Google Fonts.
- `axe-core` est installé en dépendance de dev pour les tests d'accessibilité automatiques.

## Vérifications faites

- Formulaire testé de bout en bout (Chromium) contre l'API et PostgreSQL, données fictives uniquement.
- axe-core (WCAG 2.1 AA) : 0 violation sur les pages testées, thème clair et sombre.
- Aucun lien interne cassé, aucune erreur console, pas de défilement horizontal à 390 px.
- Accueil mobile au premier affichage : environ 83 ko, la vidéo n'est téléchargée qu'au clic.
