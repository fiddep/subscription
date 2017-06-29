const { isRequired } = require('./utils')

describe('Utils', () => {
  describe('isRequired()', () => {
    it('throws error', () => {
      expect(() => {
        isRequired()
      }).toThrow()
    })
  })
})
