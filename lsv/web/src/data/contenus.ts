// Contenus provisoires (lorem, textes de la maquette).
// Les textes définitifs seront fournis et validés par LSV.
import type { ImageMetadata } from 'astro';
import actu1 from '../assets/provisoire/actu-1.jpg';
import actu2 from '../assets/provisoire/actu-2.jpg';
import actu3 from '../assets/provisoire/actu-3.jpg';
import portrait1 from '../assets/provisoire/portrait-1.jpg';
import portrait2 from '../assets/provisoire/portrait-2.jpg';
import portrait3 from '../assets/provisoire/portrait-3.jpg';
import portrait4 from '../assets/provisoire/portrait-4.jpg';

export const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae lacus non magna faucibus tincidunt. Sed eget arcu at nibh posuere laoreet.';
export const LOREM_COURT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

/* ---------- Services ----------
   Le champ `prestation` doit rester identique aux valeurs acceptées par l'API (/api/rdv). */
export type Service = {
  slug: string;
  num: string;
  titre: string;
  prestation: string;
  resume: string;
  pourQui: string[];
  deroulement: { etape: string; detail: string }[];
  duree: string;
  tarif: string;
};

export const services: Service[] = [
  {
    slug: 'bilan-vocal',
    num: '01',
    titre: 'Bilan vocal',
    prestation: 'Bilan vocal',
    resume:
      'Écoute, observation et analyse de votre voix pour comprendre son fonctionnement et ses points de fragilité.',
    pourQui: ['Toute personne gênée par sa voix', 'Avant un accompagnement', 'Suivi dans le temps'],
    deroulement: [
      { etape: 'Entretien', detail: LOREM_COURT },
      { etape: 'Enregistrement et mesures', detail: LOREM_COURT },
      { etape: 'Restitution', detail: LOREM_COURT },
    ],
    duree: '[60 min]',
    tarif: '[xx €]',
  },
  {
    slug: 'accompagnement-vocal',
    num: '02',
    titre: 'Accompagnement vocal',
    prestation: 'Accompagnement vocal',
    resume: 'Séances personnalisées pour retrouver confort, souffle et aisance dans la parole.',
    pourQui: ['Voix fatiguée ou tendue', 'Après un bilan vocal', 'Prise de parole difficile'],
    deroulement: [
      { etape: 'Objectifs', detail: LOREM_COURT },
      { etape: 'Exercices guidés', detail: LOREM_COURT },
      { etape: 'Point d’étape', detail: LOREM_COURT },
    ],
    duree: '[45 min par séance]',
    tarif: '[xx € la séance]',
  },
  {
    slug: 'voix-professionnelle',
    num: '03',
    titre: 'Voix professionnelle',
    prestation: 'Voix professionnelle',
    resume: 'Chanteurs, enseignants, comédiens, conférenciers : tenir dans la durée sans se fatiguer.',
    pourQui: ['Enseignants', 'Chanteurs et comédiens', 'Conférenciers et commerciaux'],
    deroulement: [
      { etape: 'Analyse de l’usage vocal', detail: LOREM_COURT },
      { etape: 'Plan de prévention', detail: LOREM_COURT },
      { etape: 'Suivi', detail: LOREM_COURT },
    ],
    duree: '[60 min]',
    tarif: '[xx €]',
  },
  {
    slug: 'ateliers-hygiene-vocale',
    num: '04',
    titre: 'Ateliers d’hygiène vocale',
    prestation: 'Atelier d’hygiène vocale',
    resume: 'Conseils pratiques et exercices simples pour les équipes, écoles et associations.',
    pourQui: ['Équipes en entreprise', 'Écoles et universités', 'Associations'],
    deroulement: [
      { etape: 'Échange sur les besoins', detail: LOREM_COURT },
      { etape: 'Atelier collectif', detail: LOREM_COURT },
      { etape: 'Fiche de conseils', detail: LOREM_COURT },
    ],
    duree: '[2 h]',
    tarif: '[Sur devis]',
  },
];

/* ---------- Anomalies de la voix (contenu pédagogique, sans diagnostic) ---------- */
export const anomalies = [
  { titre: 'Dysphonie', texte: 'Voix rauque, voilée ou irrégulière, qui change de timbre.' },
  { titre: 'Voix cassée', texte: 'Ruptures soudaines, sons qui « sautent » en parlant ou en chantant.' },
  { titre: 'Extinction de voix', texte: 'Perte partielle ou totale de la voix, souvent après un effort ou une infection.' },
  { titre: 'Fatigue vocale', texte: 'Gorge tendue, voix qui s’épuise en fin de journée.' },
  { titre: 'Voix tremblante', texte: 'Instabilité, manque de souffle ou de contrôle, notamment sous le stress.' },
  { titre: 'Voix des professionnels', texte: 'Prévention du surmenage vocal chez ceux qui parlent beaucoup.' },
];

/* ---------- Équipe ---------- */
export type Membre = { nom: string; role: string; bio: string; photo: ImageMetadata; initiales: string };
export const equipe: Membre[] = [
  { nom: 'M. Fadi Dahdouh', role: 'Ostéopathe, fondateur et dirigeant', bio: LOREM, photo: portrait1, initiales: 'FD' },
  { nom: '[Prénom Nom]', role: '[Fonction]', bio: LOREM, photo: portrait2, initiales: 'PN' },
  { nom: '[Prénom Nom]', role: '[Fonction]', bio: LOREM, photo: portrait3, initiales: 'PN' },
  { nom: '[Prénom Nom]', role: '[Fonction]', bio: LOREM, photo: portrait4, initiales: 'PN' },
];

/* ---------- Recherche ---------- */
export const axesRecherche = [
  { titre: 'Biomarqueurs acoustiques', texte: 'Indices mesurables extraits du signal vocal. ' + LOREM_COURT },
  { titre: 'Mesure standardisée', texte: 'Protocoles d’enregistrement comparables dans le temps. ' + LOREM_COURT },
  { titre: 'Suivi longitudinal', texte: 'Observer l’évolution d’une voix séance après séance. ' + LOREM_COURT },
];
export const publications = [
  { annee: '[2026]', titre: '[Titre de la publication]', support: '[Revue ou conférence]', lien: '' },
  { annee: '[2025]', titre: '[Titre de la publication]', support: '[Revue ou conférence]', lien: '' },
  { annee: '[2025]', titre: '[Titre de l’intervention]', support: '[Événement]', lien: '' },
];

/* ---------- Partenaires et témoignages ---------- */
export const partenaires = [
  { nom: '[Partenaire 1]', type: 'Établissement de santé' },
  { nom: '[Partenaire 2]', type: 'École de musique' },
  { nom: '[Partenaire 3]', type: 'Association' },
  { nom: '[Partenaire 4]', type: 'Entreprise' },
  { nom: '[Partenaire 5]', type: 'Université' },
  { nom: '[Partenaire 6]', type: 'Conservatoire' },
];
// Témoignage nominatif = consentement écrit obligatoire, aucune donnée de santé identifiante.
export const temoignages = [
  { texte: LOREM, auteur: '[Prénom N.]', contexte: '[Enseignante]' },
  { texte: LOREM, auteur: '[Prénom N.]', contexte: '[Chanteur]' },
  { texte: LOREM, auteur: '[Prénom N.]', contexte: '[Conférencière]' },
];

/* ---------- Actualités ----------
   Structure proposée pour le contrat /api/actus avec le Dev 2 :
   { slug, titre, categorie, date (AAAA-MM-JJ), lecture, resume, image, contenu[] } */
export type Actu = {
  slug: string;
  titre: string;
  categorie: string;
  date: string;
  lecture: string;
  resume: string;
  image: ImageMetadata;
  contenu: string[];
};
export const actus: Actu[] = [
  {
    slug: 'gestes-simples-menager-sa-voix',
    titre: '5 gestes simples pour ménager sa voix',
    categorie: 'Conseil',
    date: '2026-10-20',
    lecture: '4 min',
    resume: 'Hydratation, pauses, posture : les bases de l’hygiène vocale.',
    image: actu1,
    contenu: [LOREM, LOREM, LOREM],
  },
  {
    slug: 'pourquoi-voix-fatigue-le-soir',
    titre: 'Pourquoi ma voix se fatigue-t-elle le soir ?',
    categorie: 'Comprendre',
    date: '2026-10-06',
    lecture: '6 min',
    resume: 'Ce qui se passe dans le larynx et comment l’éviter.',
    image: actu2,
    contenu: [LOREM, LOREM, LOREM],
  },
  {
    slug: 'atelier-voix-prise-de-parole',
    titre: 'Atelier voix et prise de parole',
    categorie: 'Événement',
    date: '2026-09-22',
    lecture: '2 min',
    resume: 'Une séance collective pour gagner en confiance et en projection.',
    image: actu3,
    contenu: [LOREM, LOREM],
  },
];

export const formatDate = (iso: string) =>
  new Date(iso + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
