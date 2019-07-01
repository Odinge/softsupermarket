<template>
  <div id="manage">
    <Header></Header>
    <div class="container">
      <sidebar></sidebar>
      <keep-alive>
        <router-view class="content" v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view class="content" v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
export default {
  name: "mange",
  components: { Header, Sidebar },
  beforeCreate() {
    this.getMsgNum();
    // 获取数据
    this.$store.dispatch("GetAllTeamDirection");
  },

};
</script>

<style scoped>
#manage {
  min-width: 500px;
}
.container {
  position: absolute;
  top: 80px;
  left: 0;
  bottom: 0;
  width: 100%;
}
.content {
  overflow: auto;
  height: 100%;
  background-color: #f7f7f7;
}
</style>