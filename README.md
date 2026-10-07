# E-Pharmacy

A marketplace for pharmacies: customers find the nearest one and order from it, pharmacy owners run their shop and its stock, and an administrator oversees the whole platform. One API, one front end, three kinds of account.

**Live:** https://e-pharmacy-1.onrender.com/

The live copy runs on Render's free tier, so the first request after a quiet spell can take the best part of a minute while the server wakes.

It started as a course project of four separate apps (two admin panels, a client and a landing page). I folded them into one back end and one front end with a single sign-in that knows which of the three you are.

## What each kind of account can do

**A customer**

- Find pharmacies near them, nearest first. The browser gives the position, and distance is worked out with the haversine formula.
- Search and filter medicines and put them in a basket.
- Check out with an address, a phone number and a note for the delivery.
- See their past orders, and review a pharmacy.

**A pharmacy owner**

- Create and edit the shop's profile. The address is turned into coordinates through Nominatim (OpenStreetMap), so that the shop can be found by distance.
- Manage the medicines on the shelf: add, edit, delete, with a photograph.
- See incoming orders and move each one through its states.
- Read income, expenses and a summary of orders.

**An administrator**

- Manage customers, pharmacies, products and suppliers across the platform.
- See every order, and the figures for the platform as a whole.

## Stack

**Back end**

| | |
| --- | --- |
| Node.js and Express | The REST API |
| MongoDB and Mongoose | The database |
| JSON Web Tokens | Who is signed in, and as what |
| bcryptjs | Password hashes |
| Multer | Uploaded photographs |
| Helmet and CORS | Headers, and which site may call the API |

**Front end**

| | |
| --- | --- |
| React 18 and Vite | The interface |
| Redux Toolkit | State |
| React Router 6 | Routes, with the private ones guarded by role |
| React Hook Form and Yup | Forms and their validation |
| CSS Modules | Styling, one file per component |
| Axios | Requests |
| React Hot Toast | Messages |

**From outside:** Nominatim for turning an address into coordinates, and the browser's Geolocation API for where the customer is.

## Run it

Node 18 or newer, and MongoDB, on your machine or on Atlas.

```bash
git clone https://github.com/canberkyildiz25/E-Pharmacy.git
cd E-Pharmacy
```

**The back end**

```bash
cd e-pharmacy-backend
npm install
```

Make a file called `.env` in `e-pharmacy-backend/`:

```env
MONGODB_URI=mongodb://localhost:27017/epharmacy
JWT_SECRET=a_long_random_string_of_your_own
PORT=5000
```

```bash
npm run dev      # with reloading
npm start        # without
```

**The front end**

```bash
cd ../e-pharmacy-frontend
npm install
npm run dev        # http://localhost:5173
npm run build      # the production build, into dist/
npm run preview
```

| Variable | Where | What it is for |
| --- | --- | --- |
| `MONGODB_URI` | back end | The database |
| `JWT_SECRET` | back end | Signs the tokens |
| `JWT_EXPIRE` | back end | How long a token lasts. Optional. |
| `PORT` | back end | The port the API listens on |
| `FRONTEND_URL` | back end | The site allowed to call the API |
| `VITE_API_URL` | front end | Where the API is |

## Sample data and accounts to try

The seed scripts fill an empty database:

```bash
cd e-pharmacy-backend
node seed-data.js      # pharmacies, medicines and owner accounts
node seed-admin.js     # the administrator
```

| Role | Email | Password |
| --- | --- | --- |
| Pharmacy owner | `eczane1@epharmacy.com` | `eczane123` |
| Pharmacy owner | `eczane2@epharmacy.com` | `eczane123` |
| Administrator | `admin@epharmacy.com` | `admin123` |

These exist only in a database you have seeded yourself. Change them before putting anything on a public address.

`geocode-existing.js` and `geocode-fallback.js` fill in coordinates for pharmacies that were saved without them.

## Layout of the code

```
e-pharmacy-backend/
  src/
    server.js
    models/            User, Shop, Medicine, Product, Cart, Order, ShopOrder, Customer,
                       CustomerReview, Supplier, IncomeExpense
    routes/
      auth.js          one sign-in for all three roles
      client/          stores, medicines, cart, reviews
      franchise/       shop, orders, statistics
      admin/           dashboard, customers, franchises, orders, products, suppliers
    middleware/        auth (who you are), role (what you may do), upload
  seed-*.js, geocode-*.js, fix-medicines.js

e-pharmacy-frontend/
  src/
    App.jsx            routes
    pages/
      client/          the customer's pages
      franchise/       the pharmacy owner's pages
      admin/           the administrator's pages
      LoginPage, RegisterPage
    components/        client/, franchise/, admin/, and PrivateRoute
    store/slices/      the Redux slices
  public/_redirects    sends every path to index.html
```

## Deploying

Two services on Render: the API as a web service, and the front end as a static site built with `npm run build` and published from `dist`.

## Notes

- This is a demonstration. The pharmacies and medicines are sample data, and nothing can really be ordered.
- The interface is in Turkish.

## Author

[Canberk Yıldız](https://canberkyildiz.netlify.app)
