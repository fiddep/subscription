const planSchema = joi => ({
  id: 'diamond-personal-430', // Unique identifier for the object.
  object: 'plan', // String representing the object’s type. Objects of the same type share the same value.
  amount: joi.number().integer().required(), // The amount in öre to be charged on the interval specified.
  created: joi.number().default(new Date().getTime()), // Time at which the object was created. Measured in seconds since the Unix epoch.
  currency: joi.any().valid('sek').default('sek'), // Three-letter ISO currency code, in lowercase
  interval: joi.any().valid('day', 'week', 'month', 'year').default('month'), // One of day, week, month or year. The frequency with which a subscription should be billed.
  intervalCount: joi.number().integer().min(1).default(1), // The number of intervals (specified in the interval property) between each subscription billing. For example, interval=month and interval_count=3 bills every 3 months.
  livemode: joi.bool().default(false),
  metadata: {},
  name: joi.string().required(), // Display name of the plan.
  statement_descriptor: null, // Extra information about a charge for the customer’s credit card statement.
  trial_period_days: null // Number of trial period days granted when subscribing a customer to this plan. Null if the plan has no trial period.
})

module.exports = planSchema
