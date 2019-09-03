<template>
  <div class="editor">
    <div class="container">
      <input class="title" type="text" placeholder="请输入公告标题" v-model="title">
      <mceeditor
        v-model="value"
        :url="'http://www.ghjhhyuyuy.xin:8080/v1/nonpub/examine/uploadAnnouncementImg'"
        @on-upload-success="onEditorUploadSuccess"
        @editor="getEditor"
      ></mceeditor>
      <div class="save" @click="publishHandler">发布</div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import mceeditor from '@/views/notice/components/Editor'
window.tinymce.baseURL = '/static/tinymce'
window.tinymce.suffix = '.min'
import '@/assets/tinymce/zh_CN.js'
import { publish, noticeList, uploadImg } from "../../../api/notice";
export default {
  components: {
    mceeditor
  },
  data() {
    return {
      title: "",
      value: '',
      editor:'',
    };
  },

  mounted() {

  },
  methods: {
    getEditor(editor) {
      this.editor = editor
    },
    onEditorUploadSuccess(arr) {
      let res = arr[0];
      let success = arr[1];
      let fail = arr[2];
      if (res.status === 0) {
        success(res.data.location);
      }
      else {
        fail(res.msg);
      }
    },
    publishHandler() {
      // 获取内容方法
      if (this.title.length === 0) {
        this.$message.error("标题不能为空。");
        return false;
      }
      let content = this.value;
      if (content.length === 0) {
        this.$message.error("正文内容不能为空。");
        return false;
      }
      let params = {
        title: this.title,
        author: this.userId,
        content: content
      };

      publish(params)
        .then(res => {
          console.log(res)
          if (res.status === 0) {
            this.$message.success("消息发布成功。");
            this.value = '';
            this.title = '';
            console.log(this.editor)
            this.editor.setContent('');
          } else {
            this.$message.error("糟糕，消息发布失败。");
            console.log(res)
          }
        })
        .catch(err => {
          this.$message.error("糟糕，消息发布失败,请稍后重试！");
          console.log(err);
        });
    }
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    }
  }
}

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
