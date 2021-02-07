import { forEachValue } from "../utils"
import Module from "./module"

class ModuleCollection {
  constructor(options) {
    this.register([], options) // 格式化数据
  }
  getNamespaced(path) {
    let root = this.root
    return path.reduce((str, key) => {
      root = root.getChild(key)
      return str + (root.namespaced ? key + '/' : '')
    }, '')
  }
  register(path, rootModule) {
    const newModule = new Module(rootModule)
    if (path.length === 0) {
      this.root = newModule
    } else {
      // [a, c]
      let parent = path.slice(0, -1).reduce((memo, currVal) => {
        return memo.getChild(currVal)
      }, this.root)
      parent.addChild(path[path.length - 1], newModule)
    }
    if (rootModule.modules) {
      forEachValue(rootModule.modules, (module, moduleName) => {
        this.register(path.concat(moduleName), module)
      })
    }
  }
}

export default ModuleCollection

/*
  格式化后的数据格式
  this._root = {
    _raw: {},
    _children: {
      a: {
        _raw: {},
        _children: {},
        state: {}
      },
      b: {...}
    },
    state: {}
  }
*/