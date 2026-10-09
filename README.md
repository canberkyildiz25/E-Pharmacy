# Nöbet

Find the pharmacy in Istanbul that is open now, see what is on its shelf, and order ahead. *Nöbet* is Turkish for a watch: the night one pharmacy stays open so that the others can close.

**Live:** https://nobet-istanbul.vercel.app

This started as E-Pharmacy, a course project of four separate apps (two admin panels, a client and a landing page) on a stock design, with an Express server behind them. I rebuilt it from nothing as one app, around the question somebody actually has at two in the morning: which one is open, and does it have what I need.

It is a demonstration. The pharmacies are examples with invented names and addresses, the prices are made up, and an order placed here reaches nobody.

## What it does

- **Who is open.** Every pharmacy keeps the ordinary hours, nine to seven, Monday to Saturday. Outside them the ones on the rota keep the watch until nine the next morning, and all of Sunday. Each pharmacy has one night in four. All of it is worked out from the clock in Istanbul, and a lamp beside each name is lit when that pharmacy is open at this minute.
- **Which is nearest.** Lists put open pharmacies first and, among those, the nearest. Distance is measured from the middle of the district you choose, or from the spot your browser reports if you ask it to. That spot stays in the browser.
- **What is on the shelf.** Twenty-two plain medicines that need no prescription, across seven shelves. Each pharmacy keeps its own selection at its own prices, with a count of how many are left, and a medicine's page lists who has it.
- **Ordering.** A basket goes to one pharmacy. You choose to collect it or have it brought, leave a name and a number, and follow it through its steps: sent, accepted, ready, handed over. Until the pharmacy accepts it you can cancel, and what was set aside goes back on the shelf. Nothing is paid on the site.
- **Reviews** can be written only by somebody who has had an order from that pharmacy.

## Three kinds of account

**A customer** orders, follows orders, and reviews.

**A pharmacist** puts a pharmacy on the list with its address, a number, a line about the shop and a photograph, and can pin it to where they are standing. From the counter they keep a price and a count for everything on the shelf, add what the catalogue lacks, and move each order on a step at a time.

**The administrator** sees every pharmacy, order, medicine and account, can take a pharmacy off the list and put it back, can take out of the catalogue anything a pharmacist added, and keeps the list of suppliers.

Without a database there are three accounts to walk straight into from the sign-in page, one of each kind.

## Two ways of running

The site asks its own server which of these it is, and behaves accordingly.

**Without a database.** This is the default, and how the public demonstration runs. Accounts, shelves, orders and reviews are kept in the browser's storage, laid over the examples that ship with the site. That is why one browser can be the customer, the pharmacist and the administrator in turn. A password made here is stretched with PBKDF2 before it is stored, and never leaves the browser.

**With MongoDB.** Set `MONGODB_URI` and `NOBET_SECRET` and the same pages talk to an API instead: accounts with bcrypt hashes, a signed session cookie, and pharmacies, shelves and orders shared between visitors. If the database is configured but does not answer, the site falls back to the first way instead of failing.

| Variable | What it is for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The site's address, for canonical links and the sitemap. Worked out on Vercel; set it for a custom domain. |
| `MONGODB_URI` | Turns the database on. |
| `NOBET_SECRET` | Signs sessions. At least 32 characters. Without it the database stays off. |
| `MONGODB_DB` | The database name. `nobet` if left out. |
| `NOBET_ADMIN` | The address of the one account that oversees the platform. Whoever joins with it is the administrator. |
| `NOBET_DB=memory` | Keeps accounts and orders in the server's memory, to try the server side with no database installed. |

`.env.example` has the same list.

## Run it

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

```bash
npm run build && npm start     # the production build
npm run start:memory           # the production build with the in-memory store, on port 5402
npm run start:memory -- --admin you@example.com   # the same, and whoever joins with that address is the administrator
npm run lint
npm run typecheck
```

## How it is put together

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zustand, and Lenis for the weight of the mouse wheel. Going from one page to the next uses view transitions; a browser without them shows the same pages with no fade.

```
app/                  the pages, and the API under app/api
  styles/             the CSS, one file for each part of the site
components/           what the pages are made of
  home/               the front page, a section to a file
  counter/            the pharmacist's side
  desk/               the administrator's side
lib/
  rules.ts            who may do what, and what changes when they do
  time.ts             opening hours, the rota, and Istanbul's clock
  places.ts           the districts, and the distance between two points
  seed.ts             the example pharmacies, medicines, orders and accounts
  store.ts            what the browser keeps, and the one place pages change anything
  address.ts          a search or a tab kept in the address, without a journey to another page
  server/             sessions, the two stores, and the checks every request passes
public/
  film/               the two loops, with a photograph of each first frame
  shelf/ shops/ scenes/   the pictures
```

The part I would point somebody to first is `lib/rules.ts`. Every action on the site (placing an order, moving it on, setting a price, taking a pharmacy off the list) is one case in one function, which checks who is asking, checks every field it is handed, and returns what to keep and what to remove. The browser runs that function when there is no database, and the server runs the same one when there is, so the two ways of running cannot drift apart.

Other things worth knowing:

- An example order keeps how many minutes ago it happened, not a date, so the examples never go stale.
- A photograph is drawn onto a canvas in the browser, no more than 720 pixels on its long side for a medicine and 960 for a shop, and kept as a JPEG. That makes it small enough to live in browser storage or to ride in a request.
- A search and a tab are kept in the address, so they can be linked to, but changing one is not a journey: `lib/address.ts` holds the value where it changes at once and rewrites the address under it. Left to the router, every letter typed would have faded the page out and in, and a quick typist would have lost letters.
- A request that changes something has to come from the site's own pages, is limited in size, and passes a brake on repeated tries. The brake counts in the server's memory, so on a host that runs many copies of the server it slows an attacker down and does not stop one.
- The stores read whole lists. That suits a demonstration and a few hundred orders, and would want paging before it met a real city.

`design.md` is the look and the rules behind it.

## Film and pictures

The street on the front page was filmed by Göksu Taymaz and the rain on the window by Imeel Bagdisar. Both are from Pexels, under the Pexels licence, cut to a loop, graded and made smaller.

The pictures of medicines and of pharmacies were generated for this project with Pollinations. The packs in them are plain, with nothing printed on them, so that none can be taken for a brand, and none is of a real shop. The site says so beside each one. The lettering is Jost and DM Mono, both under the SIL Open Font Licence. The credits page on the site has the links.

## What I checked

Before calling it done I ran these against the production build, in headless Chromium, with Playwright scripts that I keep outside the repository:

- **The three sides of the counter, end to end, with no database** (60 checks): a customer fills a basket, is told when a second pharmacy would start it again, orders, cancels one; the pharmacist accepts the other, moves it on a step at a time, changes a price, adds a medicine with a photograph and a photograph of the shop; the customer sees it collected and writes a review; the administrator takes a pharmacy off the list and it disappears for a visitor; a new customer and a new pharmacist make accounts, and a wrong password is refused.
- **The server side, against the in-memory store** (94 checks): who may do what, and what is refused. A price sent with an order is ignored, a step cannot be skipped, one customer cannot see or cancel another's order, nobody can ask to be the administrator, a request from another site is turned away, and guessing passwords is slowed down.
- **Every page, as each kind of visitor, at eight widths from 320 to 1920 pixels** (951 checks): nothing is wider than the window, everything that is pressed is at least 44 pixels, no button or tab breaks onto two lines, and axe-core finds nothing against WCAG 2.2 AA. With less motion asked for nothing moves and neither film starts. With scripts off, the lists and the pages of the examples are still there.
- **Under the headers in `vercel.json`** (31 pages and actions): nothing is blocked by the content security policy, both films play, and photographs made in the browser show.
- `npm run lint` and `npm run typecheck` are clean.

What I have not done: tried it on a real phone or in Safari or Firefox, listened to it with a screen reader, or run the MongoDB store against a live database. That store is written to the same small interface as the in-memory one, which is the one the checks used.

## What it does not do

- It does not know which pharmacy is really on watch tonight. The rota here is one night in four, by a number each example carries. The real list is published by the chamber of pharmacists, and is on the door of any closed pharmacy.
- It takes no payment, and sends no message to anybody: no email, no text.
- Nothing here is medical advice.
