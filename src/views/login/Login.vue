<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-20 22:21:23
 * @LastEditTime: 2019-10-31 09:57:39
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="login" v-loading="isLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.5)">
    <el-button class="back" type="text" icon="el-icon-back" @click="back">返回主页</el-button>
    <el-button class="exit" type="text" @click="exit">登出系统</el-button>
    <div class="content" v-if="!isLoading && !isErr">
      <div class="head">
        <i class="iconfont icon-denglu"></i>
        <h2>选择进入身份</h2>
      </div>
      <div class="select">
        <el-select v-model="roleId" placeholder="请选择" size="small">
          <el-option v-for="role in roles" :key="role.identityId" :label="role.identityName" :value="role.identityId"></el-option>
        </el-select>
      </div>
      <el-button @click="login" v-enter="this" class="btn" :loading="btnLoading">进入管理页面</el-button>
    </div>
    <div v-if="!isLoading && isErr" class="content err">
      <h1>{{ errMsg }}</h1>
    </div>
  </div>
</template>
<script>
import { delCookie } from "../../utils/auth";
import { getOnesTeamMessage } from "../../api/login";
export default {
  data() {
    return {
      errMsg: "",
      isLoading: true,
      isErr: false,
      roles: [],
      roleId: "",
      btnLoading: false
    };
  },
  directives: {
    // 按enter键登录
    enter(el, { value }) {
      document.onkeydown = e => {
        e = e || window.event;
        if (e.keyCode === 13) {
          value.login();
        }
      };
    }
  },
  created() {
    // 根据请求获取对应的权限
    this.$store
      .dispatch("getRequest")
      .then(roles => {
        this.roles = roles;
        let curRole = roles[0].identityId;
        this.roleId = curRole;
        this.isLoading = false;
        // 当用户为普通用户时没有访问权
        if (curRole == 5) {
          this.isErr = true;
          this.errMsg = "无访问权限";
        }
      })
      // 获取错误时对错误的处理
      .catch(({ err, msg, code }) => {
        this.isLoading = false;
        this.isErr = true;
        this.errMsg = msg;
        // 登录无效时退出登录
        if (code === 1) {
          this.toLogin();
        }
      });
  },
  methods: {
    login() {
      this.btnLoading = true;
      if (this.roleId == 5) {
        this.isErr = true;
        this.errMsg = "无访问权限";
        return false;
      }
      // 设置角色并进入对应的管理页面
      this.$store.dispatch("setRole", this.roleId).then(res => {
        this.$router.push({ path: "/" }); //登录成功之后重定向到首页
        this.$store.commit("SET_PAGE_ENTER_STATE", true);
        // this.btnLoading = false;
      }).catch(err => {
        this.$message.error(err);
        this.btnLoading = false;
      });

    },
    // 获取焦点是清除错误信息
    clear() {
      this.errMsg = "";
    },
    // 返回到首页
    back() {
      window.location.href = "http://software.sicau.edu.cn/";
    },
    // 登录无效时退出登录
    toLogin() {
      this.$alert("请重新登录！！！", "权限验证失败", {
        confirmButtonText: "确定",
        showClose: false,
        center: true,
        roundButton: true,
        type: "error",
        callback: action => {
          // delCookie("JSESSIONID");
          location.reload(); // 刷新浏览器
          window.location.href = "http://software.sicau.edu.cn:8080/";
        }
      });
    },
    exit() {
      this.$store.dispatch("loginout").then(() => {
        location.reload(); // 刷新浏览器
        window.location.href = "http://software.sicau.edu.cn:8080/";
      }).catch(err => {
        window.location.href = "http://software.sicau.edu.cn:8080/";
      })
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    },
  }
};
</script>
<style scoped>
#login {
  position: relative;
  height: 100%;
  background: url("../../assets/loginbg.jpg") center center/cover;
}
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  transform: translate(-50%, -50%);
  color: #fff;
  text-align: center;
}

#login .select {
  margin-top: 20px;
  /* text-align: center; */
}
.err {
  border: 1px solid #ccc;
  border-radius: 2em;
  line-height: 100px;
  font-size: 40px;
  color: rgb(236, 98, 98);
  box-shadow: 0 0 5px #ccc;
  text-shadow: 0 0 1px #555;
  background-color: rgba(90, 85, 85, 0.308);
}
#login i {
  font-size: 80px;
  margin-bottom: 10px;
}
#login h2 {
  margin-top: 10px;
}
#login .content .btn {
  width: 100%;
  padding: 0.7em 0;
  margin-top: 50px;
  margin-bottom: 20px;
  border: none;
  background-color: #00cdff;
  border-radius: 30px;
  outline: none;
  cursor: pointer;
}
#login .content .btn:hover {
  color: #fff;
  background-color: rgba(0, 204, 255, 0.808);
}
.back {
  padding: 30px;
  color: rgb(29, 10, 10);
  font-size: 20px;
  text-shadow: 0 0 2px #ccc;
}
.exit {
  position: absolute;
  right: 0;
  padding: 30px;
  color: rgb(29, 10, 10);
  font-size: 20px;
  text-shadow: 0 0 2px #ccc;
}
</style>
