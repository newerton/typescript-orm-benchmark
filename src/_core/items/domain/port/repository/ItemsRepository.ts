export type ItemsRepositoryInput = {
  name: string;
  value: number;
};

export type ItemsRepositoryOutput = {
  id: string;
  name: string;
  value: number;
};

export type ItemsRepositoryCountOutput = {
  data: ItemsRepositoryOutput[];
  count: number;
};

export type ItemsRepositoryFilter = {
  id?: string;
  name?: string;
  value?: number;
};

export interface ItemsRepository {
  create(payload: ItemsRepositoryInput): Promise<ItemsRepositoryOutput>;
  update(
    id: string,
    payload: ItemsRepositoryInput,
  ): Promise<ItemsRepositoryOutput>;
  delete(id: string): Promise<any>;
  deleteMany(filter: ItemsRepositoryFilter): Promise<any>;
  findOne(filter: ItemsRepositoryFilter): Promise<ItemsRepositoryOutput>;
  findAll(
    page: number,
    limit: number,
    filter: ItemsRepositoryFilter,
  ): Promise<ItemsRepositoryCountOutput>;
  findFull(filter: ItemsRepositoryFilter): Promise<ItemsRepositoryOutput[]>;
}
