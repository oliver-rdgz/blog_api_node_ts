import { Router } from 'express';
import { PostRepository } from './repository';
import { ValidateSchemaPost } from './schemas';
import { PostPagination } from './types';

const router = Router();
const path_admin = '/api';

router.post(`${path_admin}/create-post`, async (req, res) => {
	const messageError = 'Error al momento de crear el Post';
	const body = req.body;
	const validateSchemaPost = new ValidateSchemaPost();
	try {
		const schemaPost = validateSchemaPost.create(body);
		if (!schemaPost.success) {
			return res.status(400).json({
				status: 400,
				msg: messageError,
				detail: [schemaPost.msgError],
			});
		}
		const created = await PostRepository.create(schemaPost.data);
		return res.status(201).json({
			status: 201,
			msg: 'Post creado exitosamente',
			data: created,
		});
	} catch (error) {
		return res.status(400).json({
			status: 400,
			msg: messageError,
			detail: [error.message],
		});
	}
});

router.get(`${path_admin}/get-post/:id`, async (req, res) => {
	const messageError = 'Error al momento de obtener el Post';
	const id = req.params.id;
	const validateSchemaPost = new ValidateSchemaPost();

	try {
		const schemaId = validateSchemaPost.id(id);
		if (!schemaId.success) {
			return res.status(400).json({
				status: 400,
				msg: messageError,
				detail: [schemaId.msgError],
			});
		}
		const post = await PostRepository.getOne(id);
		if (!post) {
			return res.status(404).json({
				status: 404,
				msg: messageError,
				detail: ['Post no encontrado en el sistema'],
			});
		}
		return res.status(200).json({
			status: 200,
			msg: 'Post obtenido exitosamente',
			data: post,
		});
	} catch (error) {
		return res.status(400).json({
			status: 400,
			msg: messageError,
			detail: [error.message],
		});
	}
});

router.get(`${path_admin}/pagination-post`, async (req, res) => {
	const messageError = 'Error al paginar los posts';
	const validateSchemaPost = new ValidateSchemaPost();
	try {
		const schemaPagination = validateSchemaPost.pagination(req.query);
		if (!schemaPagination.success) {
			return res.status(400).json({
				status: 400,
				msg: messageError,
				detail: [schemaPagination.msgError],
			});
		}
		const filterQuery: PostPagination = {
			title: req.query.title ? req.query.title.toString() : null,
			content: req.query.content ? req.query.content.toString() : null,
		};
		if (req.query.date) {
			const dateFilter = req.query.date;
			if (dateFilter === 'week' || dateFilter === 'month') {
				const dateInit = new Date();
				dateInit.setHours(0, 0, 0, 0);
				if (dateFilter === 'week')
					dateInit.setDate(dateInit.getDate() - dateInit.getDay());
				else dateInit.setDate(1);

				let dateEnd = new Date(dateInit);

				if (dateFilter === 'month')
					dateEnd = new Date(
						dateInit.getFullYear(),
						dateInit.getMonth() + 1,
						0
					);
				else dateEnd.setDate(dateInit.getDate() + 6);
				dateEnd.setHours(23, 59, 59, 59);
				filterQuery.date = {
					init: dateInit,
					end: dateEnd,
				};
			} else {
				filterQuery.date = {
					init: new Date(req.query.date.toString()),
					end: new Date(req.query.date.toString()),
				};
				filterQuery.date.init.setHours(0, 0, 0, 0);
				filterQuery.date.end.setHours(23, 59, 59, 59);
			}
		}
		const postPagination = await PostRepository.pagination(filterQuery);
		return res.status(200).json({
			status: 200,
			msg: 'Post paginado exitosamente',
			data: postPagination,
		});
	} catch (error) {
		return res.status(400).json({
			status: 400,
			msg: messageError,
			detail: [error.message],
		});
	}
});

router.patch(`${path_admin}/update-post/:id`, async (req, res) => {
	const id = req.params.id;
	const body = req.body;
	const messageError = 'Error al actualizar el post';
	try {
		const validateSchemaPost = new ValidateSchemaPost();
		const schemaId = validateSchemaPost.id(id);
		if (!schemaId.success) {
			return res.status(400).json({
				status: 400,
				msg: messageError,
				detail: [schemaId.msgError],
			});
		}
		const schemaPost = validateSchemaPost.update(body);
		if (!schemaPost.success) {
			return res.status(400).json({
				status: 400,
				msg: messageError,
				detail: [schemaPost.msgError],
			});
		}
		const post = await PostRepository.getOne(id);
		if (!post) {
			return res.status(404).json({
				status: 404,
				msg: messageError,
				detail: ['Post no encontrado en la base de datos', { id }],
			});
		}

		const postUdated = await PostRepository.updateOne(id, body);

		return res.status(200).json({
			status: 200,
			msg: 'Post actualizado exitosamente',
			data: postUdated,
		});
	} catch (error) {
		return res.status(400).json({
			status: 400,
			msg: messageError,
			detail: [error.message],
		});
	}
});

router.delete(`${path_admin}/delete-post/:id`, async (req, res) => {
	const messageError = 'Error al momento de eliminar el Post';
	const validateSchemaPost = new ValidateSchemaPost();
	try {
		const id = req.params.id;
		const schemaId = validateSchemaPost.id(id);
		if (!schemaId.success) {
			return res.status(400).json({
				status: 400,
				msg: messageError,
				detail: [schemaId.msgError],
			});
		}
		const post = await PostRepository.getOne(id);
		if (!post) {
			return res.status(404).json({
				status: 404,
				msg: messageError,
				detail: ['Post no encontrado en la base de datos', { id }],
			});
		}

		const postUdated = await PostRepository.updateOne(id, { deleted: true });

		return res.status(200).json({
			status: 200,
			msg: 'Post eliminado exitosamente',
			data: postUdated,
		});
	} catch (error) {
		return res.status(400).json({
			status: 400,
			msg: messageError,
			detail: [error.message],
		});
	}
});

export const postRouter = router;
