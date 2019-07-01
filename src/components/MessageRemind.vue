<template></template>

<script>
export default {
  data() {
    return {
      num: ""
    };
  },
  methods: {
    //消息提醒
    open(val) {
      this.$message({
        message: `您有${val}条消息未读`,
        center: true
      });
    },
    //根据接收方id请求消息，并返回数量
    getData() {
      this.$store.dispatch("qesMessage", {
        userGet: this.userId
      });
      //返回长度
    }
  },
  watch: {
    //监控路由的变换
    $route(to, from) {
      this.getData();
      this.open(this.length);
    },
    length(val) {
      if (val > 0) {
        this.open(val);
      }
    }
  },
  created() {
    //进入页面弹出消息提醒，
    // this.getData();
  },

  computed: {
    length() {
      let newarry = this.data.filter(
        states => states.state == "未查看"
      );
      return newarry.length;
    },
    data() {
      return this.$store.state.message;
      // return [];
    },
    userId() {
      return this.$store.state.userId;
    }
  },
  components: {}
};
</script>
<!--scoped 样式仅仅在当前组件使用-->
<style scoped>
.message {
  background: #ffe1d7;
  text-align: center;
  height: auto;
  padding: 7px 0;
  color: black;
  letter-spacing: 3px;
  z-index: 999;
}
</style>
