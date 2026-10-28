// Informations générales du site.
// Les valeurs entre crochets sont provisoires : à remplacer par les contenus validés par LSV.

export const site = {
  name: 'Laboratoire Scientifique de la Voix',
  short: 'LSV',
  tagline: 'Comprendre et prendre soin de votre voix.',
  description:
    'Le Laboratoire Scientifique de la Voix vous accompagne pour comprendre, préserver et améliorer votre voix. Prenez rendez-vous en ligne.',
  contact: {
    adresse: '[Adresse du laboratoire]',
    ville: '[Code postal, ville]',
    acces: '[Accès transports · parking · PMR]',
    telephone: '[01 00 00 00 00]',
    telephoneHref: 'tel:+33100000000',
    email: '[contact@lsv.fr]',
    emailHref: 'mailto:contact@lsv.example',
  },
  horaires: [
    { jours: 'Lundi – vendredi', heures: '[9 h – 19 h]' },
    { jours: 'Samedi', heures: '[Sur rendez-vous]' },
    { jours: 'Dimanche', heures: 'Fermé' },
  ],
  responsable: 'M. Fadi Dahdouh',
};

export type NavItem = { href: string; label: string };

// Menu principal (en-tête)
export const mainNav: NavItem[] = [
  { href: '/services/', label: 'Services' },
  { href: '/la-voix/', label: 'La voix' },
  { href: '/logiciel/', label: 'Logiciel' },
  { href: '/equipe/', label: 'Équipe' },
  { href: '/recherche/', label: 'Recherche' },
  { href: '/partenaires/', label: 'Partenaires' },
  { href: '/actualites/', label: 'Actualités' },
  { href: '/contact/', label: 'Contact' },
];

// Colonnes du pied de page
export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: 'Le laboratoire',
    links: [
      { href: '/', label: 'Accueil' },
      { href: '/equipe/', label: 'Équipe' },
      { href: '/recherche/', label: 'Recherche' },
      { href: '/partenaires/', label: 'Partenaires et témoignages' },
      { href: '/actualites/', label: 'Actualités' },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: '/services/', label: 'Tous les services' },
      { href: '/la-voix/', label: 'Anomalies de la voix' },
      { href: '/logiciel/', label: 'POLYMNIVOX' },
      { href: '/rendez-vous/', label: 'Prendre rendez-vous' },
      { href: '/contact/', label: 'Tarifs, accès et horaires' },
    ],
  },
];

export const legalNav: NavItem[] = [
  { href: '/mentions-legales/', label: 'Mentions légales' },
  { href: '/confidentialite/', label: 'Politique de confidentialité' },
  { href: '/cookies/', label: 'Cookies' },
  { href: '/plan-du-site/', label: 'Plan du site' },
];
