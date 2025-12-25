import http from 'node:http';
import express from 'express';

const app: express.Application = express();
const PORT: number = 3120;

app.get('/', (req, res) => res.status(200).json('ok'));

const server_node = http.createServer(app);

server_node.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
