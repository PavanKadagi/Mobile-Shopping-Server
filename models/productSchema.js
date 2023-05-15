const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    company:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        enum:{
            values:["iphone","samsung","google","realme","oneplus"],
            message:'{VALUE} is  not supported',
        },
    },
    model:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        
    },
    price:{
        type:Number,
        required:true,
        trim:true,

    },
    img:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    rom:{
        type:String,
        required:true,
        trim:true,
    },
    ram:{
        type:String,
        required:true,
        trim:true,
    },
    camera:{
        type:String,
        required:true,
        trim:true,

    },
    processor:{
        type:String,
        required:true,
        trim:true,
    },
    display:{
        type:String,
        required:true,
        trim:true,
    },
    os:{
        type:String,
        required:true,
        trim:true,
    }
});


module.exports = mongoose.model('Products',productSchema)