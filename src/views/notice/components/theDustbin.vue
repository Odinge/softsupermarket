<template>
  <div class="allNotice">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="标题" width="180">
      </el-table-column>
      <el-table-column prop="createTime" label="发布时间" width="180">
      </el-table-column>
      <el-table-column prop="content" label="内容简介">
      </el-table-column>
      <el-table-column width="120" prop="authorName" label="发布人">
      </el-table-column>
      <el-table-column label="操作" width="250px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detail(scope.row)">查看</el-button>
          <el-button type="success" size="mini" @click="handleRecover(scope.row)">恢复</el-button>
          <el-button type="danger" size="mini" @click="handleRealDelete(scope.row)">彻底删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="this.total">
    </el-pagination>
  </div>
</template>
<script>
import { publish, getStudenId, noticeList, getUserId, dustbin, recoverNotice, realDelete } from "@/api/notice";
export default {
  data() {
    return {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      tableData: []
    }
  },
  methods: {
    handleRealDelete(val) {
      let announcementId = val.announcementId;
      realDelete(announcementId).then(res => {
        if (res.status === 0) {
          this.$message.success('操作成功');
          this.getData();
        }
        else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
        console.log('糟糕,操作失败！');
      })
    },
    handleRecover(val) {
      let announcementId = val.announcementId;
      recoverNotice(announcementId).then(res => {
        // console.log(res)
        if (res.status === 0) {
          this.$message.success('操作成功');
          this.getData();
        }
        else {
          this.$message.error(res.msg);
        }
      }).catch(err => {
        console.log(err);
        console.log('糟糕,操作失败！');
      })
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData()
    },
    detail(val) {
      this.$router.push({ name: 'noticeDetail', params: { announcementId: val.announcementId } });
    },
    getData() {
      dustbin().then((res) => {
        if (res.status === 0) {
          let data = res.data;
          // console.log(data.length)
          for (let i = 0; i < data.length; i++) {
            data[i].content = data[i].content.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, '').slice(0, 28);
            if (data[i].content.length > 27) {
              data[i].content = data[i].content + '....';
            }
          }
          this.total = data.length;
          if (this.pageSize > this.total) {
            this.tableData = data;
          }
          else {
            this.tableData = data.splice(this.pageSize * (this.currentPage - 1), this.pageSize);
          }
        }
      })
    },
  },
  created() {
    this.getData()
  }
}
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
