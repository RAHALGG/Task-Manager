const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'الخادم يعمل بشكل صحيح' });
});

module.exports = router; 