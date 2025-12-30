import generateSwagger from 'swagger-autogen';

const docData = {
  info: {
    version: 'v1.0.0',
    title: 'Blog API',
    description: 'Un CRUD de articulos para operaciones principales, bases de datos (NoSQL), API RESTful del lado del servidor'
  },
  host: 'localhost:3120',
  basePath: '/',
  schemes: ['http', 'https'],
};

const file = './swagger-api.json';
const endpoints = ['src/post/router.ts'];

generateSwagger()(file, endpoints, docData);
				// "parameters": [
				// 	{
        //     "in":"body",
				// 		"name": "body",
				// 		"required": true,
				// 		"schema": {
				// 			"$ref": "#/definitions/Post"
				// 		}
				// 	}
				// ],