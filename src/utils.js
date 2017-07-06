/* Immutable array insert item last in array */
const insertArrayItem = (array, item) => [...array, item]

/* Immutable array remove */
const removeArrayItem = (array, index) => {
  let newArray = array.slice()
  newArray.splice(index, 1)
  return newArray
}

/* Make sure that params exist for funcation */
const isRequired = () => {
  throw new Error('param is required')
}

module.exports = {
  insertArrayItem,
  removeArrayItem,
  isRequired
}
