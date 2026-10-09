/* The examples the site ships with. The pharmacies, the people and the orders
   are made up: no shop by these names at these addresses is meant, and the
   prices are examples. Every moment is kept as "so many minutes ago", so the
   examples never go stale. */

import type { Category, Medicine, Order, Person, Pharmacy, Review, Stock, Supplier, World } from './types';
import { stockId } from './types';

const pharmacy = (id: string, name: string, pharmacist: string, district: string, hood: string, address: string, lat: number, lng: number, delivers: boolean, slot: number, note: string): Pharmacy => ({
  id,
  name,
  pharmacist,
  district,
  hood,
  address,
  phone: null,
  lat,
  lng,
  delivers,
  slot,
  note,
  photo: { src: `/shops/${id}.jpg`, w: 1600, h: 1000 },
  sample: true,
});

export const PHARMACIES: Pharmacy[] = [
  pharmacy('derman', 'Derman Eczanesi', 'Selin Aydın', 'Kadıköy', 'Moda', 'Moda Caddesi 112', 40.9812, 29.0263, true, 0, 'Twenty-two years on the same corner. We bring orders on foot as far as the tea garden.'),
  pharmacy('cinar', 'Çınar Eczanesi', 'Murat Kaya', 'Kadıköy', 'Yeldeğirmeni', 'Karakolhane Caddesi 41', 40.9945, 29.0262, false, 1, 'Small shop, long counter. Ask for what you cannot see: most of it is in the back.'),
  pharmacy('sifa', 'Şifa Eczanesi', 'Ayşe Demir', 'Kadıköy', 'Bostancı', 'Bağdat Caddesi 498', 40.9565, 29.0935, true, 2, 'Two pharmacists on every shift, and a courier until midnight on our watch nights.'),
  pharmacy('lale', 'Lale Eczanesi', 'Emre Şahin', 'Üsküdar', 'Kuzguncuk', 'İcadiye Caddesi 27', 41.0356, 29.0297, false, 3, 'Under the plane trees, three doors up from the ferry road.'),
  pharmacy('umut', 'Umut Eczanesi', 'Zeynep Çelik', 'Üsküdar', 'Mimar Sinan', 'Hakimiyet-i Milliye Caddesi 60', 41.0245, 29.0165, true, 0, 'Across from the bus stops. Baby shelf restocked every Monday.'),
  pharmacy('yildiz', 'Yıldız Eczanesi', 'Can Öztürk', 'Beşiktaş', 'Sinanpaşa', 'Ortabahçe Caddesi 18', 41.0432, 29.0058, true, 1, 'In the market streets. We keep orders at the counter for a day.'),
  pharmacy('gunes', 'Güneş Eczanesi', 'Elif Yılmaz', 'Beşiktaş', 'Arnavutköy', 'Bebek Arnavutköy Caddesi 64', 41.068, 29.043, false, 2, 'On the shore road. Ring the bell on watch nights: the door is kept locked after eleven.'),
  pharmacy('hayat', 'Hayat Eczanesi', 'Burak Tekin', 'Beyoğlu', 'Cihangir', 'Sıraselviler Caddesi 85', 41.0328, 28.9838, true, 3, 'Open since 1987. The night hatch is on the side street.'),
  pharmacy('merkez', 'Merkez Eczanesi', 'Fatma Koç', 'Fatih', 'Balat', 'Vodina Caddesi 33', 41.0296, 28.9489, false, 0, 'Between the two churches. We read prescriptions out loud if you ask.'),
  pharmacy('saglik', 'Sağlık Eczanesi', 'Kerem Aksoy', 'Şişli', 'Teşvikiye', 'Valikonağı Caddesi 71', 41.0518, 28.993, true, 1, 'A wide shelf of skin care, and somebody who knows it.'),
  pharmacy('deniz', 'Deniz Eczanesi', 'Seda Polat', 'Bakırköy', 'Yeşilköy', 'İstasyon Caddesi 22', 40.9597, 28.8262, false, 2, 'Five minutes from the station. Closest watch to the airport road.'),
  pharmacy('celik', 'Çelik Eczanesi', 'Onur Çelik', 'Sarıyer', 'Emirgan', 'Muvakkithane Caddesi 9', 41.1043, 29.0553, true, 3, 'Up the hill from the grove. We deliver along the shore as far as İstinye.'),
];

const medicine = (id: string, name: string, form: string, category: Category, about: string, warning: string): Medicine => ({
  id,
  name,
  form,
  category,
  about,
  warning,
  photo: { src: `/shelf/${id}.jpg`, w: 1024, h: 1024 },
  sample: true,
});

const ASK = 'Ask the pharmacist if you are pregnant, breastfeeding or taking other medicines.';

export const MEDICINES: Medicine[] = [
  medicine('paracetamol', 'Paracetamol 500 mg', '20 tablets', 'pain', 'For a headache, a fever or the aches of a cold.', `Do not take it with anything else that contains paracetamol. ${ASK}`),
  medicine('ibuprofen', 'Ibuprofen 400 mg', '20 tablets', 'pain', 'For pain with swelling: a sprain, a toothache, a sore back.', `Take it with food. Not for anybody with a stomach ulcer or asthma that painkillers set off. ${ASK}`),
  medicine('diclofenac-gel', 'Diclofenac gel 1%', '50 g', 'pain', 'Rubbed into a sore joint or a pulled muscle.', 'For skin that is whole. Wash your hands after using it, and keep it away from the eyes.'),
  medicine('saline-spray', 'Saline nasal spray', '30 ml', 'cold', 'Salt water for a blocked or dry nose. Safe to use often.', 'One bottle to one person.'),
  medicine('lozenges', 'Throat lozenges, honey and lemon', '24 lozenges', 'cold', 'To soothe a sore throat.', 'Not for children under six: a lozenge can be choked on.'),
  medicine('ivy-syrup', 'Ivy leaf cough syrup', '100 ml', 'cold', 'For a cough that brings something up.', `See a doctor about a cough that lasts more than a week. ${ASK}`),
  medicine('vitamin-d', 'Vitamin D3 1000 IU', '20 ml drops', 'vitamins', 'For the months with little sun.', 'More is not better: keep to the amount on the label.'),
  medicine('vitamin-c', 'Vitamin C 1000 mg', '20 effervescent tablets', 'vitamins', 'One tablet in a glass of water.', 'Can upset the stomach if it is taken without food.'),
  medicine('magnesium', 'Magnesium 375 mg', '30 tablets', 'vitamins', 'Often taken for cramp in the legs at night.', `Can loosen the bowels. ${ASK}`),
  medicine('b12', 'Vitamin B12 1000 mcg', '30 tablets', 'vitamins', 'For those who eat little or no meat.', ASK),
  medicine('omega-3', 'Omega-3 fish oil', '60 capsules', 'vitamins', 'Fish oil, for those who eat little fish.', 'Not for anybody allergic to fish. Tell your doctor if you take a blood thinner.'),
  medicine('dexpanthenol', 'Dexpanthenol cream 5%', '30 g', 'skin', 'For skin that is dry, chapped or rubbed sore.', 'For the skin only.'),
  medicine('sunscreen', 'Sunscreen SPF 50', '50 ml', 'skin', 'For the face and the body. Put it on again every two hours in the sun.', 'Keep it out of the eyes. Not a reason to stay in the sun for longer.'),
  medicine('antiseptic', 'Antiseptic solution', '100 ml', 'firstaid', 'To clean a cut or a graze before it is covered.', 'For the skin only. Not for deep or dirty wounds: have those seen.'),
  medicine('infant-syrup', 'Infant paracetamol syrup 120 mg / 5 ml', '100 ml', 'baby', 'For fever and pain in babies and children.', 'The amount goes by weight: ask the pharmacist to work it out with you. Do not give it with anything else that contains paracetamol.'),
  medicine('nappy-cream', 'Zinc oxide nappy cream', '100 g', 'baby', 'A barrier against nappy rash.', 'See a doctor about a rash that has not eased in three days.'),
  medicine('rehydration', 'Oral rehydration salts', '10 sachets', 'baby', 'To replace water and salts lost through vomiting or diarrhoea.', 'Mix each sachet with the amount of water on the label, no more and no less.'),
  medicine('plasters', 'Plasters, assorted', '20 plasters', 'firstaid', 'Four sizes, for small cuts.', 'Change a plaster that has got wet.'),
  medicine('knee-support', 'Elastic knee support', 'One, medium', 'firstaid', 'Holds the knee firm on the stairs and on a walk.', 'Too tight is worse than none: it should not leave a mark.'),
  medicine('thermometer', 'Digital thermometer', 'One', 'firstaid', 'Reads in about ten seconds, under the arm or under the tongue.', 'Wipe it clean before and after.'),
  medicine('toothpaste', 'Fluoride toothpaste', '75 ml', 'mouth', 'For adults and for children over six.', 'A pea-sized amount for a child, and it is not to be swallowed.'),
  medicine('eye-drops', 'Lubricating eye drops', '10 ml', 'mouth', 'For eyes that are dry or tired.', 'Use the bottle within a month of opening it. See a doctor about an eye that is red and sore.'),
];

const PRICE: Record<string, number> = {
  paracetamol: 48,
  ibuprofen: 86,
  'diclofenac-gel': 132,
  'saline-spray': 95,
  lozenges: 74,
  'ivy-syrup': 158,
  'vitamin-d': 145,
  'vitamin-c': 118,
  magnesium: 210,
  b12: 176,
  'omega-3': 320,
  dexpanthenol: 124,
  sunscreen: 385,
  antiseptic: 66,
  'infant-syrup': 72,
  'nappy-cream': 168,
  rehydration: 92,
  plasters: 54,
  'knee-support': 410,
  thermometer: 265,
  toothpaste: 98,
  'eye-drops': 188,
};

/* Which pharmacy keeps what, and for how much. It is worked out from the
   names, so that it is the same on every machine and never has to be typed. */
const mix = (text: string) => [...text].reduce((sum, letter) => (sum * 31 + letter.charCodeAt(0)) % 9973, 7);

export const SHELF: Stock[] = PHARMACIES.flatMap((shop) =>
  MEDICINES.filter((item) => mix(shop.id + item.id) % 5 !== 0).map((item) => {
    const roll = mix(item.id + shop.id);
    return { id: stockId(shop.id, item.id), pharmacyId: shop.id, medicineId: item.id, price: Math.round((PRICE[item.id] * (94 + (roll % 13))) / 100), count: roll % 9 === 0 ? 0 : 3 + (roll % 22) };
  }),
);

const review = (id: string, pharmacyId: string, by: string, rating: number, days: number, text: string): Review => ({ id, pharmacyId, by, rating, text, at: 0, ago: { min: days * 1440 + 95 }, sample: true });

export const REVIEWS: Review[] = [
  review('rv-01', 'derman', 'Ece', 5, 2, 'Rang the bell at two in the morning for a child with a fever. She had the syrup on the counter before I had finished the sentence.'),
  review('rv-02', 'derman', 'Tolga', 4, 9, 'Order was ready when I got there. The street door is easy to miss in the dark.'),
  review('rv-03', 'cinar', 'Melis', 5, 4, 'He asked what else I was taking before he sold me anything. That is the job.'),
  review('rv-04', 'sifa', 'Okan', 4, 6, 'The courier came in twenty minutes. One item was out and they rang to say so first.'),
  review('rv-05', 'yildiz', 'Derya', 5, 3, 'Kept my order until the next morning without being asked twice.'),
  review('rv-06', 'hayat', 'Cem', 5, 12, 'The night hatch is round the side, as it says. Quick and kind.'),
  review('rv-07', 'umut', 'Nur', 4, 7, 'Everything for the baby in one place, and somebody who has clearly had one.'),
  review('rv-08', 'saglik', 'İpek', 5, 5, 'Talked me out of the expensive cream and into the plain one.'),
  review('rv-09', 'merkez', 'Hasan', 5, 15, 'She read the leaflet to my mother, slowly, twice.'),
  review('rv-10', 'celik', 'Aylin', 4, 10, 'Delivered to İstinye in the rain. The bag was dry.'),
];

/* The accounts behind the demonstration. Signing in as one of them is one
   press, and none has a password. */
export const PEOPLE: Person[] = [
  { id: 'p-selin', name: 'Selin Aydın', email: 'selin@derman.example', role: 'pharmacist', pharmacyId: 'derman', made: 0 },
  { id: 'p-deniz', name: 'Deniz Arslan', email: 'deniz@nobet.example', role: 'admin', made: 0 },
  { id: 'p-ece', name: 'Ece Kara', email: 'ece@example.test', role: 'customer', made: 0 },
  { id: 'p-tolga', name: 'Tolga Er', email: 'tolga@example.test', role: 'customer', made: 0 },
  { id: 'p-melis', name: 'Melis Uçar', email: 'melis@example.test', role: 'customer', made: 0 },
];
export const DEMO = { customer: 'p-ece', pharmacist: 'p-selin', admin: 'p-deniz' } as const;

const line = (medicineId: string, qty: number, pharmacyId: string) => {
  const item = MEDICINES.find((entry) => entry.id === medicineId)!;
  const price = SHELF.find((entry) => entry.id === stockId(pharmacyId, medicineId))?.price ?? PRICE[medicineId];
  return { medicineId, name: item.name, form: item.form, price, qty };
};

function order(id: string, pharmacyId: string, customer: Person, minutes: number, state: Order['state'], mode: Order['mode'], lines: [string, number][], note: string | null, path: [Order['state'], number][]): Order {
  const made = lines.map(([medicineId, qty]) => line(medicineId, qty, pharmacyId));
  return {
    id,
    pharmacyId,
    customer: customer.id,
    name: customer.name,
    phone: '0500 000 00 00',
    mode,
    address: mode === 'deliver' ? 'Şair Nefi Sokak 14, flat 3, Moda' : null,
    note,
    lines: made,
    total: made.reduce((sum, entry) => sum + entry.price * entry.qty, 0),
    state,
    at: 0,
    ago: { min: minutes },
    steps: path.map(([step, min]) => ({ state: step, at: 0, ago: { min } })),
    sample: true,
  };
}

const [, , ece, tolga, melis] = PEOPLE;

export const ORDERS: Order[] = [
  order('NB-4821', 'derman', ece, 14, 'placed', 'collect', [['infant-syrup', 1], ['thermometer', 1]], 'The baby is eight months old. I will be there in twenty minutes.', [['placed', 14]]),
  order('NB-4817', 'derman', tolga, 52, 'ready', 'collect', [['ibuprofen', 1], ['diclofenac-gel', 1]], null, [['placed', 52], ['accepted', 47], ['ready', 31]]),
  order('NB-4809', 'derman', melis, 96, 'out', 'deliver', [['vitamin-d', 1], ['magnesium', 2], ['plasters', 1]], 'The bell does not work. Please ring me.', [['placed', 96], ['accepted', 90], ['ready', 71], ['out', 22]]),
  order('NB-4788', 'derman', ece, 1530, 'done', 'collect', [['saline-spray', 2], ['lozenges', 1]], null, [['placed', 1530], ['accepted', 1522], ['ready', 1505], ['done', 1471]]),
  order('NB-4760', 'derman', tolga, 4410, 'done', 'deliver', [['sunscreen', 1], ['dexpanthenol', 1]], null, [['placed', 4410], ['accepted', 4398], ['ready', 4370], ['out', 4352], ['done', 4318]]),
  order('NB-4731', 'sifa', melis, 2890, 'done', 'deliver', [['omega-3', 1]], null, [['placed', 2890], ['accepted', 2881], ['ready', 2860], ['out', 2851], ['done', 2822]]),
  order('NB-4702', 'yildiz', ece, 7300, 'cancelled', 'collect', [['knee-support', 1]], null, [['placed', 7300], ['cancelled', 7281]]),
];

export const SUPPLIERS: Supplier[] = [
  { id: 'sp-01', name: 'Marmara Ecza Deposu', city: 'İstanbul', supplies: 'Medicines, the whole range', since: 2019, active: true, sample: true },
  { id: 'sp-02', name: 'Boğaziçi Medikal', city: 'İstanbul', supplies: 'Supports, thermometers, dressings', since: 2021, active: true, sample: true },
  { id: 'sp-03', name: 'Anadolu Vitamin', city: 'Bursa', supplies: 'Vitamins and supplements', since: 2022, active: true, sample: true },
  { id: 'sp-04', name: 'Ege Dermo', city: 'İzmir', supplies: 'Skin care', since: 2020, active: false, sample: true },
  { id: 'sp-05', name: 'Bebe Ecza', city: 'Ankara', supplies: 'Baby care', since: 2023, active: true, sample: true },
];

/** The examples, as one world. */
export const SEED: World = { pharmacies: PHARMACIES, medicines: MEDICINES, shelf: SHELF, orders: ORDERS, reviews: REVIEWS, suppliers: SUPPLIERS, people: PEOPLE };

export const pharmacyPath = (id: string) => `/pharmacies/${id}/`;
export const medicinePath = (id: string) => `/medicines/${id}/`;
export const orderPath = (id: string) => `/orders/${id.toLowerCase()}/`;
