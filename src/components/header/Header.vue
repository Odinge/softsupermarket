<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-09-03 20:34:16
 * @LastEditors: Please set LastEditors
 -->
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
    <!-- 团队 -->
    <el-dropdown @command="chooseTeam" class="drop" v-if="teams.length>1&&permission($roles.team)">
      <span class="el-dropdown-link ">
        <span class="choose-title">切换团队</span><i class="el-icon-arrow-down el-icon--right down"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command=index v-for="(item,index) of teams" :key="index">{{item['团队名称']}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import eventBus from "../../utils/eventBus.js";
import { getMyTeam } from "@/api/team";
import { mapState } from "vuex";
export default {
  inject: ['reload'], // 刷新
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
    chooseTeam(val) {
      const teamId = this.$store.state.teamId;
      // console.log(teamId;
      const chooseTeam = this.teams[val]['团队id'];
      if (teamId !== chooseTeam) {
        this.$store.commit('SET_TEAMID', chooseTeam);
        // console.log(this.$route.fullPath);
        // this.$router.push("/");
        // this.$router.go(0);
        this.reload()

      }
    },
    exit() {
      // 退出清除缓存和登录
      //登录成功之后重定向到登录页
      this.$store.dispatch("Logout");
    }
  },
  computed: {
    ...mapState(["username", "teams"])
  },
  created() {
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
.exit,
.drop {
  float: right;
  line-height: 80px;
  margin-right: 100px;
  color: #fff;
  cursor: pointer;
}
.drop {
  margin-right: 50px;
  font-weight: bold;
  /* font-size: 18px; */
  /* color: black; */
}
</style>

