require('dotenv').config();
const mongoose = require('mongoose');
const CustomerReview = require('./models/CustomerReview');

const reviews = [
  { userName: 'Maria Tkachuk', photo: '', rating: 5, text: 'I recently used this medical platform to book an appointment with a specialist, and I was impressed by how easy and user-friendly the process was. Highly recommended!' },
  { userName: 'John Smith', photo: '', rating: 5, text: 'Excellent service! I got my medications delivered within hours. The platform is intuitive and the prices are very competitive.' },
  { userName: 'Anna Williams', photo: '', rating: 4, text: 'Great platform for ordering medicines online. The search functionality works perfectly and checkout is seamless.' },
  { userName: 'David Chen', photo: '', rating: 5, text: 'Saved me so much time! No more waiting in long queues at the pharmacy. Everything is just a few clicks away.' },
  { userName: 'Sophie Laurent', photo: '', rating: 4, text: 'Very reliable service. My prescriptions arrive on time and the customer support is always helpful.' },
  { userName: 'Ahmed Hassan', photo: '', rating: 5, text: 'The best online pharmacy platform I have used. Wide selection, great prices, and fast delivery.' },
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    await CustomerReview.deleteMany({});
    await CustomerReview.insertMany(reviews);
    console.log('Customer reviews seeded!');
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
