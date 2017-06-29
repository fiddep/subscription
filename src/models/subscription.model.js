const subscriptionSchema = joi => ({
  expirationDate: joi.number().required(),
  status: joi
    .any()
    .valid('active', 'unpaid', 'past_due', 'canceled')
    .default('unpaid'),
  plans: joi.array().items(joi.object())
})

module.exports = subscriptionSchema
