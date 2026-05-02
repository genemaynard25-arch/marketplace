const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updateMyPassword);
router.get('/me', authController.getMe, (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});
router.patch('/updateMe', authController.updateMe);
router.delete('/deleteMe', authController.deleteMe);

module.exports = router;
