export const collections = [
  {
    slug: 'classic',
    name: 'Classic',
    eyebrow: 'Everyday heritage',
    headline: 'Soft classics for graceful routines',
    description:
      'Cotton sarees, easy suits, and kurta sets shaped for workdays, visits, and unhurried afternoons.',
    longDescription:
      'Classic is PaaN at its most essential: breathable fabrics, familiar silhouettes, and details that feel rooted without becoming ceremonial.',
    accent: 'sage',
    mood: 'Light cottons, subtle borders, familiar Indian silhouettes',
    heroNote: 'Simple pieces with heirloom ease',
  },
  {
    slug: 'premium',
    name: 'Premium',
    eyebrow: 'Refined craft',
    headline: 'Elevated textures for festive days',
    description:
      'A richer edit of woven finishes, deeper colors, and polished sets for pujas, dinners, and family gatherings.',
    longDescription:
      'Premium keeps the mood elegant and wearable, pairing craft-led surfaces with silhouettes that move easily through the day.',
    accent: 'gold',
    mood: 'Woven accents, tonal embroidery, polished drapes',
    heroNote: 'Occasion-ready, never overdone',
  },
  {
    slug: 'exclusive',
    name: 'Exclusive',
    eyebrow: 'Limited stories',
    headline: 'Small-batch pieces with a collector spirit',
    description:
      'Distinctive sarees, statement dupattas, and considered kurta sets created in limited runs.',
    longDescription:
      'Exclusive is designed for women who love subtle distinction: thoughtful palettes, rare motifs, and a calmer kind of statement.',
    accent: 'madder',
    mood: 'Limited motifs, quiet statement colors, hand-finished details',
    heroNote: 'Rare pieces for repeat wear',
  },
]

export const products = [
  {
    id: 'classic-01',
    collection: 'classic',
    name: 'Neem Border Cotton Saree',
    category: 'Saree',
    fabric: 'Handloom cotton',
    tone: 'leaf',
    price: 'Sample Rs. 2,890',
    craftNote: 'Handwoven by artisans in Bengal.',
    occasion: 'Everyday routines and quiet afternoons.',
    description: 'A breathable staple with subtle borders.'
  },
  {
    id: 'classic-02',
    collection: 'classic',
    name: 'Ivory Everyday Kurta Set',
    category: 'Kurta Set',
    fabric: 'Cotton slub',
    tone: 'cream',
    price: 'Sample Rs. 2,450',
    craftNote: 'Tailored for relaxed fit.',
    occasion: 'Workdays and casual visits.',
    description: 'An effortless silhouette for easy movement.'
  },
  {
    id: 'classic-03',
    collection: 'classic',
    name: 'Sage Straight Suit',
    category: 'Suit',
    fabric: 'Cotton blend',
    tone: 'sage',
    price: 'Sample Rs. 3,100',
    craftNote: 'Finished with minimal tonal stitching.',
    occasion: 'Morning engagements.',
    description: 'Graceful drape meeting daily comfort.'
  },
  {
    id: 'premium-01',
    collection: 'premium',
    name: 'Tara Woven Saree',
    category: 'Saree',
    fabric: 'Silk cotton',
    tone: 'gold',
    price: 'Sample Rs. 5,800',
    craftNote: 'Intricate zari motifs.',
    occasion: 'Festivals and pujas.',
    description: 'A richer weave with heritage details.'
  },
  {
    id: 'premium-02',
    collection: 'premium',
    name: 'Mehfil Embroidered Suit',
    category: 'Suit',
    fabric: 'Viscose silk',
    tone: 'deep-green',
    price: 'Sample Rs. 4,950',
    craftNote: 'Subtle hand embroidery on the yoke.',
    occasion: 'Evening dinners and family gatherings.',
    description: 'Polished elegance for special moments.'
  },
  {
    id: 'premium-03',
    collection: 'premium',
    name: 'Pista Festive Kurta Set',
    category: 'Kurta Set',
    fabric: 'Chanderi blend',
    tone: 'pista',
    price: 'Sample Rs. 4,250',
    craftNote: 'Delicate chanderi borders.',
    occasion: 'Celebratory days.',
    description: 'Lightweight feel with an elevated presence.'
  },
  {
    id: 'exclusive-01',
    collection: 'exclusive',
    name: 'Madder Motif Saree',
    category: 'Saree',
    fabric: 'Linen silk',
    tone: 'madder',
    price: 'Sample Rs. 7,200',
    craftNote: 'Limited run archival motif revival.',
    occasion: 'Collector’s wardrobe pieces.',
    description: 'A distinctive statement rooted in rare craft.'
  },
  {
    id: 'exclusive-02',
    collection: 'exclusive',
    name: 'Betel Leaf Dupatta Set',
    category: 'Kurta Set',
    fabric: 'Fine cotton silk',
    tone: 'leaf',
    price: 'Sample Rs. 6,100',
    craftNote: 'Hand-finished edging.',
    occasion: 'Intimate celebrations.',
    description: 'A calm, considered aesthetic for repeat wear.'
  },
  {
    id: 'exclusive-03',
    collection: 'exclusive',
    name: 'Noor Panelled Suit',
    category: 'Suit',
    fabric: 'Modal silk',
    tone: 'ink',
    price: 'Sample Rs. 6,850',
    craftNote: 'Precision paneling for movement.',
    occasion: 'Signature events.',
    description: 'Sophisticated lines with deep, enduring color.'
  },
]

export const founderNotes = [
  'PaaN began with the idea that heritage clothing can be part of ordinary, beautiful days.',
  'The pieces are imagined for women who want comfort, craft, and quiet presence without waiting for a grand occasion.',
]

export function getCollectionBySlug(slug) {
  return collections.find((collection) => collection.slug === slug)
}

export function getProductsByCollection(slug) {
  return products.filter((product) => product.collection === slug)
}
