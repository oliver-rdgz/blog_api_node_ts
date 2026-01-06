export type DateRangeT = {
	init: Date;
	end: Date;
};

type PostT = {
	id: string;
	title: string;
	img: string;
	content: string;
	deleted: boolean;
	date: DateRangeT;
	createAt: Date;
	updateAt: Date;
};

export type PostRepositoryT = Partial<
	Omit<PostT, 'id' | 'date'> & { _id: string }
>;

type PaginationT = {
	page?: number;
	pageSize?: number;
};

export type PostCreateT = Omit<
	PostT,
	'id' | 'createAt' | 'updateAt' | 'deleted' | 'date'
>;
export type PostCreateOutT = Pick<PostT, 'id' | 'title'>;

export type PostUpdateOutT = PostCreateOutT;

export type PostGetOutT = Pick<PostT, 'id' | 'title' | 'content'>;

export type PostUpdateT = Partial<
	Omit<PostT, 'id' | 'createAt' | 'updateAt' | 'date'>
>;

export type PostPagination = Partial<
	Pick<PostT, 'title' | 'content' | 'date'>
> &
	PaginationT;
