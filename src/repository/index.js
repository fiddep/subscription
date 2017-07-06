'use strict'

const { validateSubscription } = require('../subscription')

const repository = async db => {
  const getSubscriptions = async query => {
    const subscriptions = await db.find({
      filter: query.filter
    })
    return subscriptions
  }

  const createSubscription = async data => {
    let newSubscription = await validateSubscription(data)
    newSubscription = await db.insert(newSubscription)
    return newSubscription
  }

  /*
  TODO get subscription what should be updated create new subscription
  validate and insert over old subscription
  */
  const updateSubscription = async (subscriptionId, data) => {
    const updatedSubscription = await db.update(subscriptionId, data)

    return updatedSubscription
  }

  const deleteSubscription = async subscriptionId => {
    await db.remove(subscriptionId)
  }

  return {
    getSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription
  }
}

const connect = async connection => {
  if (!connection) {
    throw new Error('connection db not supplied!')
  }
  return repository(connection)
}

module.exports = Object.assign({}, { connect })
