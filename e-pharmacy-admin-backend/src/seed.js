require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Supplier = require('./models/Supplier');
const Customer = require('./models/Customer');
const IncomeExpense = require('./models/IncomeExpense');

const products = [
  { photo: "https://i.ibb.co/bLKP624/5-15-1000x1000-min.jpg", name: "Aspirin", suppliers: "Square", stock: "12", price: "89.66", category: "Medicine" },
  { photo: "https://i.ibb.co/Hg0zZkQ/shop-4-7-1000x1000-min.jpg", name: "Paracetamol", suppliers: "Acme", stock: "19", price: "34.16", category: "Heart" },
  { photo: "https://i.ibb.co/02WmJdc/5-19-1000x1000-min.jpg", name: "Ibuprofen", suppliers: "Beximco", stock: "09", price: "53.76", category: "Head" },
  { photo: "https://i.ibb.co/GxTVSVk/shop-4-9-1000x1000-min.jpg", name: "Acetaminophen", suppliers: "ACI", stock: "14", price: "28.57", category: "Hand" },
  { photo: "https://i.ibb.co/X330FTj/shop-4-10-1000x1000-min.jpg", name: "Naproxen", suppliers: "Uniliver", stock: "10", price: "56.34", category: "Medicine" },
  { photo: "https://i.ibb.co/bLKP624/5-15-1000x1000-min.jpg", name: "Amoxicillin", suppliers: "Square", stock: "25", price: "45.99", category: "Medicine" },
  { photo: "https://i.ibb.co/Hg0zZkQ/shop-4-7-1000x1000-min.jpg", name: "Lisinopril", suppliers: "Acme", stock: "17", price: "29.88", category: "Head" },
  { photo: "https://i.ibb.co/02WmJdc/5-19-1000x1000-min.jpg", name: "Ciprofloxacin", suppliers: "Beximco", stock: "11", price: "38.45", category: "Head" },
  { photo: "https://i.ibb.co/GxTVSVk/shop-4-9-1000x1000-min.jpg", name: "Hydrochlorothiazide", suppliers: "ACI", stock: "22", price: "24.76", category: "Hand" },
  { photo: "https://i.ibb.co/X330FTj/shop-4-10-1000x1000-min.jpg", name: "Prednisone", suppliers: "Uniliver", stock: "15", price: "48.99", category: "Medicine" },
  { photo: "https://i.ibb.co/bLKP624/5-15-1000x1000-min.jpg", name: "Toothpaste", suppliers: "Square", stock: "30", price: "6.66", category: "Dental Care" },
  { photo: "https://i.ibb.co/Hg0zZkQ/shop-4-7-1000x1000-min.jpg", name: "Mouthwash", suppliers: "Acme", stock: "25", price: "8.16", category: "Dental Care" },
  { photo: "https://i.ibb.co/02WmJdc/5-19-1000x1000-min.jpg", name: "Facial Cleanser", suppliers: "Beximco", stock: "14", price: "11.57", category: "Skin Care" },
  { photo: "https://i.ibb.co/GxTVSVk/shop-4-9-1000x1000-min.jpg", name: "Moisturizer", suppliers: "ACI", stock: "18", price: "13.34", category: "Skin Care" },
  { photo: "https://i.ibb.co/X330FTj/shop-4-10-1000x1000-min.jpg", name: "Vitamin D", suppliers: "Uniliver", stock: "16", price: "12.76", category: "Vitamins & Supplements" }
];

const orders = [
  { photo: "https://i.imgur.com/1As0akH.png", name: "Taras Shevchenko", address: "Khreshchatyk, Bldg. 51, Apt. 137", products: "12", price: "890.66", status: "Completed", order_date: "July 31, 2023" },
  { photo: "https://i.imgur.com/UYCE7Rr.png", name: "Lesya Ukrainka", address: "Volodymyrska, Bldg. 84, Apt. 103", products: "19", price: "340.16", status: "Confirmed", order_date: "July 31, 2023" },
  { photo: "https://i.imgur.com/FHMKqK5.png", name: "Ivan Franko", address: "Yaroslaviv Val, Bldg. 47, Apt. 194", products: "09", price: "530.76", status: "Pending", order_date: "July 31, 2023" },
  { photo: "https://i.imgur.com/hz6bZkb.png", name: "Lina Kostenko", address: "Saksahanskoho, Bldg. 26, Apt. 123", products: "14", price: "280.57", status: "Cancelled", order_date: "July 31, 2023" },
  { photo: "https://i.imgur.com/udG6SOt.png", name: "Vasyl Symonenko", address: "Reitarska, Bldg. 38, Apt. 75", products: "10", price: "567.34", status: "Processing", order_date: "July 31, 2023" },
  { photo: "https://i.imgur.com/2BSHGgF.png", name: "Hryhorii Skovoroda", address: "Zhylyanska, Bldg. 2, Apt. 157", products: "15", price: "420.99", status: "Shipped", order_date: "July 31, 2023" },
  { photo: "https://i.imgur.com/7l1lgAc.png", name: "Olena Teliha", address: "Velyka Vasylkivska, Bldg. 55, Apt. 15", products: "18", price: "750.25", status: "Delivered", order_date: "July 31, 2023" },
  { photo: "https://i.imgur.com/4A0RbgS.png", name: "Sophia Wang", address: "Mirpur, Bldg. 95, Apt. 131", products: "16", price: "560.30", status: "Completed", order_date: "July 31, 2023" },
  { photo: "https://i.imgur.com/gt8CE4B.png", name: "Liam Brown", address: "Dhanmondi-32, Bldg. 36, Apt. 194", products: "13", price: "320.15", status: "Processing", order_date: "July 31, 2023" },
  { photo: "https://i.imgur.com/wkHmjVf.png", name: "Emma Wilson", address: "Gulshan-2, Bldg. 86, Apt. 6", products: "17", price: "610.20", status: "Shipped", order_date: "July 31, 2023" }
];

const suppliers = [
  { name: "Alex Shatov", address: "Mripur-1", suppliers: "Square", date: "September 19, 2023", amount: "৳ 6952.53", status: "Active" },
  { name: "Philip Harbach", address: "Dhonmondi", suppliers: "Acme", date: "September 19, 2023", amount: "৳ 8527.58", status: "Active" },
  { name: "Mirko Fisuk", address: "Uttara-6", suppliers: "Beximco", date: "September 19, 2023", amount: "৳ 2698.50", status: "Active" },
  { name: "Olga Semklo", address: "Gulshan-1", suppliers: "ACI", date: "September 19, 2023", amount: "৳ 9852.64", status: "Active" },
  { name: "Burak Long", address: "Mirpur-12", suppliers: "Uniliver", date: "September 19, 2023", amount: "৳ 1736.90", status: "Deactive" }
];

const customers = [
  { photo: "https://i.imgur.com/1As0akH.png", name: "Nadia Ivanova", email: "nadia.ivanova@gmail.com", spent: "2,300.50", phone: "+380707614324", address: "Obolon, Bldg. 10, Apt. 45", register_date: "Mar 1, 2024" },
  { photo: "https://i.imgur.com/UYCE7Rr.png", name: "Petro Kovalchuk", email: "petro.kovalchuk@gmail.com", spent: "3,450.75", phone: "+380602345678", address: "Lva Tolstoho, Bldg. 31, Apt. 91", register_date: "Mar 2, 2024" },
  { photo: "https://i.imgur.com/hz6bZkb.png", name: "Oleksiy Shevchenko", email: "oleksiy.shevchenko@gmail.com", spent: "1,980.25", phone: "+380703486789", address: "Kharkivske Shose, Bldg. 13, Apt. 24", register_date: "Mar 3, 2024" },
  { photo: "https://i.imgur.com/FHMKqK5.png", name: "Iryna Petrenko", email: "iryna.petrenko@gmail.com", spent: "4,120.00", phone: "+380674567890", address: "Borschahivka, Bldg. 20, Apt. 7", register_date: "Mar 4, 2024" },
  { photo: "https://i.imgur.com/udG6SOt.png", name: "Mykola Boyko", email: "mykola.boyko@gmail.com", spent: "2,750.60", phone: "+380505678901", address: "Syrets, Bldg. 5, Apt. 39", register_date: "Mar 5, 2024" },
  { photo: "https://i.imgur.com/2BSHGgF.png", name: "Oksana Tkachenko", email: "oksana.tkachenko@gmail.com", spent: "1,560.30", phone: "+380636789012", address: "Darnytsya, Bldg. 8, Apt. 17", register_date: "Mar 6, 2024" },
  { photo: "https://i.imgur.com/7l1lgAc.png", name: "Vasyl Kravchenko", email: "vasyl.kravchenko@gmail.com", spent: "3,890.45", phone: "+380447890123", address: "Svyatoshyn, Bldg. 15, Apt. 52", register_date: "Mar 7, 2024" },
  { photo: "https://i.imgur.com/4A0RbgS.png", name: "Natalia Moroz", email: "natalia.moroz@gmail.com", spent: "2,100.75", phone: "+380708901234", address: "Troyeshchyna, Bldg. 22, Apt. 11", register_date: "Mar 8, 2024" },
  { photo: "https://i.imgur.com/gt8CE4B.png", name: "Andrii Kovalenko", email: "andrii.kovalenko@gmail.com", spent: "5,430.20", phone: "+380609012345", address: "Pechersk, Bldg. 30, Apt. 88", register_date: "Mar 9, 2024" },
  { photo: "https://i.imgur.com/wkHmjVf.png", name: "Yulia Savchenko", email: "yulia.savchenko@gmail.com", spent: "1,870.90", phone: "+380710123456", address: "Podil, Bldg. 4, Apt. 61", register_date: "Mar 10, 2024" }
];

const incomeExpenses = [
  { name: "Qonto billing", amount: "-49.88", type: "Expense" },
  { name: "Cruip.com Market Ltd 70 Wilson St London", amount: "+249.88", type: "Income" },
  { name: "Notion Labs Inc", amount: "+99.99", type: "Income" },
  { name: "Market Cap Ltd", amount: "+1,200.88", type: "Income" },
  { name: "App.com Market Ltd 70 Wilson St London", amount: "+99.99", type: "Error" },
  { name: "App.com Market Ltd 70 Wilson St London", amount: "-49.88", type: "Expense" },
  { name: "Qonto billing", amount: "-49.88", type: "Expense" },
  { name: "Cruip.com Market Ltd 70 Wilson St London", amount: "+249.88", type: "Income" }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Supplier.deleteMany({}),
      Customer.deleteMany({}),
      IncomeExpense.deleteMany({})
    ]);
    console.log('Cleared existing data');

    await User.create({ name: 'Clayton Santos', email: 'vendor@gmail.com', password: 'admin123' });
    await Product.insertMany(products);
    await Order.insertMany(orders);
    await Supplier.insertMany(suppliers);
    await Customer.insertMany(customers);
    await IncomeExpense.insertMany(incomeExpenses);

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
