/* eslint-env jest */
const { validate } = require('./')

describe('Schemas Validation', () => {
  it('can validate a subscription object', async () => {
    const testSubscription = getTestSubscription()
    expect.assertions(1)
    const result = await validate(testSubscription, 'subscription')
    expect(result).toBeTruthy()
  })

  it('can validate a plan object', async () => {
    const testPlan = getTestPlan()
    expect.assertions(1)
    const result = await validate(testPlan, 'plan')
    expect(result).toBeTruthy()
  })

  describe('Error handling', () => {
    it('promise reject on no model', () => {
      return expect(validate()).rejects.toBeDefined()
    })
    it('promise reject on invalid model', () => {
      const testPlan = { test: 'This is invalid' }
      return expect(validate(testPlan, 'plan')).rejects.toBeDefined()
    })
  })
})

const getTestSubscription = () => ({
  expirationDate: getCurrentTime(),
  status: 'unpaid',
  plans: []
})

const getTestPlan = () => ({
  amount: 999,
  interval: 'month',
  intervalCount: 1,
  name: 'hej'
})

const getCurrentTime = () => new Date().getTime()
