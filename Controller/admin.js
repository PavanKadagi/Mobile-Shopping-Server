const Admin = require('../models/productSchema')

const addAllProducts = async(req,res)=>{
   try {
     // console.log(req.body);
     let {company,model,price,img,description,rom,ram,camera,processor,display,os} = req.body;

     if( !company || !model || !price || !img || !description || !rom || !ram || !camera || !processor || !display || !os){
      return res.status(400).json({error:"Please fill all field...!"})
     }
    //  console.log('company',company)
     company = company.replace(' ','');
     const modelExist = await Admin.findOne({model:model});
     if(modelExist){
    return res.status(400).json({error:`${model} is already there...!`})
     }
     const products = await Admin.create({
         company,model,price,img,description,rom,ram,camera,processor,display,os
     });
     if(products){
      return res.status(201).json({message:"Uploaded Successfully...!"})
     }else{
      return res.status(400).json({error:"something happend...!"})
     }
   } catch (error) {
    res.status(400).json({error:error?.errors?.company?.message})
    console.log('------',error)
    // console.log(error.message)
   }
    
}

module.exports ={addAllProducts}