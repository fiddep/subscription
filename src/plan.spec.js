/* eslint-env jest */

const { initPlan, isPlansEqual, calculatePlanInterval } = require('./plan')

describe('Plan', () => {
  describe('isPlansEqual()', () => {
    it('equal plans return true', async () => {
      const plan1 = await createPlan()
      const plan2 = await createPlan()

      expect(isPlansEqual({ plan1, plan2 })).toBeTruthy()
    })
    it('none equal plans return false', async () => {
      const plan1 = await createPlan({})
      const plan2 = await createPlan({ interval: 'day' })

      expect(isPlansEqual({ plan1, plan2 })).toBeFalsy()
    })
  })

  describe('calculatePlanInterval()', () => {
    it('should handle months', async () => {
      const plan = await createPlan()
      const startDate = Date.UTC(2016, 0, 1)
      const endDate = Date.UTC(2016, 1, 1)

      const result = calculatePlanInterval({ plan, expirationDate: startDate })

      expect(result).toEqual(endDate)
    })

    it('should handle days', async () => {
      const plan = await createPlan({ interval: 'day' })
      const startDate = Date.UTC(2016, 0, 1)
      const endDate = Date.UTC(2016, 0, 2)

      const result = calculatePlanInterval({ plan, expirationDate: startDate })

      expect(result).toEqual(endDate)
    })

    it('should handle years', async () => {
      const plan = await createPlan({ interval: 'year' })
      const startDate = Date.UTC(2016, 0, 1)
      const endDate = Date.UTC(2017, 0, 1)

      const result = calculatePlanInterval({ plan, expirationDate: startDate })

      expect(result).toEqual(endDate)
    })

    it('should handle different intervalCount', async () => {
      const plan = await createPlan({ intervalCount: 5 })
      const startDate = Date.UTC(2016, 0, 1)
      const endDate = Date.UTC(2016, 5, 1)

      const result = calculatePlanInterval({ plan, expirationDate: startDate })

      expect(result).toEqual(endDate)
    })

    it('should throw if interval is invalid', () => {
      expect(() =>
        calculatePlanInterval({
          plan: { interval: 'hej', intervalCount: 6 },
          expirationDate: new Date().getTime()
        })
      ).toThrowError(/interval not valid/)
    })
  })

  describe('initPlan()', () => {
    it('should throw error on invalid model', () => {
      return expect(initPlan({ amount: 'invalid model' })).rejects.toBeDefined()
    })
  })
})

const createPlan = async testPlan => {
  try {
    return await initPlan(testPlan)
  } catch (e) {
    console.log(e)
  }
}
