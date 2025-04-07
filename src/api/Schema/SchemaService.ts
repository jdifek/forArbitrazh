import $api from '../http'
import { ISchemaResponse } from './SchemaTypes'

export default class SchemaService {
	static async getSchema(): Promise<ISchemaResponse> {
		return (await $api.get<ISchemaResponse>('/api/schema/')).data
	}
}
