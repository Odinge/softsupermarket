<!-- 未处理消息数量 -->
<template>
  <span class="badgebox">
    {{menu.title}}
    <slot></slot>
    <el-badge :value="getMsgN(menu)" :style="customClass" class="item" :max="99" :hidden="!getMsgN(menu)"></el-badge>
  </span>
</template>
<script>
export default {
  name: "MessageNum",
  props: {
    menu: Object,
    customClass: String
  },
  methods: {
    getMsgN(menu) {
      return this.count[menu.path];
    }
  },
  computed: {
    count() {
      return this.$store.state.msgNum;
    }
  }
};
</script>
<style scoped>
.badgebox {
  position: relative;
}
.item {
  position: absolute;
  top: -33px;
  right: -9px;
  /* transform: translateX(-50%); */
}
</style>
