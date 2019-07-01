<!-- 开发团队导航容器 -->
<template>
  <div class="project-examine">
    <project-menu-sec :menu-list="menuList"></project-menu-sec>
    <keep-alive>
      <router-view class="project-list" v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view class="project-list" v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
import ProjectMenuSec from "../components/ProjectMenuSec";
export default {
  components: { ProjectMenuSec },
  data() {
    return {
      menuList: [
        { title: "发布审核", path: "publishExamine", publishExamine: 0 },
        { title: "承接审核", path: "undertakeExamine", undertakeExamine: 0 },
        // { title: "日程表审核", path: "timetableExamine" },
        { title: "延期审核", path: "delayExamine", delayExamine: 0 },
        { title: "修改审核", path: "alterExamine", alterExamine: 0 }
      ]
    };
  },
  methods: {}
};
</script>
<style scoped>
.project-examine {
  padding-top: 0;
}
</style>
