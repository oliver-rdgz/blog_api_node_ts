import BaseJoi, { Extension, Root, ValidationResult } from 'joi';
import { PostCreateT, PostPagination, PostUpdateT } from './types';
import JoiDate from '@joi/date';
//Necesario para colocarle formato a las fechas
const Joi = BaseJoi.extend(JoiDate as unknown as Extension) as Root;

const valuesAllowed = {
	titleMin: 2,
	titleMax: 100,
	imgRegex:
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/,
	contentMin: 10,
	contentMax: 10000,
};

const baseSchema = {
	title: Joi.string().min(valuesAllowed.titleMin).max(valuesAllowed.titleMax),
	img: Joi.string().regex(valuesAllowed.imgRegex).optional().messages({
		'string.base': 'La imagen debe ser un texto',
		'string.pattern.base': 'La imagen debe tener un formato de enlace web',
	}),
	content: Joi.string()
		.min(valuesAllowed.contentMin)
		.max(valuesAllowed.contentMax),
};

const createSchema = Joi.object({
	title: baseSchema.title.required().messages({
		'string.base': 'El titulo debe ser un texto',
		'string.min': `El titulo debe tener mínimo ${valuesAllowed.titleMin} caracteres`,
		'string.max': `El titulo debe tener máximo ${valuesAllowed.titleMax} caracteres`,
		'any.required': 'El titulo es requerido',
	}),
	img: baseSchema.img,
	content: baseSchema.content.required().messages({
		'string.base': 'El contenido debe ser un texto',
		'string.min': `El contenido debe tener mínimo ${valuesAllowed.contentMin} caracteres`,
		'string.max': `El contenido debe tener máximo ${valuesAllowed.contentMax} caracteres`,
		'any.required': 'El contenido es requerido',
	}),
})
	.required()
	.messages({ 'any.required': 'Los datos del post son requeridos' });

const updateSchema = Joi.object({
	title: baseSchema.title.optional().messages({
		'string.base': 'El titulo debe ser un texto',
		'string.min': `El titulo debe tener mínimo ${valuesAllowed.titleMin} caracteres`,
		'string.max': `El titulo debe tener máximo ${valuesAllowed.titleMax} caracteres`,
	}),
	img: baseSchema.img,
	content: baseSchema.content.optional().messages({
		'string.base': 'El contenido debe ser un texto',
		'string.min': `El contenido debe tener mínimo ${valuesAllowed.contentMin} caracteres`,
		'string.max': `El contenido debe tener máximo ${valuesAllowed.contentMax} caracteres`,
	}),
})
	.min(1)
	.required()
	.messages({
		'any.required': 'Para actualizar el post se necesitan los datos requeridos',
		'object.min': 'Para actualizar el post se necesitan los datos requeridos',
	});

const idSchema = Joi.string()
	.regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
	.required()
	.messages({
		'string.pattern.base': 'El id debe tener un formato uuid',
		'string.base': 'El id debe ser de tipo texto',
		'any.required': 'El id es requerido',
	});

const paginationSchema = Joi.object({
	title: Joi.string()
		.max(50)
		.optional()
		.messages({
			'string.base': 'El titulo debe ser un texto',
			'string.max': `El titulo debe tener máximo ${50} caracteres`,
		}),
	content: Joi.string()
		.max(200)
		.optional()
		.messages({
			'string.base': 'El contenido debe ser un texto',
			'string.max': `El contenido debe tener máximo ${200} caracteres`,
		}),
	date: Joi.alternatives()
		.try(Joi.string().valid('month', 'week'), Joi.date().format('YYYY-MM-DD'))
		.optional()
		.messages({
			'alternatives.types': 'La fecha enviada no es valida',
			'date.format': 'La fecha debe tener un formato AAAA-MM-DD'
		}),
	page: Joi.number()
		.min(1)
		.max(10000)
		.default(1)
		.messages({
			'number.min': `La pagina mínima es ${1}`,
			'number.base': 'La pagina debe ser de tipo numerico',
			'number.max': `La pagina llega máximo a ${10000}`,
		}),
	pageSize: Joi.number()
		.min(3)
		.max(200)
		.default(3)
		.messages({
			'number.min': `El tamaño mínimo de la pagina es ${3}`,
			'number.base': 'El tamaño de la pagina debe ser de tipo numerico',
			'number.max': `El tamaño de la pagina llega máximo a ${200}`,
		}),
});
export class ValidateSchemaPost {
	private validationResponse<T extends ValidationResult>(dataValidated: T) {
		const { error, value } = dataValidated;
		if (error) {
			return {
				success: false,
				msgError: error.message,
				detail: [...error.details],
			};
		}
		return { success: true, data: value as PostCreateT };
	}
	create(data: PostCreateT) {
		const schemaValidated = createSchema.validate(data);
		return this.validationResponse(schemaValidated);
	}

	update(data: PostUpdateT) {
		const schemaValidated = updateSchema.validate(data);
		return this.validationResponse(schemaValidated);
	}

	id(id: string) {
		const schemaValidated = idSchema.validate(id);
		return this.validationResponse(schemaValidated);
	}

	pagination(data: PostPagination) {
		const schemaValidated = paginationSchema.validate(data);
		console.log(schemaValidated.error);
		return this.validationResponse(schemaValidated);
	}
}
