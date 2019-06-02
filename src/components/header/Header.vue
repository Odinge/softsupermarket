<template>
  <div id="header">
    <h1 class="icon">
      <i class="iconfont icon-guanli" @click="extendNav"></i>
      <span>软件超市</span>
    </h1>
    <el-dropdown class="exit" @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        {{ username }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <!-- <el-button type='text' @click="exit">退出</el-button> -->
        <el-dropdown-item command="exit">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import eventBus from "../../utils/eventBus.js";
export default {
  data() {
    return {};
  },
  methods: {
    // 切换导航样式
    extendNav() {
      eventBus.$emit("showNav");
    },
    // 退出登录或者切换用户管理界面
    handleCommand(command) {
      if (command === "exit") {
        this.exit();
      }
    },
    exit() {
      // 退出清除缓存和登录
      this.$store.dispatch("Logout").then(() => {
        //登录成功之后重定向到登录页
        this.$router.push({ path: "/login" });
      });
    }
  },
  computed: {
    username() {
      // return sessionStorage.getItem("username");
      return this.$store.state.username;
    }
  }
};
</script>
<style scoped>
#header {
  position: relative;
  height: 80px;
  background-color: rgb(143, 176, 236);
  box-shadow: 0 1px 4px rgba(187, 181, 181, 0.856);
  z-index: 1;
}
.icon {
  float: left;
  margin-left: 40px;
  line-height: 80px;
  font-size: 30px;
  color: #fff;
}
.icon-guanli {
  font-size: 40px;
  margin-right: 20px;
  cursor: pointer;
  user-select: none;
}
.exit {
  float: right;
  line-height: 80px;
  margin-right: 100px;
  color: #fff;
  cursor: pointer;
}
</style>

