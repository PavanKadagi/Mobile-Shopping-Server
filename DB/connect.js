const mongoose = require('mongoose');
const url = process.env.CLIENT_URL;
mongoose.connect(process.env.DB_SERVER,{
    useNewUrlParser: true, useUnifiedTopology: true
}).then((res)=>console.log('Connection success..!')).catch((err)=>console.log('No connection',err.message)).mongoose.set('useFindAndModify', false)

