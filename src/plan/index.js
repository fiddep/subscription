const { validate } = require('../models/')

const defaultPlan = () => ({
  name: 'testPlan',
  amount: 999
})

const initPlan = async object => {
  try {
    return await setValues(object)
  } catch (e) {
    throw new Error(e)
  }
}

const setValues = async object => {
  const newPlan = Object.assign({}, defaultPlan(), object)
  const result = await validate(newPlan, 'plan')
  return Object.assign({}, result)
}

/* Return the unix epoch for when the next expirationDate is */
const calculatePlanInterval = ({ plan, expirationDate }) => {
  const { interval, intervalCount } = plan
  const dateObject = new Date(expirationDate)

  if (interval === 'month') {
    dateObject.setUTCMonth(dateObject.getUTCMonth() + 1 * intervalCount)
  } else if (interval === 'day') {
    dateObject.setUTCDate(dateObject.getUTCDate() + 1 * intervalCount)
  } else if (interval === 'year') {
    dateObject.setUTCFullYear(dateObject.getUTCFullYear() + 1 * intervalCount)
  } else {
    throw new Error('interval not valid')
  }

  return dateObject.getTime()
}

/* interval and intervalCount must be equal so billing can happen at the same time */
const isPlansEqual = ({ plan1, plan2 }) =>
  plan1.interval === plan2.interval &&
  plan1.intervalCount === plan2.intervalCount

module.exports = {
  initPlan,
  calculatePlanInterval,
  isPlansEqual
}
