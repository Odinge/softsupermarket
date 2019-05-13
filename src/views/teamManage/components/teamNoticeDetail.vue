<template>
  <div class="show">
    <div>
      当前位置:
      <router-link to="/">首页</router-link>>
      <router-link to="/notice/allNotice">{{routeFrom}}</router-link>>
      <span @click="back">返回</span>>
    </div>
    <div class="title">{{response.title}}</div>
    <div class="contentx" v-html="response.content"></div>
    <div class="publisher">发布人：{{response.authorName}}</div>
    <div class="time">发布时间：{{response.createTime}}</div>
  </div>
</template>
<script>
import { getStudenId, noticeDetail } from "@/api/notice";
export default {
  data() {
    return {
      routeFrom: "",
      title: "",
      response: {
        createTime: "",
        title: "",
        authorName: "",
        authorName: ""
      },
      noticeId: this.$route.params.announcementId
    };
  },
  methods: {
    getData() {
      noticeDetail(this.noticeId).then(res => {
        if (res.status === 0) {
          this.response = res.data;
          this.response.createTime = this.response.createTime.split(" ")[0];
        } else {
          this.$message.error("获取文章失败！");
          console.log(res);
        }
      });
    },
    back() {
      this.$router.go(-1);
    }
  },
  created() {
    this.getData();
  }
};
</script>
<style scoped>
.show {
  box-sizing: border-box;
  width: 1000px;
  padding: 20px;
  margin: 20px auto 0;
  height: auto;
  min-height: 300px;
  box-shadow: 0 0 2px #ccc;
}
.contentx {
  margin-top: 20px;
}
.title {
  text-align: center;
  margin-top: 50px;
  font-weight: bold;
}
.publisher,
.time {
  margin-top: 20px;
  text-align: right;
}
.publisher {
  margin-top: 50px;
}
</style>
