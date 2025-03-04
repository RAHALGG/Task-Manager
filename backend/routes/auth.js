const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// تعريف المسار مباشرة
router.post('/login', authController.login);
router.get('/me', auth, authController.getCurrentUser);

router.get('/test', (req, res) => {
    res.json({ message: 'Auth routes are working!' });
});

module.exports = router;