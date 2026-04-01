const router = require('express').Router();
const CustomerReview = require('../../models/CustomerReview');

router.get('/', async (req, res) => {
  try {
    res.json(await CustomerReview.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
