import { connect } from 'mongoose'

export const connectDB = async (): Promise<void> => {
    try {
        const result = await connect(process.env.DB_URI as string, {
            serverSelectionTimeoutMS:300000
        }) 
        console.log(result.models)
        console.log("DB connected successfully ")
    } catch (error) {
        console.log(`fail to connect to DB ${error}`)
    }
}
export default connectDB