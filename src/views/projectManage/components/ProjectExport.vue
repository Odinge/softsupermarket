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
    <el-upload
      class="upload"
      ref="upload"
      :action="uploadUrl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeAvatarUpload"
      :on-error="fileError"
      :on-exceed="handleExceed"
      :on-success="fileSuccess"
      :auto-upload="false"
      :with-credentials="false"
      :limit="1"
    >
      <el-button circle slot="trigger" icon="el-icon-document" size="small" title="选取文件"></el-button>
      <el-button
        class="tag"
        circle
        type="success"
        icon="el-icon-upload2"
        size="small"
        title="导入项目"
        @click="submitUpload"
      ></el-button>
      <a :href="tempUrl">
        <el-button round type="warning" icon="el-icon-download" size="small" class="tag">下载模板</el-button>
      </a>
      <div slot="tip" class="el-upload__tip tip">一次只能上传1个Excel表格文件</div>
    </el-upload>
  </el-dialog>
</template>
<script>
export default {
  props: ["check"],
  data() {
    return {};
  },
  computed: {
    uploadUrl() {
      return "/v1/nonpub/examine/addFinishedProjectByExcel";
    },
    tempUrl() {
      return this.$baseUrl + "/v1/nonpub/examine/getProjectExcelModel";
    }
  },
  methods: {
    // 关闭对话框
    close() {
      this.$emit("update:check", false);
    },
    // 关闭申请对话框
    handleClose() {
      this.close();
    },
    open() {},
    submitUpload(...arg) {
      this.$confirm(`确认导入文件？`, "导入", {
        type: "warning"
      })
        .then(() => {
          this.$refs.upload.submit();
        })
        .catch(err => this.$message.info("已取消导入"));
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    fileError() {
      this.$message.error("导入失败");
    },
    fileSuccess(res) {
      if (res.status == 0) {
        this.$message.success("导入成功");
        this.$emit("updateData");
      } else {
        this.$message.error(
          "导入失败，请先下载模板，检查格式是否正确!"
        );
        this.$refs.upload.clearFiles();
      }
    },
    handleExceed() {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeAvatarUpload(file) {
      let name = file.name;
      let type_xls = /\.(xls|xlsx)(\?.*)?$/i;
      let check = type_xls.test(name);
      if (!check) {
        this.$message.error("文件类型错误，应该为Excel表格");
      }
      return check;
    }
  }
};
</script>
<style scoped>
.box {
  border-radius: 10px;
  height: 300px;
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
.tag {
  margin-left: 10px;
}
.tip {
  padding-top: 5px;
}
.tip::before {
  content: "*";
  color: #eb5f5f;
  font-size: 19px;
}
.upload {
  text-align: center;
}
</style>

