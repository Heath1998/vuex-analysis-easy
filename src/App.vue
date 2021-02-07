<template>
  <div id="app">
    <div>秋秋的年龄是：{{age}}</div>
    <div>我的的年龄是：{{myAge}}</div>
    <!-- <div>a的的年龄是：{{$store.state.a.age}}</div>
    <div>b的的年龄是：{{$store.state.b.age}}</div> -->
    <!-- <div>b的的年龄是：{{$store.state.b.getters.myAge}}</div> --> -->
    
    <button @click="$store.commit('changeAgeSync', 10)">同步更新年龄</button>
    <button @click="$store.dispatch('b/changeAgeAync', 10)">异步更新年龄</button>
  </div>
</template>
<script>
import { mapState, mapGetters } from '@/vuex'
export default {
  computed: {
    ...mapState(['age']),
    ...mapGetters(['myAge'])
  },
  mounted() {
    // this.$store.dispatch('b/changeAgeSync')
    console.log(this.$store.getters)
    console.log(this.$store.getters['myAge'])
    console.log(this.$store.getters['a/myAge'])
    // console.log(this.$store.getters['b/myAge'])
  }
}
</script>