import $api from '../http'
import { IGetProductsResponse } from './ProductsTypes';

export default class ProductsService {
  static async getProducts(): Promise<IGetProductsResponse> {
    return (await $api.get<IGetProductsResponse>("products/")).data;
  }
}
