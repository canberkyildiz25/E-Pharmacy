require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/Customer');
const IncomeExpense = require('./models/IncomeExpense');

const customers = [
  { name: "Nadia Ivanova", email: "nadia.ivanova@gmail.com", photo: "https://i.imgur.com/1As0akH.png", spent: "2,300.50", phone: "+380707614324", address: "Obolon, Bldg. 10, Apt. 45", register_date: "Mar 1, 2024" },
  { name: "Petro Kovalchuk", email: "petro.kovalchuk@gmail.com", photo: "https://i.imgur.com/UYCE7Rr.png", spent: "3,450.75", phone: "+380602345678", address: "Lva Tolstoho, Bldg. 31, Apt. 91", register_date: "Mar 2, 2024" },
  { name: "Oleksiy Shevchenko", email: "oleksiy.shevchenko@gmail.com", photo: "https://i.imgur.com/hz6bZkb.png", spent: "1,980.25", phone: "+380703486789", address: "Kharkivske Shose, Bldg. 13, Apt. 24", register_date: "Mar 3, 2024" },
  { name: "Iryna Petrenko", email: "iryna.petrenko@gmail.com", photo: "https://i.imgur.com/FHMKqK5.png", spent: "4,120.00", phone: "+380674567890", address: "Borschahivka, Bldg. 20, Apt. 7", register_date: "Mar 4, 2024" },
  { name: "Mykola Boyko", email: "mykola.boyko@gmail.com", photo: "https://i.imgur.com/udG6SOt.png", spent: "2,750.60", phone: "+380505678901", address: "Syrets, Bldg. 5, Apt. 39", register_date: "Mar 5, 2024" },
];

const incomeExpenses = [
  { name: "Qonto billing", amount: "-49.88", type: "Expense" },
  { name: "Cruip.com Market Ltd", amount: "+249.88", type: "Income" },
  { name: "Notion Labs Inc", amount: "+99.99", type: "Income" },
  { name: "Market Cap Ltd", amount: "+1,200.88", type: "Income" },
  { name: "App.com Market Ltd", amount: "+99.99", type: "Error" },
  { name: "App.com Market Ltd", amount: "-49.88", type: "Expense" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await Customer.deleteMany({});
    await IncomeExpense.deleteMany({});
    await Customer.insertMany(customers);
    await IncomeExpense.insertMany(incomeExpenses);
    console.log('Franchise seed data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
