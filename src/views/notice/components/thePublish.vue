<template>
  <div class="editor">
    <div class="container">
      <input class="title" type="text" placeholder="请输入公告标题" v-model="title">
      <textarea id="editor"></textarea>
      <div v-html="editorHtml"></div>
      <div class="save" @click="publishHandler">发布</div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import '@/assets/tinymce/zh_CN.js'
import { publish, noticeList, uploadImg } from "../../../api/notice";
export default {
  name: "UE",
  data() {
    return {
      title: "",
      editorHtml: '',
    };
  },

  mounted() {
    tinymce.remove("#editor");
    tinymce.init({
      selector: '#editor',
      plugins: 'lists advlist  image fullscreen  table ',
      language: 'zh_CN',
      "toolbar2": "fontsizeselect | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | removeformat ",
      convert_urls: false,
      height: 500,

      images_upload_handler: async function (blobInfo, success, failure) {
        let form = new FormData();
        form.append('file', blobInfo.blob(), blobInfo.filename());
        uploadImg(form).then(res => {
          console.log(res.data.location)
          if (res.status === 0) {
            success(res.data.location);
          }
        }).catch((err) => {
          failure(err);
          console.log(err)
        })
      },
    });
  },
  methods: {
    getContent() {
      let content = tinymce.get('editor').getContent();
      this.editorHtml = content;
      console.log(content)
    },
    publishHandler() {
      // 获取内容方法
      if (this.title.length === 0) {
        this.$message.error("标题不能为空。");
        return false;
      }
      let content = tinymce.get('editor').getContent();
      if (content.length === 0) {
        this.$message.error("正文内容不能为空。");
        return false;
      }
      let params = {
        title: this.title,
        author: this.userId,
        content: content
      };
      publish(this.qs.stringify(params))
        .then(res => {
          console.log(res)
          if (res.status === 0) {
            this.$message.success("消息发布成功。");
            // tinymce.setContent('');
            this.title = '';
          } else {
            this.$message.error("糟糕，消息发布失败。");
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
