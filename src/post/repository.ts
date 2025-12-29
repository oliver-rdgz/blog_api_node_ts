import { Schema, model } from 'mongoose';
import {
	DateRangeT,
	PostCreateT,
	PostPagination,
	PostUpdateT,
} from './types';
import { v4 as uuid } from 'uuid';

const schemaPost = new Schema({
	_id: { type: String, required: true, default: uuid },
	title: { type: String, require: false },
	img: { type: String, require: false },
	content: { type: String, require: false },
	deleted: { type: Boolean, default: false },
	created: { type: Date, default: new Date() },
	updated: { type: Date },
});

schemaPost.pre('save', function async() {
	this.updated = new Date();
});

export class PostRepository {
	private static model = model('Post', schemaPost);
	static async create(...post: PostCreateT[]) {
		const created = await PostRepository.model.create(post);
		return created;
	}

	static async getOne(id: string) {
		const post = await PostRepository.model.findOne({
			_id: id,
			deleted: false,
		});
		return post;
	}
	static async updateOne(id: string, data: PostUpdateT) {
		const postUpdated = await PostRepository.model.findByIdAndUpdate(id, data, {
			new: true,
		});
		return postUpdated;
	}

	static async pagination(filter: PostPagination) {
		const filterText = { $or: [] };
		const filterDate = { created: undefined };
		if (filter.title) {
			filterText['$or'].push({
				title: { $regex: filter.title, $options: 'i' },
			});
		}
		if (filter.content) {
			filterText['$or'].push({
				content: { $regex: filter.content, $options: 'i' },
			});
		}
		if (filter.date) {
			const dateFilter = filter.date as DateRangeT;
			filterDate.created = {
				$gt: dateFilter.init,
				$lt: dateFilter.end,
			};
		}
		const postPagination = await PostRepository.model.find({
			...filterText,
			...filterDate,
			deleted: false,
		});
		return postPagination;
	}
}
