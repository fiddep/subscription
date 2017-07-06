/* eslint-env jest */

const {
  initSubscription,
  getExpirationDate,
  isSubscriptionActive,
  getSubscriptionStatus,
  updatePeriod,
  getSubscriptionCost,
  addSubscripionPlan,
  isSubscriptionBillable,
  changeSubscriptionPlan,
  validateSubscription
} = require('./')

const { initPlan } = require('../plan')

describe('Subscription', () => {
  describe('getExpirationDate()', () => {
    it('Return expirationDate as unix epoch', async () => {
      const expirationDate = getCurrentTime()
      const sub = await initSubscription({ expirationDate })
      expect(getExpirationDate(sub)).toBe(expirationDate)
    })

    it('Param is required', () => {
      expect(() => getExpirationDate()).toThrow()
    })
  })

  describe('isSubscriptionActive()', () => {
    it('Should return false if current date is after expirationDate', async () => {
      const sub = await createSubscription({
        expirationDate: getCurrentTime() - 200
      })
      expect(isSubscriptionActive(sub)).toEqual(false)
    })

    it('Should return true if current date is before expirationDate', async () => {
      const sub = await createSubscription({
        expirationDate: getCurrentTime() + 200
      })
      expect(isSubscriptionActive(sub)).toEqual(true)
    })

    it('Param is required', () => {
      expect(() => isSubscriptionActive()).toThrow()
    })
  })

  describe('updatePeriod()', () => {
    it('Update status to active if paid=true', async () => {
      let sub = await createSubscription()
      sub = await updatePeriod(sub, true)
      expect(sub.status).toEqual('active')
    })

    it('Status is unpaid before first payment', async () => {
      let sub = await createSubscription()
      sub = await updatePeriod(sub)
      expect(sub.status).toEqual('unpaid')
    })

    it('Param is required', () => {
      return expect(updatePeriod()).rejects.toBeDefined()
    })
  })

  describe('getSubscriptionStatus()', () => {
    it('Return past_due if expirationDate has passed for active sub', async () => {
      expect.assertions(1)
      const sub = await createSubscription({
        expirationDate: getCurrentTime() - 200,
        status: 'active'
      })
      expect(await getSubscriptionStatus(sub)).toEqual('past_due')
    })

    it('Param is required', () => {
      return expect(getSubscriptionStatus()).rejects.toBeDefined()
    })
  })

  describe('getSubscriptionCost()', () => {
    it('Return cost for singel subscription', async () => {
      const sub = await createSubscription({})
      expect(await getSubscriptionCost(sub)).toEqual(999)
    })

    it('Return cost of multiple plans', async () => {
      const plans = [await createPlan(), await createPlan(), await createPlan()]
      const sub = await createSubscription({ plans })
      expect(await getSubscriptionCost(sub)).toEqual(999 * 3)
    })

    it('Param is required', () => {
      return expect(getSubscriptionCost()).rejects.toBeDefined()
    })
  })

  describe('addSubscripionPlan()', () => {
    it('Plan has to have same interval & count', async () => {
      const newPlan = await createPlan()
      const sub = await createSubscription({})

      expect(addSubscripionPlan(sub.plans, newPlan)).toHaveLength(2)
    })

    it('Return false if plan could not be added', async () => {
      const sub = await createSubscription()
      const newPlan = await createPlan({ interval: 'day' })

      expect(addSubscripionPlan(sub.plans, newPlan)).toBe(false)
    })

    it('Param is required', () => {
      expect(() => addSubscripionPlan()).toThrow()
    })
  })

  describe('isSubscriptionBillable()', () => {
    it('unpaid is billable', async () => {
      const sub = await createSubscription({ status: 'unpaid' })
      expect(await isSubscriptionBillable(sub)).toEqual(true)
    })

    it('past_due is billable', async () => {
      const sub = await createSubscription({ status: 'past_due' })
      expect(await isSubscriptionBillable(sub)).toEqual(true)
    })

    describe('return false for all none billable values', () => {
      it('canceled is not billable', async () => {
        const sub = await createSubscription({ status: 'canceled' })
        expect(await isSubscriptionBillable(sub)).toEqual(false)
      })

      it('active is not billable', async () => {
        const sub = await createSubscription({ status: 'active' })
        expect(await isSubscriptionBillable(sub)).toEqual(false)
      })
    })

    it('Param is required', () => {
      return expect(isSubscriptionBillable()).rejects.toBeDefined()
    })
  })

  describe('changeSubscriptionPlan()', () => {
    it('Change one plan for an equal one', async () => {
      const currentPlan = await createPlan({ amount: 20 })
      const currentPlan1 = await createPlan({ amount: 100 })
      const currentPlan2 = await createPlan({ amount: 180 })
      const newPlan = await createPlan({ amount: 200 })

      let sub = await createSubscription({
        plans: [currentPlan, currentPlan1, currentPlan2]
      })
      sub = changeSubscriptionPlan(sub, currentPlan1, newPlan)
      expect(sub.plans).toEqual([currentPlan, currentPlan2, newPlan])
    })

    it('returns new subscription object', async () => {
      const sub = await createSubscription()
      const newPlan = await createPlan()
      expect(changeSubscriptionPlan(sub, sub.plans[0], newPlan)).not.toBe(sub)
    })

    it('Return same subscription if plans are unequal', async () => {
      const sub = await createSubscription()
      const newPlan = await createPlan({ intervalCount: 123 })

      expect(changeSubscriptionPlan(sub, sub.plans[0], newPlan)).toBe(sub)
    })

    it('Param is required', () => {
      expect(() => changeSubscriptionPlan()).toThrow()
    })
  })

  describe('initSubscription()', () => {
    describe('Error handling', () => {
      it('should throw error on invalid model', () => {
        return expect(
          initSubscription({ amount: 'invalid model' })
        ).rejects.toBeDefined()
      })
    })
  })

  describe('validateSubscription()', () => {
    it('Param is required', async () => {
      return expect(validateSubscription()).rejects.toBeDefined()
    })
  })
})

/* Methods for testing purposes */
const createPlan = async testPlan => {
  try {
    return await initPlan(testPlan)
  } catch (e) {
    console.log(e)
  }
}

const createSubscription = async testSubscription => {
  try {
    return await initSubscription(testSubscription)
  } catch (e) {
    console.log(e)
  }
}

const getCurrentTime = () => new Date().getTime()
