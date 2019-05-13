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
  overflow: auto;
  padding-left: 20px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  font-size: 14px;
  user-select: none;
}
.menu li {
  float: left;
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
