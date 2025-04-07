/* eslint-disable @typescript-eslint/no-explicit-any */
interface IProduct {
  id: number;
  name: string;
}

export interface IGetProductsResponse {
  data: {
    count: number;
    next: string | null;
    previous: string | null;
    results: IProduct[];
  };
  errors: any[];
  status: string;
}
