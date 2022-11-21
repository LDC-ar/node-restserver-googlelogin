const { Router } = require('express');
const { check } = require('express-validator');
const { isRoleValid, emailExist, userByIdExist } = require('../helpers/db-validators');
const { userGet, userPost, userPut, userPatch, userDelete } = require('../controllers/userController');
const { validateField, validateJWT, hasRole } = require('../middlewares');

const router = Router();

router.get('/', userGet);

router.post(
	'/',
	[
		check('name', 'Name is obligatory').not().isEmpty(),
		check('password', 'Password minimum length 6 characters').isLength({ min: 6 }),
		check('email', 'Email is not valid').isEmail(),
		check('email').custom(emailExist),
		check('role').custom(isRoleValid),
		validateField,
	],
	userPost
);

router.put('/:id', [check('id', 'Not a valid ID').isMongoId(), check('id').custom(userByIdExist), validateField], userPut);

router.patch('/', userPatch);

router.delete('/:id', [validateJWT, hasRole('ADMIN_ROLE', 'SALES_ROLE'), check('id', 'Not a valid ID').isMongoId(), check('id').custom(userByIdExist), validateField], userDelete);

module.exports = router;
