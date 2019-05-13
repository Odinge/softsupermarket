<template>
  <el-form
    inline
    label-position="top"
    class="table-expand"
    v-loading="isloading"
    element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <el-form-item class="table-item">
      <template slot="label">
        <span class="table-item-label">项目名称</span>
      </template>
      <span>{{ project.projectName }}</span>
    </el-form-item>
    <el-form-item class="table-item">
      <template slot="label">
        <span class="table-item-label">项目时间</span>
      </template>
      <span>
        <i class="el-icon-time"></i>
        {{ project.projectTime }}
      </span>
    </el-form-item>
    <el-form-item class="table-item">
      <template slot="label">
        <span class="table-item-label">项目资金</span>
      </template>
      <span>{{ project.projectPrice }} ￥</span>
    </el-form-item>
    <el-form-item class="table-item item-text split-line-right">
      <template slot="label">
        <span class="table-item-label">项目需求</span>
      </template>
      <p>{{ project.projectRequirement }}</p>
    </el-form-item>
    <el-form-item class="table-item item-text split-line-left">
      <template slot="label">
        <span class="table-item-label">项目描述</span>
      </template>
      <p>{{ project.projectDescribe }}</p>
    </el-form-item>
  </el-form>
</template>
<script>
import { getProject } from "../../../api/project";
export default {
  props: ["props", "projectId"],
  data() {
    return {
      project: {},
      isloading: true
    };
  },
  created() {
    if (this.props) {
      this.project = this.props;
      this.isloading = false;
    } else {
      this.getProjectData(this.projectId);
    }
  },
  methods: {
    getProjectData(projectId) {
      getProject(projectId)
        .then(res => {
          this.project = res.data[0];
          this.isloading = false;
        })
        .catch(err => {
          console.log("获取错误");
          this.isloading = false;
        });
    }
  }
};
</script>
<style>
/* 项目详情 */
.el-table__expanded-cell {
  background-color: #ccc;
}
.table-expand {
  font-size: 0;
  background-color: #dffffd;
  background-color: rgba(230, 162, 60, 0.1);
  border-radius: 16px;
  padding: 10px;
  box-shadow: 0 0 2px #ccc;
  margin-bottom: 10px;
}
.table-expand .table-item {
  margin-right: 0 !important;
  margin-bottom: 0;
  width: 33%;
  text-align: center;
}

.table-expand .table-item .el-form-item__label {
  font-size: 15px;
  padding: 0;
  color: #99a9bf;
  line-height: 30px;
}
.table-expand .table-item .el-form-item__content {
  line-height: 25px;
  /* text-align: left !important; */
}
.table-expand .item-text {
  width: 50%;
  box-sizing: border-box;
  padding: 0 10px;
  /* text-align: left !important; */
}
/* .table-expand .item-text .el-form-item__content { */
  /* text-align: left !important; */
/* } */
/* .split-line-right {
  border-right: 1px solid #ccc;
}
.split-line-left {
  border-left: 1px solid #ccc;
} */
</style>

