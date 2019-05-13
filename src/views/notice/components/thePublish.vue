<template>
  <div class="editor">
    <div class="container">
      <input class="title" type="text" placeholder="请输入公告标题" v-model="title">
      <form action="#" ref="form">
        <script id="editor" type="text/plain"></script>
      </form>
      <div class="save" @click="publishHandler">发布</div>
    </div>
  </div>
</template>
<script>
import { publish, noticeList } from "../../../api/notice";
export default {
  name: "UE",
  data() {
    return {
      editor: null,
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },
      title: ""
    };
  },

  mounted() {
    const _this = this;
    UE.delEditor("editor"); //重要代码，没有的话editor切换路由后会消失
    this.editor = UE.getEditor("editor", {
      BaseUrl: "",
      initialFrameHeight: 512,
      UEDITOR_HOME_URL: "/static/ueditor/" //ueditor 路径
    });
    this.editor.addListener("ready", function() {
      _this.editor.setContent(_this.defaultMsg); // 确保UE加载完成后，放入内容。
    });
  },
  methods: {
    publishHandler() {
      // 获取内容方法
      if (this.title.length === 0) {
        this.$message.error("标题不能为空。");
        return false;
      }
      let content = this.editor.getContent();
      if (content.length === 0) {
        this.$message.error("正文内容不能为空。");
        return false;
      }

      publish(this.title, this.userId, content)
        .then(res => {
          if (res.status === 0) {
            this.$message.success("消息发布成功。");
          } else {
            this.$message.error("糟糕，消息发布失败。");
          }
        })
        .catch(err => {
          this.$message.error("糟糕，消息发布失败,请稍后重试！");
          console.log(err);
        });
    },
    destroyed() {
      this.editor.destroy();
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    }
  }
};
</script>
<style scoped>
.editor {
  position: relative;
}
.container {
  width: 1000px;
  position: absolute;
}
.title {
  width: 99%;
  line-height: 20px;
  padding-left: 10px;
  height: 40px;
  box-sizing: content-box;
  background-color: #eee;
  margin-bottom: 20px;
}
.save {
  display: inline-block;
  width: 200px;
  height: 40px;
  border: 1px solid red;
  cursor: pointer;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  margin: 50px auto;
  position: absolute;
  transform: translate(-50%);
  left: 50%;
  color: red;
}
.save:hover {
  background-color: red;
  color: white;
}
</style>
