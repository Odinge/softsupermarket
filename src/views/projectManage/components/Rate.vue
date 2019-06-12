<template>
  <!-- 
  显示评分组件
 -->
  <span>
    <el-rate :value="score / base" disabled text-color="#ff9900" class="i-b" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="5"></el-rate>
    <span class="rate-color">{{ score }}</span>
  </span>
</template>
<script>
export default {
  props: {
    score: [Number, String],
    base: {
      default: 2
    }
  }
};
</script>
<style scoped>
.i-b {
  display: inline-block;
}
.rate-color {
  color: #ff9900;
}
</style>

