<template>
  <div
    id="login"
    v-loading="isLoading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.5)"
  >
    <el-button class="back" type="text" icon="el-icon-back" @click="back">返回主页</el-button>
    <div class="content" v-if="!isLoading && !isErr">
      <div class="head">
        <i class="iconfont icon-denglu"></i>
        <h2>选择进入身份</h2>
      </div>
      <div class="select">
        <el-select v-model="roleId" placeholder="请选择" size="small">
          <el-option
            v-for="role in roles"
            :key="role.identityId"
            :label="role.identityName"
            :value="role.identityId"
          ></el-option>
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
    this.$store
      .dispatch("getRequest")
      .then(roles => {
        this.roles = roles;
        let curRole = roles[0].identityId;
        this.roleId = curRole;
        this.isLoading = false;
        if (curRole == 5) {
          this.isErr = true;
          this.errMsg = "没有权限";
        }
      })
      .catch(({ err, msg, code }) => {
        this.isLoading = false;
        this.isErr = true;
        this.errMsg = msg;
        if (code === 1) {
          this.toLogin();
        }
      });
  },
  methods: {
    login() {
      this.btnLoading = true;
      this.$store.dispatch("setRole", this.roleId).catch(err => {
        this.$message.error("不明错误");
        this.btnLoading = false;
      });
      this.$router.push({ path: "/" }); //登录成功之后重定向到首页
    },
    // 获取焦点是清除错误信息
    clear() {
      this.errMsg = "";
    },
    back() {
      window.location.href = "http://www.ghjhhyuyuy.xin:8081/";
    },
    toLogin() {
      delCookie("JSESSIONID");
      location.reload();
      window.location.href = "http://www.ghjhhyuyuy.xin:8080/";
      // 刷新浏览器
    }
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
</style>
