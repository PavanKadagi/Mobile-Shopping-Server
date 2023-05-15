const mongoose = require('mongoose');

mongoose.connect(process.env.DB_SERVER,{
    useNewUrlParser: true, useUnifiedTopology: true
}).then((res)=>console.log('Connection success..!')).catch((err)=>console.log('No connection',err.message))

