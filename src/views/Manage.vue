<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-09-01 10:11:17
 * @LastEditors: Please set LastEditors
 -->
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
    if (this.permission(...this.$roles.manager)) {
      this.$store.dispatch("GetAllTeamDirection").then(data => {
      }).catch(err => { this.$message.error("数据获取失败") });
    }

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