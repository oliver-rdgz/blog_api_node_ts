import express, { json } from 'express';
import { DataBaseMongo } from '../database';
import { postRouter } from './router';
import supertest from 'supertest';
import { v4 as uuid } from 'uuid';

const app = express();
app.use(json());
app.use(postRouter);
let idPostDelete;
let idPost;

const idWrong = uuid();

beforeAll(async () => {
	await DataBaseMongo.connection();
	const post = (await request.get('/api/pagination-post')).body;
	if (post) {
		if (post.data[0]) idPostDelete = post.data[0]._id;
		else idPostDelete = uuid();
		if (post.data[1]) idPost = post.data[1]._id;
		else idPost = uuid();
	} else {
		idPostDelete = uuid();
		idPost = uuid();
	}
});
afterAll(async () => {
	await DataBaseMongo.disconnect();
});
const request = supertest(app);

describe('create', () => {
	const succesExpected = 201;
	const errorExpected = 400;
	const newPost = {
		title: 'Creando con jest',
		content:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus in posuere dolor. Suspendisse consectetur elit ligula, vel malesuada quam gravida vitae.',
		img: 'https://www.jetbrains.com/guide/assets/jest-5ee71e9b.svg',
	};

	it('All fields - 201', async () => {
		const res = await request
			.post('/api/create-post')
			.set('Content-Type', 'application/json')
			.send(newPost);
		expect(res.status).toBe(succesExpected);
	});

	it('required fields - 201', async () => {
		const res = await request
			.post('/api/create-post')
			.set('Content-Type', 'application/json')
			.send({ title: newPost.title, content: newPost.content });
		expect(res.status).toBe(succesExpected);
	});

	it('remove one required field - 400', async () => {
		const requiredFields = ['content', 'title'];
		for (const field of requiredFields) {
			const wrongPost = { ...newPost };
			delete wrongPost[field];
			const res = await request
				.post('/api/create-post')
				.set('Content-Type', 'application/json')
				.send(wrongPost);
			expect(res.status).toBe(errorExpected);
		}
	});

	it('empty data - 400', async () => {
		const res = await request
			.post('/api/create-post')
			.set('Content-Type', 'application/json')
			.send({});
		expect(res.status).toBe(errorExpected);
	});
});
describe('get one', () => {
	it('post in DB - 200', async () => {
		const expected = 200;
		const res = await request.get(`/api/get-post/${idPost}`);
		if (res.status === 404)
			console.log('Se debe buscar un ID de post en la base de datos');
		expect(res.status).toBe(expected);
	});
	it('post not found in DB - 404', async () => {
		const expected = 404;
		const res = await request.get(`/api/get-post/${idWrong}`);
		expect(res.status).toBe(expected);
	});
});

describe('update', () => {
	const succesExpected = 200;
	const updatePost = {
		title: 'Actualizando con jest',
		content:
			'Nunc nisi sem, bibendum id elit non, efficitur fermentum nisl. Nulla facilisi. Aliquam sit amet rutrum metus. Duis lobortis nisl euismod orci pulvinar rhoncus.',
		img: 'https://avatars.githubusercontent.com/u/103283236?s=200&v=4',
	};
	const filePost = Object.keys(updatePost);
	it('All fields - 200', async () => {
		const res = await request
			.patch(`/api/update-post/${idPost}`)
			.set('Content-Type', 'application/json')
			.send(updatePost);
		expect(res.status).toBe(succesExpected);
	});

	it.each(filePost)('one field -200', async (filePost) => {
		const postOneField = { [filePost]: updatePost[filePost] };
		const res = await request
			.patch(`/api/update-post/${idPost}`)
			.set('Content-Type', 'application/json')
			.send(postOneField);
		expect(res.status).toBe(succesExpected);
	});

	it('Empty - 400', async () => {
		const res = await request
			.patch(`/api/update-post/${idPost}`)
			.set('Content-Type', 'application/json')
			.send({});
		expect(res.status).toBe(400);
	});
});

describe('delete', () => {
	it('post in DB - 200', async () => {
		const expected = 200;
		const res = await request.delete(`/api/delete-post/${idPostDelete}`);
		if (res.status === 404)
			console.log(
				'Se debe eliminar un post activo con un Id de la base de datos'
			);
		expect(res.status).toBe(expected);
	});
	it('post not found in DB - 404', async () => {
		const expected = 404;
		const res = await request.delete(`/api/delete-post/${idWrong}`);
		expect(res.status).toBe(expected);
	});
});

it('pagination', async () => {
	const expected = 200;
	const res = await request.get('/api/pagination-post');
	expect(res.status).toBe(expected);
});
