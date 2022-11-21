const { request, response } = require('express');

// Check if user has 'ADMIN_ROLE'
const adminRole = (req = request, res = response, next) => {
	if (!req.user) {
		return res.status(500).json({
			msg: 'Trying to validate role without JWT validation',
		});
	}

	const { role, name } = req.user;

	if (role !== 'ADMIN_ROLE') {
		return res.status(401).json({
			msg: `${name} is not Admin`,
		});
	}

	next();
};

// Check if user has roles specified in the validator params.
const hasRole = (...roles) => {
	return (req = request, res = response, next) => {
		if (!req.user) {
			return res.status(500).json({
				msg: 'Trying to validate role without JWT validation',
			});
		}

		if (!roles.includes(req.user.role)) {
			return res.status(401).json({
				msg: `Service require one of this roles: ${roles}`,
			});
		}

		next();
	};
};

module.exports = {
	adminRole,
	hasRole,
};
