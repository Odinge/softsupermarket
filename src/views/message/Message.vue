<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-04-19 14:18:23
 * @LastEditTime: 2019-09-03 20:30:21
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div id="message">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部消息" name="all">
        <span slot="label">
          <i class="el-icon-date"></i> 全部消息
        </span>
      </el-tab-pane>
      <!--点击的时候把获取到的数据进行筛选，显示已读的-->
      <el-tab-pane label="已读消息" name="read">
        <span slot="label">
          <i class="el-icon-circle-check"></i> 已读消息
        </span>
      </el-tab-pane>
      <el-tab-pane label="未读消息" name="unread">
        <span slot="label">
          <i class="el-icon-circle-close"></i> 未读消息
        </span>
      </el-tab-pane>
    </el-tabs>
    <div class="project-list">
      <el-table :data="filterData" max-height="500" v-loading="isLoading" class="project-table">
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column label="日期" width="220">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="content" label="内容" width="450"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.state =='已查看'" type="success" disable-transitions>{{ scope.row.state }}</el-tag>
            <el-tag v-show="scope.row.state =='未查看'" type="danger" disable-transitions>{{ scope.row.state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" v-show="scope.row.state=='未查看'" @click="change(scope.row.messageId)">已读</el-button>
          </template>
        </el-table-column>
      </el-table>
      <message-remind></message-remind>
      <ProjectPagination :data="data" :filter-data.sync="filterData"></ProjectPagination>
    </div>
  </div>
</template>
<script>
import ProjectPagination from "@/components/ProjectPagination";
import MessageRemind from "@/components/MessageRemind";
export default {
  components: {
    ProjectPagination,
    MessageRemind
  },
  methods: {
    handleClick(tab, event) {
      this.getMsgNum();
      switch (tab.name) {
        case "all":
          this.data = this.tableData;
          break;
        case "read":
          this.data = this.tableData.filter(states => states.state == "已查看");
          break;
        case "unread":
          this.data = this.tableData.filter(states => states.state == "未查看");
          break;
      }
    },
    change(messageId) {
      this.$store.dispatch("changeId", messageId).then(() => this.loadData()).catch(err => this.$message.error("数据获取失败"));
    },
    //根据信息id获取，本来应该根据身份id获取
    loadData() {
      this.$store
        .dispatch("qesMessage", {
          userGet: this.userId
        })
        .then(res => {
          this.data = this.tableData;
          this.isLoading = false;
          this.getMsgNum();
        })
        .catch(() => {
          this.$message.error("数据获取失败");
          this.isLoading = false;
        });
    }
  },
  created() {
    if (this.pageEnterState) {
      if (this.msgLen === 0) {
        const route = this.$store.getters.addRouter;
        this.$router.push(route[0].path);
      } else {
        this.data = this.tableData;
        this.isLoading = false;
      }
      this.$store.commit("SET_PAGE_ENTER_STATE", false);
    } else {
      this.loadData();
    }
  },

  computed: {
    tableData() {
      return this.$store.state.message;
    },
    userId() {
      return this.$store.state.userId;
    },
    pageEnterState() {
      return this.$store.state.pageEnterState;
    },
    msgLen() {
      let newarry = this.tableData.filter(
        states => states.state == "未查看"
      );
      return newarry.length;
    }
  },
  data() {
    return {
      // 用于储存请求到的所有数据,作为筛选容器
      data: [],
      filterData: [],
      // 默认显示的
      activeName: "all",
      isLoading: true
    };
  }
};
</script>
<style>
#message .el-tabs__header {
  margin: 0;
  padding: 0 20px;
}
#message {
  box-sizing: border-box;
  padding: 20px;
}
</style>

