<!-- 公司管理人管理页面 -->
<template>
  <div class="project-manage">
    <!-- 菜单 -->
    <project-menu :menu-list="menuList"></project-menu>
    <!-- 列表信息 -->
    <keep-alive>
      <router-view class="project-list" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view class="project-list" v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
import ProjectMenu from "./components/ProjectMenu";

export default {
  components: { ProjectMenu },
  data() {
    return {
      menuList: [
        { title: "待审核", path: "projectCheck" },
        { title: "待承接", path: "projectUndertake" },
        { title: "正在进行", path: "projectRun" },
        { title: "已完成", path: "projectFinish" }
      ]
    };
  }
};
</script>
<style scoped>
</style>
