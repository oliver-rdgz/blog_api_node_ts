import {
	PostCreateOutT,
	PostGetOutT,
	PostRepositoryT,
	PostUpdateOutT,
} from './types';

export class PostOutput {
	create(post: PostRepositoryT[]): PostCreateOutT {
		return post.map((element) => ({
			id: element._id,
			title: element.title,
		}))[0];
	}

	detail(post: PostRepositoryT): PostGetOutT {
		return { id: post._id, title: post.title, content: post.content };
	}

	update(post: PostRepositoryT): PostUpdateOutT {
		return { id: post._id, title: post.title };
	}
	pagination(post: PostRepositoryT[]): PostGetOutT[] {
		return post.map((element) => ({
			id: element._id,
			title: element.title,
			content: element.content,
		}));
	}
}
