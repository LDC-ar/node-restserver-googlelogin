const express = require('express');
// const cors = require('cors');
const dbConnection = require('../db/config');

class Server {
	constructor() {
		this.app = express();
		this.PORT = process.env.PORT;

		this.usersPath = '/api/users';
		this.authPath = '/api/auth';

		// Conectar a base de datos.
		this.connectDB();

		// Middlewares.
		this.middlewares();
		// Rutas de mi aplicacion.
		this.routes();
	}

	async connectDB() {
		await dbConnection();
	}

	middlewares() {
		// CORS
		// this.app.use(cors());

		// Lectura y parseo del body.
		this.app.use(express.json());

		// Directorio público.
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.authPath, require('../routes/authRoutes'));
		this.app.use(this.usersPath, require('../routes/userRoutes'));
	}

	listen() {
		this.app.listen(this.PORT, () => {
			console.log(`Server running in http://localhost:${this.PORT}`);
		});
	}
}

module.exports = Server;
