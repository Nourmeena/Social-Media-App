import { DatabaseRepository } from './database.repository'
import { IUser as TDocument } from '../models/User.model'
import { BadRequestException } from '../../utils/responses/error.response'
import { CreateOptions, HydratedDocument, Model } from 'mongoose'

export class UserRepo extends DatabaseRepository < TDocument > {
    constructor(protected override readonly model: Model<TDocument>) {
        super(model)
    }

    async createUser({ data, options }: {
        data: Partial<TDocument>[];
        options?: CreateOptions | undefined;
    }): Promise<HydratedDocument<TDocument>>{

        const [user] = (await this.create({data,options})) || []
        if (!user) {
            throw new BadRequestException("fail to create a user")
        }
        return user
    }
}
