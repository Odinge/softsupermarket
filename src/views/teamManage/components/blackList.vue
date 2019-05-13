<template>
  <div>
    <el-table
      v-loading="loading"
      class="tb"
      :data="tableData"
      style="width: 100%"
      max-height="520"
    >
      <el-table-column
        prop="teamName"
        width="150"
        align="center"
        label="团队名称">
      </el-table-column>
      <el-table-column
        prop="direction"
        min-width="150"
        align="center"
        label="方向"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        min-width="150"
        align="center"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop="teamScore"
        min-width="150"
        align="center"
        label="团队得分"
      >
      </el-table-column>
      <el-table-column
        prop="description"
        align="center"
        min-width="300"
        label="团队简介"
      >
      </el-table-column>
      <el-table-column label="操作"  width="250" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="detail(scope.row)"
          >查看</el-button>
          <el-button
            size="mini"
            type="success"
            @click="remove(scope.row)"
          >撤销</el-button>
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
      :total="this.total">
    </el-pagination>
  </div>
</template>
<script>
  import {  cancelBlackList } from "@/api/team";
  import {  getBlackTeamList } from "@/api/team";
  import {  getAllNewAppliction } from "@/api/team";
  export default {
  data(){
    return{
      tableData:[],
      total:0,
      currentPage:1,
      pageSize:10,
      loading: false
    }
  },
    methods:{
      detail(val){
        this.$router.push({name:'teamDetail',params:{id:val.teamId}});
      },
      success(msg) {
        this.$message({
          message: msg,
          type: 'success'
        });
      },
      fail(msg) {
        this.$message.error(msg);
      },
      handleSizeChange(val){
        this.pageSize=val;
        this.getData()
      },
      handleCurrentChange(val){
        this.currentPage=val;
        this.getData()
      },
      remove(row){
        cancelBlackList(row.teamId).then((res)=>{  //从黑名单中撤销
          if(res.status===0){
            this.getData();
            this.success('撤销黑名单成功！');
          }
          else{
            fail('操作失败！');
          }
        }).catch(()=>{
          fail('糟糕，操作失败！');
        })

      },
      getData(){
        let that=this;
        getBlackTeamList().then((res)=>{ //获取黑名单列表
          if(res.status===0) {
            that.loading = false;
            let temData=res.data.blackTeamList;
            that.total=res.data.blackTeamList.length;
            if(that.pageSize>that.total){
              that.tableData=temData;
            }
            else{
              that.tableData=temData.splice(that.pageSize*(that.currentPage-1),that.pageSize);
            }
          }
          else{
            fail('获取数据失败！');
            that.tableData=[];
            that.loading=false;
          }
        }).catch(()=>{
          that.loading=false;
          that.fail('糟糕，发生了错误，获取数据失败！')
        })
          }
    },
    created(){
    this.getData();
    }
  }
</script>
<style scoped>

</style>
