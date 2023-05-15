const Products = require('../models/productSchema')
const User = require('../models/userSchema')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');


//  send mail for verify email
const sendVerifyMail = (name,email,userId)=>{
    console.log('sendVerifyMail',name,email,userId)
    try {
  
      // let config = {
      //   service:'gmail',
      //   auth:{
      //     user:'pavankadagi02@gmail.com',
      //     pass:'xibxxasjsfhdaouz'
      //   }
      // }
  
      // let transporter = nodemailer.createTransport(config)
  
      // let mailGenerator = new Mailgen({
      //   theme:"default",
      //   product:{
      //     name:"Mailgen",
      //     link:"https://mailgen.js"
      //   }
      // })
  
      // let response = {
      //   body:{
      //     name,
      //     intro:'Your bill has arrived!',
      //     table:{
      //       data:[
      //         {
      //           item:"Nodemailer Stack Book",
      //           description:"A Backend application",
      //           price:"$10"
      //         }
      //       ]
      //     },
      //     outro:"Looking forword to do more business"
      //   }
      // }
  
      // let mail = mailGenerator.generate(response);
  
      // let message = {
      //   from: "pavankadagi02@gmail.com",
      //   to:email,
      //   subject:"Please Prder",
      //   html:mail
      // }
  
      // transporter.sendMail(message).then(()=>console.log(
      //   'you should receive an email'
      // )).catch((err)=>console.log(err)) 
  
  
      // google smtp
    const transporter =  nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        requireTLS:true,
        auth:{
          user:process.env.EMAIL,
          pass:process.env.PASS
        }
      });
  
      const mailOptions = {
        from:process.env.EMAIL,
        to:email,
        subject:'For Verification mail',
        html:`<p>Hi ${name}, please click here to <a href="https://mobile-shopping.onrender.com/verify?id=${userId}"> Verify </a> your mail.</p>`
      }
     
  
      transporter.sendMail(mailOptions).then(()=>console.log(
        'you should receive an email'
      )).catch((err)=>console.log("mail",err))
    } catch (error) {
      console.log(error.message) 
    }
  }

const verifyMail = async (req,res)=>{
    try {
      console.log('verifyMail',req.query,req.params)
      const updateUser = await User.findByIdAndUpdate({_id:req.query.id},{is_verified:true});
      console.log(updateUser);
      if(updateUser){
    res.status(200).json({message:"Verify Successfully...!"})
      }else{
        res.status(400).json({error:"User is already login...!"})
      }
    } catch (error) {
      res.status(400).json({error:"not validate"})
      console.log("verifyMail",error.message)
    }
  }

const userSignUp = async (req, res) => {
    try {
      const { nameVal, emailVal, phoneVal, passwordVal } = req.body;
      if (
        !nameVal ||
        !emailVal ||
        !phoneVal ||
        !passwordVal
      ) {
        return res
          .status(422)
          .json({ error: "Plz filled the field properly...!" });
      }
  
      const userEmailExist = await User.findOne({ email: emailVal });
      const userPhoneExist = await User.findOne({ phone: phoneVal });

      console.log(userEmailExist,userPhoneExist)
      if (userEmailExist) {
        return res.status(422).json({ error: "Email already Exist...!" });
      }
      if(userPhoneExist){
        return res.status(422).json({ error: "Phone no already Exist...!" });
      }
  
      const newUser = new User({
        name:nameVal,
        email:emailVal,
        phone:phoneVal,
        password:passwordVal,
        is_admin:false
      });
  
      const userData = await newUser.save();
    
      if(userData){
        console.log('00000000000',userData._id)
        sendVerifyMail(nameVal,emailVal,userData._id);
      res.status(201).json({ message: "Your registration has been successfully, Please verify your mail." }); 
      }
      else{
      res.status(500).json({ error: "Failed to registered...!" });
      }
    } catch (error) {
      console.log("login ---", error.message);
      res.status(500).json({ error: "Failed to registered...!" });
    }
  };

  const userSignIn = async (req, res) => {
    try {
      console.log(req.body)
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Plz filled the field properly...!" });
      }
  
      const userLogin = await User.findOne({ email: email });
      // console.log(userLogin)
  
      if (userLogin) {
        const passwordMatch = await bcrypt.compare(password, userLogin.password);
  
        if (passwordMatch) {
         if(userLogin.is_verified){
             //need to generate the token and stored cookie after the password match
             const token = await userLogin.generatingToken();
             console.log("-------------token", token);
     
             res.cookie("user", token, {
              expires: new Date(Date.now() + 258900000),
              httpOnly: true,
              secure:true,
              sameSite:"none"
            }); 
            let name = userLogin.name;  
            let admin  = userLogin.is_admin;
            
               
          return res.status(200).json({ message: "Signin Successfull...!",token,name,admin });
         }else{
          return res.status(400).json({ error: "Please verify your mail...!" });
         }
        } else {
          return res.status(400).json({ error: "Invalid Credientials...!" });
        }
      } else {
        return res.status(400).json({ error: "Invalid Credientials " });
      }
    } catch (error) {
      console.log(error)
      return res.status(400).json({ error: "Invalid Credientials" });
    }
  };


  const sendVerificationLink = async (req,res)=>{
    try {
     const {email} = req.body;
     let user = await User.findOne({email});
     console.log(user);
     if(user){
       sendVerifyMail(user.name,user.email,user._id);
       res.status(200).json({message:"Reset verification mail send to your mail id, please check...!"})
     }else{
       res.status(400).json({error:"This email is not exist...!"})
     }
    } catch (error) {
     console.log(error.message)
    }
   }

  const userLogout = async (req,res)=>{
    try {
  console.log('Before',req.rootUser.tokens.length);
  req.rootUser.tokens = req.rootUser.tokens.filter((token)=>token.token !== req.token);
  res.clearCookie('user');
  const userLogout = await req.rootUser.save();
  if(userLogout){
   res.status(200).json({message: 'Logout Successfully'})
  }else{
    res.status(400).json({error:"User is not login...!"})
  }
  console.log('After',req.rootUser.tokens.length);
  } catch (error) {
       res.status(500).json({error:'user not logout'})
  }
  }

  //  send mail for reset password
const SendResetPassword = (name,email,token)=>{
  console.log('sendVerifyMail',name,email,token)
  try {
    // google smtp
  const transporter =  nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      requireTLS:true,
      auth:{
        user:process.env.EMAIL,
        pass:process.env.PASS
      }
    });

    const mailOptions = {
      from:process.env.EMAIL,
      to:email,
      subject:'For Reset Password',
      html:`<p>Hi ${name}, please click here to <a href="https://mobile-shopping.onrender.com/forget-password?token=${token}"> Reset </a> your password.</p>`
                                                    // ${process.env.CIIENT_URL}
    }
    

    transporter.sendMail(mailOptions).then(()=>console.log(
      'you should receive an email'
    )).catch((err)=>console.log("mail",err))
  } catch (error) {
    console.log(error.message) 
  }
}

  const forgetPassword = async (req,res)=>{
    try {
      const {email} = req.body;
      const user = await User.findOne({email});
      console.log(user);
      if(user){
        if(user.is_verified){
        const randomString = randomstring.generate();
        const updateUser = await User.updateOne({email},{$set:{token:randomString}}) 
        console.log(updateUser)
        SendResetPassword(user.name,user.email,randomString)
        res.status(200).json({message:"Please check your mail to reset your password...!"})
        }else{
        res.status(400).json({error:"Please verify your mail...!"})
        }
      }else{
        res.status(400).json({error:"User email is incorrect...!"})
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const verifyPassword = async (req,res)=>{
    try {
      const {token} = req.body;
      console.log('verifyPassword',token);
      const tokenData = await User.findOne({token});
      console.log('tokenData',tokenData);
      if(tokenData){
        res.status(200).json({userId:tokenData._id});
      }else{
        res.status(400).json({error:"Token is invalid...!"})
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const resetPassword = async (req,res)=>{
    try {
      const {password,id} = req.body;
      console.log('password',password,id);
      const newPassword = await bcrypt.hash(password,10);
  
      const updateData = await User.findByIdAndUpdate({_id:id},{$set:{password:newPassword,token:''}})
      if(updateData){
        res.status(200).json({message:"Password Update Successfully...!"});
      }
  
    } catch (error) {
      console.log(error.message)
    }
  }

  const getAllProducts = async(req,res)=>{
    try {
        // console.log('----',req.query);
        let {company,model,sort,price,page} = req.query;
        let queryObject = {}
        if(company){
            company = company.toLowerCase();
            company = company.replace(' ','');
            if(company == 'all'){
                queryObject ={}
            }
            else{
            queryObject.company = company;
            }
        }
        if(model){
            // queryObject.model = model; 
            queryObject.model = {$regex:model,$options:'i'};
        }
        if(price){
            queryObject.price = price;
        }
        // console.log(queryObject)
        let apiData = Products.find(queryObject);  
        if(sort){
        // in query we have write like sort=name,price
            console.log('sort',sort)
            let sortFix = sort.split(',').join(' ');
            apiData = apiData.sort(sortFix); 
        }
        if(page){
            // console.log('-----------------',req.query.page,req.query.limit)
            let page = req.query.page || 1;
            let limit = req.query.limit || 9;
            let skip = (page - 1) * limit;
            apiData = apiData.skip(skip).limit(limit);
        }
          let data = await apiData;
        // console.log(data)
        res.status(200).json({data,length:data.length})
    } catch (error) {
        console.log(error.message);
    }
}

const singleProduct = async(req,res)=>{
   try {
    console.log('-----',req.params,req.query);
  res.cookie("Test","Pavan");
   const  singleProduct = await Products.findById(req.query);
    console.log(singleProduct)
    if(singleProduct){
       return res.status(200).json({singleProduct})
    }else{
       return res.status(500).json({error:"Not Exist...!"})
    }
   } catch (error) {
    console.log(error.message)
   }
}

module.exports = {getAllProducts,forgetPassword,verifyPassword,resetPassword,singleProduct,userSignUp,verifyMail,userSignIn,userLogout,sendVerificationLink}