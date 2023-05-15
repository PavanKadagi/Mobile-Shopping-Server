const dotenv = require("dotenv");
dotenv.config();
require('./DB/connect')
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 5000;
const app = express();



app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:["http://localhost:3000","http://127.0.0.1:3000","https://mobile-shopping.onrender.com"],
    optionsSuccessStatus: 200,
    credentials:true,
    methods:["GET","PUT","PATCH","POST","DELETE","OPTIONS"],
    allowedHeaders:[
     'Access-Control-Allow-Origin',
     'Content-Type',
     'Authorization',
    ],
 }))

app.use(require('./Routes/admin'))
app.use(require('./Routes/user'))

app.listen(port ,()=>{
    console.log(`server start at ${port}`)
})
