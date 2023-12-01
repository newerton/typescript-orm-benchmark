export type OrdersRepositoryInput = {
  user: string;
};

export type OrdersRepositoryOutput = {
  id: string;
  user: string;
  created_at: Date;
};

export type OrdersRepositoryCountOutput = {
  data: OrdersRepositoryOutput[];
  count: number;
};

export type OrdersRepositoryFilter = {
  id?: string;
  user?: string;
};

export interface OrdersRepository {
  create(payload: OrdersRepositoryInput): Promise<OrdersRepositoryOutput>;
  update(
    id: string,
    payload: OrdersRepositoryInput,
  ): Promise<OrdersRepositoryOutput>;
  delete(id: string): Promise<any>;
  deleteMany(filter: OrdersRepositoryFilter): Promise<any>;
  findOne(filter: OrdersRepositoryFilter): Promise<OrdersRepositoryOutput>;
  findAll(
    page: number,
    limit: number,
    filter: OrdersRepositoryFilter,
  ): Promise<OrdersRepositoryCountOutput>;
  findFull(filter: OrdersRepositoryFilter): Promise<OrdersRepositoryOutput[]>;
}
