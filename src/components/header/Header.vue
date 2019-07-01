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
    <el-dropdown @command="chooseTeam" class="drop" v-if="teams.length>1&&parseInt(this.$store.state.role)===3">
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
export default {
  data() {
    return {
      teams: [] //多个团队信息
    };
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
      this.$store.commit('SET_TEAMID', this.teams[val]['团队id']);
    },
    exit() {
      // 退出清除缓存和登录
      //登录成功之后重定向到登录页
      this.$store.dispatch("Logout");
    }
  },
  computed: {
    username() {
      return this.$store.state.username;
    }
  },
  created() {
    getMyTeam(this.username).then(res => {
      if (res.status === 0) {
        let data = res.data;
        console.log(res);

        for (let i = 0; i < data.length; i++) {
          if (data[i] instanceof Array) {
            this.teams = JSON.parse(JSON.stringify(data[i]));
            let teamId = JSON.parse(JSON.stringify(data[i][0]['团队id']));
            this.$store.commit('SET_TEAMS', JSON.parse(JSON.stringify(data[i])));
            this.$store.commit('SET_TEAMID', (JSON.parse(JSON.stringify(teamId))));
          }
        }

        // if(!this.teamId){
        //   this.$message.error('团队id为空，信息异常，请联系开发人员');
        // }
      }
      else {
        this.$message.error(res.msg);
      }
    }).catch(err => {
      this.$message.error('获取团队信息失败！');
      console.log(err)
    })

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

