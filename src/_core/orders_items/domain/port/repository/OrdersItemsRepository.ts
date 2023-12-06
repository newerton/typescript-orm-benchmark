export type OrdersItemsRepositoryInput = {
  order_id: string;
  item_id: string;
};

export type OrdersItemsRepositoryOutput = {
  id: string;
  order_id: string;
  item_id: string;
};

export type OrdersItemsRepositoryCountOutput = {
  data: OrdersItemsRepositoryOutput[];
  count: number;
};

export type OrdersItemsRepositoryFilter = {
  id?: string;
  order_id?: string;
  item_id?: string;
};

export interface OrdersItemsRepository {
  create(
    payload: OrdersItemsRepositoryInput,
  ): Promise<OrdersItemsRepositoryOutput>;
  update(
    id: string,
    payload: OrdersItemsRepositoryInput,
  ): Promise<OrdersItemsRepositoryOutput>;
  delete(id: string): Promise<any>;
  deleteMany(filter: OrdersItemsRepositoryFilter): Promise<any>;
  findOne(
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryOutput>;
  findAll(
    page: number,
    limit: number,
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryCountOutput>;
  findFull(
    filter: OrdersItemsRepositoryFilter,
  ): Promise<OrdersItemsRepositoryOutput[]>;
}
