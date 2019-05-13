<!-- 开发团队 -->
<template>
  <div class="project-manage">
    <!-- 菜单 -->
    <project-menu :menu-list="menuList"></project-menu>
    <!-- 列表信息 -->
    <router-view class="project-list"></router-view>
  </div>
</template>
<script>
import ProjectMenu from "./components/ProjectMenu";

export default {
  components: { ProjectMenu },
  data() {
    return {
      menuList: [
        { title: "待审核", path: "projectExamine" },
        { title: "正在进行", path: "projectRun" },
        { title: "已完成", path: "projectFinish" }
      ]
    };
  },
  methods: {
    tabClick() {}
  }
};
</script>
<style scoped>
</style>
