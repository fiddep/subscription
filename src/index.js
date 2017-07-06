global.Promise = require('bluebird')

const {
  initSubscription,
  isSubscriptionBillable,
  getSubscriptionCost,
  changeSubscriptionPlan,
  updatePeriod
} = require('./subscription')
const plan = require('./plan')

// TODO export sub and plan, expose only methods that are nessecary
module.exports = {
  subscription: {
    initSubscription,
    isSubscriptionBillable,
    getSubscriptionCost,
    changeSubscriptionPlan,
    updatePeriod
  },
  plan: {
    initPlan: plan.initPlan
  }
}

const trfPlan = { amount: 20, interval: 'month', intervalCount: 6 }
const unionPlan = { amount: 100, interval: 'month', intervalCount: 6 }
const undefinedPlan = { amount: 180, interval: 'month', intervalCount: 6 }
const definedPlan = { amount: 200, interval: 'month', intervalCount: 6 }

let sub = {
  plans: [trfPlan, unionPlan, undefinedPlan],
  expirationDate: Date.UTC(2017, 0, 1)
}

console.log(getSubscriptionCost(sub))

sub = changeSubscriptionPlan(sub, undefinedPlan, definedPlan)

console.log(sub)
console.log(new Date(sub.expirationDate))

updatePeriod(sub, true).then(async sub => {
  console.log(new Date(sub.expirationDate))
  let test = await updatePeriod(sub, true)
  console.log(new Date(test.expirationDate))
})
