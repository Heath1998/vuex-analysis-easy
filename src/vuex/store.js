import { applyMixin } from "./mixin"
import ModuleColllection from './module/module-collection'
import { forEachValue } from "./utils"

export let Vue

function getState(store, path) {
  return path.reduce((newState, currKey) => {
    return newState[currKey]
  }, store.state)
}

function installModules(store, rootState, path, module) {
  // 安装生成模块
  // 将所有子模块的状态安装到父模块上
  const namespaced = store._modules.getNamespaced(path)
  if (path.length > 0) {
    const parent = path.slice(0, -1).reduce((memo, currVal) => {
      return memo[currVal]
    }, rootState)
    Vue.set(parent, path[path.length - 1], module.state)
  }

  module.forEachMutaions((mutation, key) => {
    store._mutations[namespaced + key] = (store._mutations[namespaced + key] || [])
    store._mutations[namespaced + key].push((payload) => {
      mutation.call(store, getState(store, path), payload)
      store._subscribes.forEach(fn => {
        fn(mutation, store.state)
      })
    })
  })

  module.forEachActions((action, key) => {
    store._actions[namespaced + key] = (store._actions[namespaced + key] || [])
    store._actions[namespaced +key].push((payload) => {
      action.call(store, store, payload)
    })
  })

  module.forEachGetters((getter, key) => {
    // 模块中getter名字重复了会直接覆盖
    store._wrappedGetters[namespaced + key] = () => {
      return getter(getState(store, path))
    }
  })

  module.forEachChilds((child, key) => {
    installModules(store, rootState, path.concat(key), child)
  })
}

function resetStoreVM(store, state) {
  const computed = {}
  store.getters = {}
  forEachValue(store._wrappedGetters, (fn, key) => {
    computed[key] = () => fn()
    Object.defineProperty(store.getters, key, {
      get: () => {
        return store._vm[key]
      }
    })
  })
  store._vm= new Vue({
    data: {
      $$state: state
    },
    computed
  })
}

export class Store {
  constructor(options) {
    const state = options.state
    this._mutations = {}
    this._actions = {}
    this._wrappedGetters = {}
    this._subscribes = []
    // 1. 数据格式化
    // 完成了所有module、嵌套module的注册，并通过定义的key做区分
    /* 结构如下：
      'root': {
        'runtime': false,
        //子 module
        '_children': {
          // module的名称
          'moduleName': {
            'runtime': false,
            '_children': {},   //子 module
            '_rawModule': {},  //当前 module定义是的内容
            'state': {}, //当前 module定义是的state
          }
        },
        '_rawModule': {} //Vue.Store(options) --- options
        'state': {}, //options中的state
      }
    }*/
    // 通过一个深度遍历将生成一个嵌套模块
    this._modules = new ModuleColllection(options)
    // 2. 安装模块
    installModules(this, state, [], this._modules.root)
    // 3. 把状态和getters定义到vm上
    // 传入的state为 this._module.root.state
    resetStoreVM(this, state)
    // 4. 插件内部会依次执行
    options.plugins.forEach(fn => fn(this))
  }
  get state() {
    return this._vm._data.$$state
  }
  // 写成箭头函数是为了保证this永远指向store实例
  commit = (type, payload) => {
    this._mutations[type].forEach(mutation => mutation.call(this, payload))
  }
  dispatch = (type, payload) => {
    this._actions[type].forEach(action => action.call(this, payload))
  }
  subscribe(fn) {
    this._subscribes.push(fn)
  }
  replaceState(state) {
    this._vm._data.$$state = state
  }
}


// 用Vue插件写法的好处是：install会传入一个Vue的构造函数作为参数，这样Vuex就可以不依赖于某一个固定版本的Vue
export function install(_Vue) {
  Vue = _Vue

  // 1、将根组件注册的Store实力，注入到每一个子组件中
  applyMixin(_Vue)
}