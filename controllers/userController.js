const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

// GET
const userGet = async (req = request, res = response) => {
	// limit: Limits the search result to X documents.
	// from: Set what document number the search will start from.
	// Both used for pagination purposes.
	const { limit, from = 0 } = req.query;
	const query = { state: true };

	// Old code:
	// Set from which document number the search will return till what limit.
	// const users = await User.find(query).skip(from).limit(limit);

	// Count total number of documents.
	// const total = await User.countDocuments(query);

	// New Code:
	// Return both results into one Promise. 40% performance reply speed gained.
	const [total, users] = await Promise.all([User.countDocuments(query), User.find(query).skip(Number(from)).limit(Number(limit))]);

	res.json({ total, users });
};

// POST
const userPost = async (req = request, res = response) => {
	const { name, email, password, role } = req.body;
	const user = new User({ name, email, password, role });

	// Crypt password.
	const salt = bcryptjs.genSaltSync();
	user.password = bcryptjs.hashSync(password, salt);

	// Save user in DB.
	await user.save();

	res.json({
		user,
	});
};

// PUT
const userPut = async (req = request, res = response) => {
	const { id } = req.params;
	const { _id, password, google, email, ...rest } = req.body;

	if (password) {
		const salt = bcryptjs.genSaltSync();
		rest.password = bcryptjs.hashSync(password, salt);
	}

	const user = await User.findByIdAndUpdate(id, rest);

	res.json(user);
};

// PATCH
const userPatch = (req = request, res = response) => {
	res.json({
		msg: 'Patch API - Controlador',
	});
};

// DELETE
const userDelete = async (req = request, res = response) => {
	const { id } = req.params;
	const user = await User.findByIdAndUpdate(id, { state: false });

	res.json(user);
};

module.exports = {
	userGet,
	userPost,
	userPut,
	userPatch,
	userDelete,
};
