const express = require("express");
const redis = require("redis");
const axios = require("axios");

(async () => {
	const client = redis.createClient("redis://127.0.0.1:6379");
	const app = express();
	app.use(express.json());

	await client.connect();

	app.get("/posts/:id", async (req, res) => {
		const { id } = req.params;

		const cachedPost = await client.get(`post-${id}`);

		if (cachedPost) {
			return res.json(JSON.parse(cachedPost));
		}

		const response = await axios.get(
			`https://jsonplaceholder.typicode.com/posts/${id}`
		);

		await client.set(`post-${id}`, JSON.stringify(response.data));

		return res.json(response.data);
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
