/* Istanbul, as far as the site needs it: the districts a pharmacy can be in,
   roughly where each one's middle is, and how far one point is from another. */

export interface Point {
  lat: number;
  lng: number;
}

export const DISTRICTS: ({ name: string } & Point)[] = [
  { name: 'Ataşehir', lat: 40.9923, lng: 29.1244 },
  { name: 'Bakırköy', lat: 40.9819, lng: 28.8772 },
  { name: 'Beşiktaş', lat: 41.043, lng: 29.0094 },
  { name: 'Beyoğlu', lat: 41.037, lng: 28.985 },
  { name: 'Eyüpsultan', lat: 41.0478, lng: 28.934 },
  { name: 'Fatih', lat: 41.0186, lng: 28.9498 },
  { name: 'Kadıköy', lat: 40.9903, lng: 29.029 },
  { name: 'Kartal', lat: 40.8996, lng: 29.193 },
  { name: 'Maltepe', lat: 40.9357, lng: 29.1553 },
  { name: 'Sarıyer', lat: 41.167, lng: 29.057 },
  { name: 'Şişli', lat: 41.0602, lng: 28.9877 },
  { name: 'Üsküdar', lat: 41.0227, lng: 29.0158 },
];

/** Where the visitor is taken to be until they say otherwise. */
export const HOME = 'Kadıköy';

export const districtPoint = (name: string): Point => DISTRICTS.find((district) => district.name === name) ?? DISTRICTS.find((district) => district.name === HOME)!;

const RAD = Math.PI / 180;

/** Kilometres between two points on the ground, by the haversine formula. */
export function distance(a: Point, b: Point) {
  const dLat = (b.lat - a.lat) * RAD;
  const dLng = (b.lng - a.lng) * RAD;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * RAD) * Math.cos(b.lat * RAD) * Math.sin(dLng / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

/** 350 m, 2.4 km, 12 km */
export function far(km: number) {
  if (km < 1) return `${Math.max(50, Math.round(km * 20) * 50)} m`;
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

/** A word folded for searching: lower case, Turkish letters to their plain ones. */
export const fold = (text: string) =>
  text
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u');

/** 1.250 lira is written ₺1,250 here: the site is in English. */
export const lira = (amount: number) => `₺${amount.toLocaleString('en-GB')}`;
