export function applyMixin(Vue) {
  Vue.mixin({ // 内部会把所有的生命周期拍平成一个数组，依次执行
    beforeCreate: vuexInit
  })
}

function vuexInit() {
  const options = this.$options
  // 给所有组件注入 $store 实例
  if (options.store) { // 根组件
    this.$store = options.store
  } else if (options.parent && options.parent.$store) { // 子组件，子子组件。。。
    this.$store = options.parent.$store
  }
}