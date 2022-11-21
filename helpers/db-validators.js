const Role = require('../models/role');
const User = require('../models/user');

// Verify if role is valid.
const isRoleValid = async (role = '') => {
	const isRole = await Role.findOne({ role });
	if (!isRole) {
		throw new Error(`Role ${role} is not registered in database.`);
	}
};

// Verify if email exist.
const emailExist = async email => {
	const existEmail = await User.findOne({ email });
	if (existEmail) {
		throw new Error(`Email already registered in database.`);
	}
};

// Verify if user by ID exist.
const userByIdExist = async id => {
	const userExist = await User.findById(id);
	if (!userExist) {
		throw new Error(`ID: ${id} doesn't exist.`);
	}
};

module.exports = {
	isRoleValid,
	emailExist,
	userByIdExist,
};
