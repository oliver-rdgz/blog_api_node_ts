import http from 'node:http';
import express, { json } from 'express';
import { DataBaseMongo } from './database';
import { postRouter } from './post/router';
import swaggerUi from 'swagger-ui-express';
import swaggerData from './swagger-api.json';

DataBaseMongo.connection();

export const app: express.Application = express();
const PORT: number = 3120;

app.use(json());
app.get('/ok', (req, res) => res.status(200).json('ok'));
app.use(postRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerData));

const server_node = http.createServer(app);

server_node.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
