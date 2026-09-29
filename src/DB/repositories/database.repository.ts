import {
  CreateOptions,
  HydratedDocument,
  Model,
  FlattenMaps,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  QueryFilter,
} from "mongoose";
export type Lean<T>=HydratedDocument<FlattenMaps<T>>
export abstract class DatabaseRepository<TDocument> {
  constructor(protected readonly model: Model<TDocument>) {}
  async findOne({
    filter,
    select,
    options,
  }: {
    filter?: QueryFilter<TDocument> | null;
    select?: ProjectionType<TDocument> | null;
    options?: QueryOptions<TDocument> | null;
  }): Promise<HydratedDocument<TDocument> | Lean<TDocument> | null> {
    const doc = this.model.findOne((filter || {}) as any).select(select || "");
    if (options?.lean) {
      doc.lean(options.lean);
    }
    if (options?.populate) {
      doc.populate(options.populate as PopulateOptions[]);
    }
    return await doc.exec();
  }
  async create({
    data,
    options,
  }: {
    data: Partial<TDocument>[];
    options?: CreateOptions | undefined;
  }): Promise<HydratedDocument<TDocument>[] | undefined> {
    return (await this.model.create(
      data as any,
      options,
    )) as unknown as HydratedDocument<TDocument>[];
  }
}