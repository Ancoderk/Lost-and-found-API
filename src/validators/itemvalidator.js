const Joi = require('joi');

const createItem = Joi.object({
  title: Joi.string().max(150).required(),
  description: Joi.string().max(2000).allow(''),
  status: Joi.string().valid('lost','found').required(),
  category: Joi.string().required(),
  location: Joi.string().allow(''),
  date: Joi.date().required(),
  contactInfo: Joi.string().required(),
  imageURL: Joi.string().uri().allow('')
});

const updateItem = Joi.object({
  title: Joi.string().max(150),
  description: Joi.string().max(2000).allow(''),
  status: Joi.string().valid('lost','found'),
  category: Joi.string(),
  location: Joi.string().allow(''),
  date: Joi.date(),
  contactInfo: Joi.string(),
  imageURL: Joi.string().uri().allow('')
}).min(1);

module.exports = { createItem, updateItem };
