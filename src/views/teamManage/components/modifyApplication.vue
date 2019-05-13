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
        prop="modificationPlace"
        width="150"
        align="center"
        label="修改类型">
      </el-table-column>
      <el-table-column
        prop="originalData"
        min-width="300"
        align="center"
        label="原内容"
      >
      </el-table-column>
        <el-table-column
          prop="modificationContent"
          align="center"
          min-width="300"
          label="新内容"
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
            @click="agree_refuse(scope.row,'agree')"
           >同意</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="agree_refuse(scope.row,'refuse')"
           >拒绝</el-button>
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
  import {  getAllTeamDirection } from "@/api/team";
  import {  agreeModify } from "@/api/team";
  import {  getModifyAppliction } from "@/api/team";

  export default {
    data() {
      return {
        tableData: [],
        total: 0,
        currentPage: 1,
        pageSize: 10,
        loading: false,
        userDirection:{},
        teamDirection:{}
      }
    },
    methods: {
      agree_refuse(val, handle) {   /*同意或者拒绝操作*/
        let that = this;
        let state = '';
        if (handle === 'agree') {
          state = '已审核';
        }
        else {
          state = '条件不满足'
        }
        agreeModify( val.modificationId,state).then(function (res) { //同意或者拒绝团队修改申请
          if (res.status === 0) {
            that.success('操作成功!');
            that.getData();/*成功后重新获取数据*/
            that.$emit('updateMsgNumber')/*发送更新消息数量事件*/
          }
          else {
            that.fail('发生了错误，操作失败！');
          }
        }).catch((err) => {
          that.fail('糟糕，发生了错误,操作失败!!')
        })
      },
      getDirection(){
        getAllTeamDirection().then((res)=>{
          console.log(res)
          if(res.status===0){
            let data=res.data;
            for(let i=0;i<data.length;i++){
              let temp={};
              temp.text= temp.value=data[i].directionName;
              this.teamDirection[data[i].id]=data[i].directionName; /*产生团队方向对象，如{1:'web',2:'java'}*/
            }

          }
          else{
            this.fail('糟糕,获取团队方向失败！')
          }
        })
      },
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData()
    },
    getData() {   /*获取所有数据，并根据每页数据条数和当前页数返回数据*/
      let that = this;
      that.loading = true;
      getModifyAppliction().then(function (res) {
        if (res.status === 0) {
          that.loading = false;
          let temData = res.data.modificationTeam;
          console.log('tempData')
          console.log(temData)
          for(let i=0;i<temData.length;i++){
            let type=temData[i].modificationPlace;
            let result=type.split('_');
            if(result.length===2){
              let obj={teamName:'团队名称',description:'团队简介',direction:'团队方向'};
              temData[i].modificationPlace=obj[result[1]];
            }
            if(result.length===3){
              let obj={department:'学院',major:'专业', direction:'个人方向', sex:'性别', description:'个人简介',telNumber:'联系电话'};
              temData[i].modificationPlace=obj[result[2]];
            }
          }
          that.total = res.data.modificationTeam.length;

          if (that.pageSize > that.total) {
            that.tableData = temData;
          }
          else {
            that.tableData = temData.splice(that.pageSize * (that.currentPage - 1), that.pageSize);
          }
        }
        else {
          fail('获取数据失败！');
          that.tableData = [];
          that.loading = false;
        }
      }).catch(() => {
        that.loading = false;
        that.fail('糟糕，发生了错误，获取数据失败！')
      })
    },
    },
    created(){
      this.getData();
      this.getDirection();
    }
  }

</script>
<style>
.page{
  float:right;
  margin-top: 20px;
  margin-right: 50px;
}
</style>
