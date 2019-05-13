<template>
  <!-- 延期对话框 -->
  <el-dialog
    center
    width="440px"
    title="项目评价"
    :visible.sync="check"
    :before-close="handleClose"
    @open="open"
    custom-class="box"
  >
    <div v-loading="isLoading" class="content" :class="{'center':!isNo}">
      <span class="things" v-if="isNo">{{ evaluate }}</span>
      <span class="things err" v-else-if="!isLoading">没有任何评价</span>
    </div>
  </el-dialog>
</template>
<script>
import { getEvaluate } from "../../../api/project";
export default {
  props: ["runId", "check"],
  data() {
    return {
      evaluate: "",
      isLoading: true,
      isNo: false,
      cache: ""
    };
  },
  computed: {},
  methods: {
    // 关闭对话框
    close() {
      this.$emit("update:check", false);
    },
    // 关闭申请对话框
    handleClose() {
      this.close();
    },
    open() {
      if (this.runId !== this.cache) {
        this.isLoading = true;
        this.isNo = false;
        getEvaluate(this.runId)
          .then(res => {
            if (res.status == 0) {
              let { data } = res;
              this.evaluate = data[1];
              if (this.evaluate) {
                this.isNo = true;
              }
              this.isLoading = false;
              this.cache = this.runId;
            } else throw res.msg;
          })
          .catch(err => {
            this.isLoading = false;
          });
      }
    }
  }
};
</script>
<style scoped>
.box {
  border-radius: 10px;
}
.content {
  background-color: beige;
  border-radius: 0.5em;
}
/* 事件 */
.things {
  display: inline-block;
  padding: 10px;
  /* border-radius: 0.5em; */
  /* background-color: beige; */
}
.err {
  color: #eb5f5f;
}
.center {
  text-align: center;
}
</style>

