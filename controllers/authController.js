const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/generateJWT');

const login = async (req = request, res = response) => {
	const { email, password } = req.body;

	try {
		// Verify if email exist.
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				msg: `Email doesn't match with any user in the DB`,
			});
		}

		// Verify if user is active.
		if (!user.state) {
			return res.status(400).json({
				msg: `User doesn't exist in the DB`,
			});
		}

		// Verify password.
		const validPassword = bcryptjs.compareSync(password, user.password);

		if (!validPassword) {
			return res.status(400).json({
				msg: 'Password is not valid',
			});
		}

		// Generate JWT.
		const token = await generateJWT(user.id);

		res.json({
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Talk with the administrator',
		});
	}
};

module.exports = {
	login,
};
