import mongoose, { Schema, Types } from "mongoose";
import {toJSONPlugin} from "../helpers/mongoosePlugins.js"


const addressSchema = new Schema({
    label:{
        type:String,
        required:true
    },
    address:{
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
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    }
})
const userSchema = new Schema({
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
    addresses:[],
    wishlist:[
        {
            type:Types.ObjectId,
            ref:"Product"
        }
    ],
    
},{timestamps:true})

userSchema.plugin(toJSONPlugin)

const User = mongoose.model("User",userSchema);

export default User
