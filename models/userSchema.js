const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    phone:{
        type:Number,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    tokens:[
        {
            token:{
                type:String,
        required:true
            }
        }
    ],
    is_admin:{
        type:Boolean,
        required:true
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    token:{
        type:String,
        default:'' 
     }
})

userSchema.methods.generatingToken = async function(){
    try {
        const token =  jwt.sign({_id:this._id},process.env.SECRETE_KEY)
        this.tokens = this.tokens.concat({token:token});
        await this.save();
    return token;
    } catch (error) {
        console.log(error)
    }
}

userSchema.pre('save', async function (next){
    if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password,10);
    // return this.password;
    }
    next()
})

// we are generating token




module.exports = new mongoose.model('User',userSchema)