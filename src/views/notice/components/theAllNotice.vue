<template>
  <div class="allNotice">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="标题" width="180"></el-table-column>
      <el-table-column prop="authorName" label="发布人" width="180"></el-table-column>
      <el-table-column prop="createTime" label="发布时间" width="180"></el-table-column>
      <el-table-column prop="content" label="内容简介"></el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detail(scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="deleteNoticeHandler(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total"
    ></el-pagination>
  </div>
</template>
<script>
import {
  getStudenId,
  noticeList,
  noticeDetail,
  deleteNotice
} from "@/api/notice";
export default {
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      routeFrom: "",
      tableData: []
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getNoticeList() {
      noticeList().then(res => {
        if (res.status === 0) {
          this.tableData = res.data;
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].content = this.tableData[i].content
              .replace(/<[^>]+>/g, "")
              .replace(/&nbsp;/g, "")
              .slice(0, 28);
            if (this.tableData[i].content.length > 27) {
              this.tableData[i].content = this.tableData[i].content + "......";
            }
          }
        }
      });
    },
    deleteNoticeHandler(val) {
      deleteNotice(val.announcementId).then(res => {
        if (res.status === 0) {
          this.$message.success("删除成功。");
          this.getNoticeList();
        } else {
          console.log(res);
          this.$message.error("糟糕，删除失败了！");
        }
      });
    },
    detail(val) {
      this.$router.push({
        name: "noticeDetail",
        params: { announcementId: val.announcementId }
      });
    }
  },
  created() {
    this.getNoticeList();
  }
};
</script>
<style>
.allNotice {
  width: 100%;
}
.page {
  float: right;
  margin-top: 20px;
  margin-right: 20px;
}
</style>
