<template>
  <div class="show">
    <div>
      当前位置:
      <router-link to="/">首页</router-link>>
      <router-link to="/notice/allNotice">{{routeFrom}}</router-link>>
    </div>
    <div class="title">{{response.title}}</div>
    <div class="content" v-html="response.content"></div>
    <div class="publisher">发布人：{{response.authorName}}</div>
    <div class="time">发布时间：{{response.createTime}}</div>
  </div>
</template>
<script>
import { getStudenId, noticeDetail } from "@/api/notice";
export default {
  data() {
    return {
      routeFrom: "所有公告",
      title: "",
      response: "",
      noticeId: this.$route.params.announcementId
    };
  },
  methods: {
    getData() {
      noticeDetail(this.noticeId).then(res => {
        if (res.status === 0) {
          this.response = res.data;
          this.response.createTime = this.response.createTime.split(" ")[0];
        }
      });
    }
  },
  created() {
    console.log(this.noticeId);
    this.getData();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let dustbin = from.fullPath.indexOf("dustbin");
      let allNotice = from.fullPath.indexOf("allNotice");
      if (dustbin > 0) {
        vm.routeFrom = "回收站";
      } else if (allNotice > 0) {
        vm.routeFrom = "所有公告";
      } else {
        vm.routeFrom = "";
      }
    });
  }
};
</script>
<style scoped>
.show {
  width: 1000px;
  min-height: 200px;
  padding-top: 20px;
}
.content {
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
</style>
