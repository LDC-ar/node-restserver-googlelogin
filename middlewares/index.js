const validateField = require('../middlewares/validate-field');
const validateJWT = require('../middlewares/validate-jwt');
const hasRole = require('../middlewares/validate-roles');

module.exports = {
	...validateField,
	...validateJWT,
	...hasRole,
};
