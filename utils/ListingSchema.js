const Joi = require('joi');

const listingValidate = Joi.object({
    title: Joi.string().required(),
    description:Joi.string().required(),
    price:Joi.number().required().min(0),
    url:Joi.string().allow(""),
    location:Joi.string().required(),
    country:Joi.string().required(),
    category:Joi.string().required(),
})
const reviewValidate = Joi.object({
   rating:Joi.number().required().max(5).min(1),
   comment:Joi.string().required()
})

module.exports={listingValidate,reviewValidate};