export function mapState(stateArr) {
  const obj = {}
  for (let i = 0; i < stateArr.length; i++) {
    const stateName = stateArr[i]
    obj[stateName] = function() {
      return this.$store.state[stateName]
    }
  }
  return obj
}
export function mapGetters(gettersArr) {
  const obj = {}
  for (let i = 0; i < gettersArr.length; i++) {
    const getterName = gettersArr[i]
    obj[getterName] = function() {
      return this.$store.getters[getterName]
    }
  }
  return obj
}