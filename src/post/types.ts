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

type PaginationT = {
	page?: number;
	pageSize?: number;
};

export type PostCreateT = Omit<
	PostT,
	'id' | 'createAt' | 'updateAt' | 'deleted' | 'date'
>;

export type PostUpdateT = Partial<
	Omit<PostT, 'id' | 'createAt' | 'updateAt' | 'date'>
>;

export type PostPagination = Partial<
	Pick<PostT, 'title' | 'content' | 'date'>
> &
	PaginationT;
