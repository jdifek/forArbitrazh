export interface IOrder {
  id: number;
  completed_at: string;
  device_name: string;
  total_price: string; // Приходит строкой, конвертируем в number
  product_quantity_ordered: string; // Тоже строка
  product_quantity_delivered: string; // Тоже строка
  product_name: string;
  payment_type: "cache" | "card";
}

export interface IGetOrders {
  count: number;
  next?: string;
  previous?: string;
  results: IOrder[];
}

export interface IGetOrdersResponse {
  data: IGetOrders;
  errors: string[];
  status: string;
}

export interface IGetOrdersParams {
  date_fn?: string;
  date_st?: string;
  device_id?: number;
  limit?: number;
  offset?: number;
  payment_type?: "cache" | "card";
  o?: string; // Поле для сортировки (например, '-completed_at')
}
