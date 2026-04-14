/* ============================================================
   Jeune Designer Studio — Brief Menu Board v2
   js/data.js — Étapes et champs
   ============================================================ */

const STEPS = [
  {
    id: 'infos', label: 'Infos',
    title: 'Votre <em>établissement</em>',
    sub:   'Pour bien cadrer le projet dès le départ.',
    fields: [
      { id: 'nom',     label: "Nom de l'établissement", type: 'text',   ph: 'Ex : Burger Station', req: true },
      { id: 'type',    label: 'Type de restauration',   type: 'chips',  req: true,
        opts: ['Fast-food','Kebab / Tacos','Burger','Pizza','Asiatique','Sushi','Tex-Mex','Crêperie','Café / Snack'], autre: true },
      { id: 'support', label: 'Type de support',        type: 'chips',  req: true,
        opts: ['Écran TV','Borne tactile','Affiche','Kakémono','Ardoise'], autre: true },
      { id: 'nb',      label: 'Nombre de supports',     type: 'text',   ph: 'Ex : 3 écrans', req: false },
    ],
  },
  {
    id: 'identite', label: 'Identité',
    title: 'Identité <em>visuelle</em>',
    sub:   'Partagez ce que vous avez — même incomplet.',
    fields: [
      { id: 'logo',       label: 'Avez-vous un logo ?',    type: 'chips1', req: true,
        opts: ['Oui, vectoriel','Oui PNG / JPG','Non'], autre: false },
      { id: 'charte',     label: 'Charte graphique ?',     type: 'chips1', req: true,
        opts: ['Complète','Partielle','Aucune'], autre: false },
      { id: 'couleurs',   label: 'Couleurs de la marque',  type: 'text',   ph: 'Ex : rouge #E94560, noir, blanc…', req: false,
        hint: 'Codes HEX ou noms — laissez vide si non défini.' },
      { id: 'up_id',      label: 'Déposer logo / charte',  type: 'upload', req: false },
    ],
  },
  {
    id: 'menu', label: 'Menu',
    title: 'Votre <em>menu</em>',
    sub:   "Un brouillon suffit — plus c'est précis, plus c'est rapide.",
    fields: [
      { id: 'up_menu',  label: 'Déposer votre menu (photo, PDF, Word…)', type: 'upload', req: false },
      { id: 'menu_txt', label: 'Ou décrivez votre menu ici', type: 'area',
        ph: 'Ex :\nBurgers — Classic 7€, Double 9€\nMenus — Solo 11€, Duo 20€\nBoissons — Soda 2€',
        req: false, hint: 'Catégories, produits, prix. Brouillon accepté.' },
      { id: 'nb_cat', label: 'Nombre de catégories', type: 'chips1', req: false,
        opts: ['1–3','4–6','7–10','10+'], autre: false },
    ],
  },
  {
    id: 'style', label: 'Style',
    title: 'Direction <em>artistique</em>',
    sub:   'Quel rendu souhaitez-vous ?',
    fields: [
      { id: 'ambiance', label: 'Ambiance souhaitée', type: 'chips', req: true,
        opts: ['Moderne & épuré','Street / Urbain','Premium','Chaleureux','Coloré & festif','Healthy','Industriel'], autre: true },
      { id: 'priorite', label: 'Ce que vous voulez mettre en avant', type: 'chips', req: true,
        opts: ['Produits phares','Carte complète','Menus','Promos','Photos produits','Prix visibles'], autre: true },
      { id: 'ref', label: 'Références / inspiration', type: 'text',
        ph: 'Ex : style Five Guys, couleurs sombres, minimaliste…', req: false },
      { id: 'couleurs_board', label: 'Couleurs souhaitées pour le board', type: 'text',
        ph: 'Si différent de votre charte', req: false },
    ],
  },
  {
    id: 'details', label: 'Détails',
    title: 'Derniers <em>détails</em>',
    sub:   'On finalise le brief.',
    fields: [
      { id: 'extras', label: 'Infos à afficher sur le board', type: 'chips', req: false,
        opts: ['Horaires','Adresse','Téléphone','Réseaux sociaux','QR Code','Slogan'], autre: true },
      { id: 'delai', label: 'Délai souhaité', type: 'chips1', req: true,
        opts: ['Urgent < 48h','Cette semaine','2 semaines','Pas pressé'], autre: false },
      { id: 'budget', label: 'Budget indicatif', type: 'chips1', req: false,
        opts: ['< 100€','100–300€','300–500€','500€+'], autre: false },
      { id: 'notes', label: 'Remarques / demandes spécifiques', type: 'area',
        ph: 'Couleurs à éviter, produit à valoriser, contraintes particulières…', req: false },
    ],
  },
];
