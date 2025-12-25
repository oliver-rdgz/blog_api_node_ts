import { connect, Mongoose } from 'mongoose';
export class DataBaseMongo {
	private static link: Mongoose;
	static async connection() {
		if (DataBaseMongo.link) {
			return DataBaseMongo.link;
		}
		try {
			DataBaseMongo.link = await connect('mongodb://mongo:27017/blog');
			console.log('Estas conectado a la base de datos de mongo');
			return DataBaseMongo.link;
		} catch (e) {
			throw Error(e);
		}
	}
}
