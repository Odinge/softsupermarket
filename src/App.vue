<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-09-03 20:33:47
 * @LastEditors: Please set LastEditors
 -->
<template>
  <router-view v-if="isRouterAlive"></router-view>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
};
</script>

<style>
/* 返回 */
.btn-back {
  display: block;
  margin: 10px;
}
/* 二级页面头部样式 */
.sec-head-btn {
  float: right;
  padding: 10px 0 3px;
}
.sec-head-title {
  font-size: 30px;
  margin-right: 10px;
  vertical-align: middle;
}
/* 项目列表以及表格 */
.project-list {
  /* overflow: auto; */
  padding: 15px 15px 10px;
}
.project-table {
  width: auto;
  min-width: 1100px;
  box-shadow: 0 0 2px #ccc;
  border-radius: 10px;
}
.table-radius {
  border-radius: 10px;
}
/* 状态标签的样式 */
.tag-finish {
  background-color: rgba(245, 108, 108, 0.1);
  border-color: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
}
/* 表格居中 */
.el-table td,
.el-table th {
  text-align: center !important;
}
.price::before {
  content: "￥ ";
}
.tip-msg {
  color: rgb(223, 85, 85);
  font-weight: bold;
}
.overflow-e {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-table__expanded-cell {
  background-color: #ccc !important;
}
</style>
