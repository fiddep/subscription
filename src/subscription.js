const { validate } = require('./models/')
const { initPlan, isPlansEqual, calculatePlanInterval } = require('./plan')
const { insertArrayItem, removeArrayItem, isRequired } = require('./utils')

const initSubscription = async object => {
  try {
    const plan = await initPlan()
    const today = new Date().getTime()
    const expirationDate = calculatePlanInterval({
      plan,
      expirationDate: today
    })
    const newSubscription = Object.assign(
      {},
      {
        plans: [plan],
        expirationDate
      },
      object
    )
    return await validateSubscription(newSubscription)
  } catch (e) {
    throw new Error(e)
  }
}

/* Wrapper method to make sure updatePeriod is called */
const getSubscriptionStatus = async (sub = isRequired()) => {
  const result = await updatePeriod(sub)
  return result.status
}

/* Loop through plans and add the amounts */
const getSubscriptionCost = (sub = isRequired()) => {
  const { plans } = sub
  if (plans.length === 1) return plans[0].amount
  else {
    let totalAmount = 0
    for (let i = 0; i < plans.length; i++) {
      totalAmount += plans[i].amount
    }
    return totalAmount
  }
}

/* Translation of the different status into bools */
const isSubscriptionBillable = async (sub = isRequired()) => {
  const updatedSub = await updatePeriod(sub)
  const { status } = updatedSub

  if (status === 'unpaid') return true
  if (status === 'past_due') return true

  return false
}

/* Change one plan for another */
const changeSubscriptionPlan = (sub = isRequired(), currentPlan, newPlan) => {
  const { plans } = sub

  let newPlans = addSubscripionPlan(plans, newPlan)

  const index = plans.indexOf(currentPlan)
  if (newPlans && index !== -1) {
    newPlans = removeArrayItem(newPlans, index)
    return Object.assign({}, sub, { plans: newPlans })
  } else {
    return sub
  }
}

/* Add new plan to subscription */
const addSubscripionPlan = (plans = isRequired(), newPlan) => {
  const ePlan = plans[0]
  if (isPlansEqual({ plan1: ePlan, plan2: newPlan })) {
    return insertArrayItem(plans, newPlan)
  } else {
    return false
  }
}

/* Always call this function to make sure status is up to date */
const updatePeriod = async (sub = isRequired(), paid = false) => {
  let newAttributes

  if (paid) {
    newAttributes = {
      status: 'active',
      expirationDate: calculatePlanInterval({
        plan: sub.plans[0],
        expirationDate: getExpirationDate(sub)
      })
    }
  } else if (!isSubscriptionActive(sub) && sub.status === 'active') {
    newAttributes = { status: 'past_due' }
  }
  const newSub = Object.assign({}, sub, newAttributes)
  const result = await validateSubscription(newSub)
  return result
}

/* Used to update object so it's always validated */
const validateSubscription = async (sub = isRequired()) => {
  const result = await validate(sub, 'subscription')
  return result
}

/* True is expirationDate is > current unix epoch */
const isSubscriptionActive = (sub = isRequired()) =>
  getExpirationDate(sub) > new Date().getTime()

// TODO is this needed?
const getExpirationDate = (sub = isRequired()) => sub.expirationDate

module.exports = {
  initSubscription,
  validateSubscription,
  getExpirationDate,
  getSubscriptionCost,
  getSubscriptionStatus,
  isSubscriptionActive,
  updatePeriod,
  addSubscripionPlan,
  isSubscriptionBillable,
  changeSubscriptionPlan
}
