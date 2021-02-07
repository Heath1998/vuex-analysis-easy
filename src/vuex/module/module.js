import { forEachValue } from "../utils"

class Module {
  get namespaced() {
    return !!this._raw.namespaced
  }
  constructor(rootModule) {
    this._raw = rootModule
    this._children = {},
    this.state = rootModule.state
  }
  getChild(key) {
    return this._children[key]
  }
  addChild(key, value) {
    this._children[key] = value
  }
  forEachMutaions(fn) {
    if (this._raw.mutations) {
      forEachValue(this._raw.mutations, fn)
    }
  }
  forEachActions(fn) {
    if (this._raw.actions) {
      forEachValue(this._raw.actions, fn)
    }
  }
  forEachGetters(fn) {
    if (this._raw.getters) {
      forEachValue(this._raw.getters, fn)
    }
  }
  forEachChilds(fn) {
    forEachValue(this._children, fn)
  }
}

export default Module