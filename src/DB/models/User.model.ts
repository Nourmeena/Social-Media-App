import { model, models,Schema, HydratedDocument } from "mongoose";


export enum GenderEnum {
  male = "male",
  female = "female",
}
export enum RoleEnum {
  admin = "admin",
  user = "user",
}

export interface IUser {
    username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  email: string;
  confirmEmailOTP?: string;
  confirmAtDate?: Date;
  password: string;
  confirmPassword: string;
  changeCredentialsTime?: Date;
  gender: GenderEnum;
  role: RoleEnum;
  createdAt: Date;
  updatedAt: Date;
}


const userSchema = new Schema <IUser> ({
    firstName:{type:String,required:true,minLength:2,maxLength:25},
    lastName: {type:String,required:true,minLength:2,maxLength:25},
    phone: {type:String},
    address: {type:String},
    email: {type:String,required:true,unique:true},
    confirmEmailOTP: {type:String},
    confirmAtDate:{type:Date},
    password: {type:String},
    confirmPassword: {type:String},
    changeCredentialsTime:{type:Date},
    gender: {type:String,enum:GenderEnum,default:GenderEnum.male},
    role: {type:String,enum:RoleEnum,default:RoleEnum.user},

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
)
userSchema.virtual("username")
    .set(function (value: string) {
    const [firstName, lastName] = value.split(" ") || {}
        this.set({ firstName, lastName })
        
    }
)
    .get(function () {
        return this.firstName+" "+this.lastName
    })

export const UserModel = models.User || model<IUser>("User", userSchema)
export type HUserDocument=HydratedDocument<IUser>