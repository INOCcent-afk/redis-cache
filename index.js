const express = require("express");
const redis = require("redis");

(async () => {
	const client = redis.createClient("redis://127.0.0.1:6379");
	const app = express();
	app.use(express.json());

	await client.connect();

	app.get("/", async (req, res) => {
		const { key } = req.body;
		const response = await client.get(key);

		res.json(response);
	});

	app.post("/", async (req, res) => {
		const { key, value } = req.body;
		const response = await client.set(key, value);

		res.json(response);
	});

	app.listen(8080, () => {
		console.log("Server running");
	});
})();
