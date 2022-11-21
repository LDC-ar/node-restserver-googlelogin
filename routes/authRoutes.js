const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/authController');
const { validateField } = require('../middlewares/validate-field');

const router = Router();

router.post('/login', [
    check('email', 'Email is obligatory').isEmail(),
    check('password', 'Password is obligatory').not().isEmpty(),
    validateField
], login);

module.exports = router;
