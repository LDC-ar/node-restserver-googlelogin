const { request, response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req = request, res = respond) => {
	try {
		const { id_token } = req.body;

		const { name, email, img } = await googleVerify(id_token);

		// Check if user exist in our DB.
		let user = await User.findOne({ email });

		// If user doesn't exist. It creates one with the data received from google services.
		if (!user) {
			const data = {
				name,
				email,
				password: ':P',
				img,
				google: true,
			};

			user = new User(data);

			await user.save();
		}

		// Check if user state is false (deleted)
		if (!user.state) {
			return res.status(401).json({
				msg: 'User blocked. Talk with the administrator.',
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
		res.status(400).json({
			msg: 'Couldnt verify the token',
		});
	}
};

module.exports = {
	login,
	googleSignIn,
};
