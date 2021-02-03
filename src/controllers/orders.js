const Joi = require('joi')
const express = require('express')
const requiresCart = require('../middleware/requiresCart')
const router = express.Router()

const addressSchema = yup.object().shape({
  name: yup.string().required(),
  street1: yup.string().required(),
  street2: yup.string(),
  city: yup.string().required(),
  state: yup.string().required(),
  postalCode: yup.string().required(),
  tel: yup.string(),
  email: yup
    .string()
    .email()
    .required()
  })

const shippingSchema = yup.object().shape({
  id: yup.string().required(),
  shipmentId: yup.string().required(),
  address: addressSchema
})

const paymentInfoSchema = yup.object().shape({
  token: yup.string().required()
})

export const checkoutSchema = yup.object().shape({
  shipping: shippingSchema,
  payment: paymentInfoSchema,
})

router.route('/checkout')
  .get(requiresCart, (req, res) => {
    // return total taxes and such given cart
    res.send('checkout')
  })
  .post(requiresCart, (req, res) => {
    // Make the payment
    res.send('checkout')
  })

router.route('/order')
  .get(':orderId', (req, res) => {
    // return total taxes and such given cart
    res.send('order')
  })

module.exports = router