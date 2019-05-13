<!-- 菜单 -->
<template>
  <ul class="menu">
    <router-link v-for="(menu, key) in menuList" :key="key" :to="{name:menu.path}" tag="li">
      <message-num :menu="menu"></message-num>
    </router-link>
  </ul>
</template>
<script>
import MessageNum from "@/components/MessageNum";
export default {
  name: "projectMenu",
  components: { MessageNum },
  props: {
    menuList: {
      type: Array
    }
  },
  data() {
    return {};
  }
};
</script>
<style scoped>
.menu {
  /* overflow: auto; */
  font-size: 14px;
  text-align: center;
  user-select: none;
}
.menu li {
  display: inline-block;
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  color: #909399;
}
.menu li.router-link-active {
  border-bottom-color: #409eff;
  color: #303133;
}
</style>
