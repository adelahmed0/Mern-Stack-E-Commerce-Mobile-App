import mongoose, { Schema, Types,Document } from "mongoose";
import {toJSONPlugin} from "../helpers/mongoosePlugins.js"

export interface IAddress {
    label:string,
    fullName:string,
    streetAddress:string,
    city:string,
    state:string,
    zipCode:string,
    phoneNumber:string,
    isDefault:boolean
}
export interface IUser extends Document {
    email:string,
    name:string,
    imageUrl:string,
    clerkId:string,
    addresses:IAddress[],
    wishlist:Types.ObjectId[],
}

const addressSchema = new Schema<IAddress>({
    label:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true
    },
    streetAddress:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    zipCode:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    isDefault:{
        type:Boolean,
        default:false
    }
})
const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: ""
    },
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    addresses:[addressSchema],
    wishlist:[
        {
            type:Types.ObjectId,
            ref:"Product"
        }
    ],
    
},{timestamps:true})

userSchema.plugin(toJSONPlugin)

const User = mongoose.model<IUser>("User",userSchema);

export default User
