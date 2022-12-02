const Joi=require('joi')

const Schemas = {
    createUserSchema:Joi.object().keys({ 
    username: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required(), 
    password: Joi.string().required().min(5).max(10)
  })};

  module.exports=Schemas 