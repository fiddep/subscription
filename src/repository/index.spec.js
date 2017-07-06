/* eslint-env jest */

const { connect } = require('./')

describe('Subscription System', () => {
  it('works', async () => {
    const subscriptionService = await connect(db())
    const expirationDate = new Date().getTime()
    const created = await subscriptionService.createSubscription({
      expirationDate
    })
    expect(created.expirationDate).toEqual(expirationDate)

    const subscriptions = await subscriptionService.getSubscriptions({
      filter: 'all'
    })
    expect(subscriptions.length).toEqual(1)

    await subscriptionService.updateSubscription(subscriptions[0].id, {
      status: 'active'
    })

    const activeSubscriptions = await subscriptionService.getSubscriptions({
      filter: 'active'
    })
    expect(activeSubscriptions.length).toEqual(1)

    const unpaidSubscriptions = await subscriptionService.getSubscriptions({
      filter: 'unpaid'
    })
    expect(unpaidSubscriptions.length).toEqual(0)
  })
})

const db = () => {
  const _subscriptions = []

  const find = async query => {
    const filtered = _subscriptions.filter(subscription => {
      if (query.filter === 'all') return true
      if (query.filter === 'active' || query.filter === 'unpaid') {
        return subscription.status === query.filter
      }

      return false
    })

    return filtered
  }

  const findOne = async id => {
    const subscription = _subscriptions.find(x => x.id === id)
    return subscription
  }

  const insert = async data => {
    data.id = new Date().getTime()
    const newSubscription = data
    _subscriptions.push(newSubscription)
    return newSubscription
  }

  const update = async (id, data) => {
    const subscription = await findOne(id)
    Object.assign(subscription, data)
    return subscription
  }

  const remove = async id => {
    const subscription = await findOne(id)
    _subscriptions.splice(subscription, 1)
  }

  return Object.assign(
    {},
    {
      find,
      findOne,
      insert,
      update,
      remove
    }
  )
}
