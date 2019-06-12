<template>
  <div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%" max-height="500">
      <el-table-column prop="teamName" width="200" align="center" label="团队名">
      </el-table-column>
      <el-table-column prop="direction" align="center" width="200" :filters="formDirection" :filter-method="filterHandler" label="团队方向">
      </el-table-column>
      <el-table-column prop="number" width="100" align="center" label="成员数量">
      </el-table-column>
      <el-table-column align="center" min-width="200" prop="description" label="团队描述">
      </el-table-column>
      <el-table-column label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="detail(scope.row)">查看</el-button>
          <el-button v-if="extend" size="mini" type="success" @click="agree_refuse(scope.row,'agree')">同意</el-button>
          <el-button v-if="extend" size="mini" type="danger" @click="agree_refuse(scope.row,'refuse')">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="this.total">
    </el-pagination>
  </div>
</template>
<script>
import { getTeam } from "@/api/team";
import { getAllNewAppliction } from "@/api/team";
import { agreeModify } from "@/api/team";
import { getAllTeamDirection } from "@/api/team";
import { getNewApplication } from "@/api/team";

export default {
  props: ['extend'],
  data() {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: false,
      formDirection: [],  /*格式化后的方向，用于根据方向筛选团队*/
      direction: {},
    }
  },
  methods: {
    detail(val) {
      this.$router.push({ name: 'teamDetail', params: { id: val.teamId } });
    },
    agree_refuse(val, handle) {   /*同意或者拒绝操作*/
      let that = this;
      let state = '';
      if (handle === 'agree') {
        state = '已审核';
      }
      else {
        state = '条件不满足';
      }
      agreeModify(val.teamId, state).//
        then(function (res) {
          // console.log(res)
          if (res.status === 0 && res.msg === '成功') {
            that.success('审核成功!');
            that.getData();   /*成功后重新获取数据*/
            that.$emit('updateMsgNumber')/*发送更新消息数量事件*/
          }
          else {
            that.fail('发生了错误，操作失败！');
          }
        }).catch(() => {
          that.fail('糟糕，系统异常，操作失败！');
        })

    },
    getDirection() {
      getAllTeamDirection().then((res) => {
        if (res.status === 0) {
          let data = res.data;
          for (let i = 0; i < data.length; i++) {
            let temp = {};
            temp.text = temp.value = data[i].directionName;
            this.direction[data[i].id] = data[i].directionName; /*产生团队方向对象，如{1:'web',2:'java'}*/
            this.formDirection.push(temp);
          }
        }
        else {
          this.fail('糟糕,获取团队方向失败！')
        }
      })
    },
    // getTeamByDirection(){
    //   this.$http.get('http://www.ghjhhyuyuy.xin:8080/v1/nonpub/publish/teambydirection',{params:{direction:"1"}}).then((res)=>{
    //     if(res.status===0){
    //
    //     }
    //   })
    // },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value + '';
    },
    getData() {
      let that = this;
      that.loading = true;
      if (this.extend) {
        getNewApplication().then(function (res) {   //获取新建团队申请

          if (res.status === 0) {
            // console.log(res.data)
            that.loading = false;
            that.total = res.data.length;
            let data = res.data;
            let tempData = [];

            for (let i = 0; i < data.length; i++) {
              var temp = data[i].team;
              let directionNum = data[i].team.direction;
              // temp.direction = that.direction[directionNum + '']  /*根据团队方向数字映射对应的文字*/
              temp.direction = directionNum;
              temp.description = data[i].team.description || '暂无';
              temp.captain = data[i].captain.name;
              temp.peopleNumber = data[i].memberPOS.length;
              tempData.push(temp);
            }
            if (that.pageSize > that.total) {
              that.tableData = tempData;
            }
            else {
              that.tableData = tempData.splice(that.pageSize * (that.currentPage - 1), that.pageSize);
            }
          }
          else {
            console.log(res)
            that.fail('获取数据失败！');
            that.tableData = [];
            that.loading = false;
            that.total = 0;
          }
        }).catch(() => {
          that.fail('获取数据失败！');
          that.tableData = [];
          that.loading = false;
          that.total = 0;
        })
      }
      else {
        //获取所有团队信息
        getTeam().then(function (res) {
          if (res.status === 0) {
            that.loading = false;
            that.total = res.data.length;
            let data = res.data;
            console.log(data)
            // let tempData=[];
            let tempData = res.data;
            // for(let i=0;i<data.length;i++){
            //   let temp={};
            //   let directionNum=data[i].direction;
            //   temp.direction = that.direction[directionNum+'']; /*根据团队方向数字映射对应的文字*/
            //   temp.teamName=data[i].teamName;
            //   temp.peopleNumber=data[i].memberInformation.length;
            //   temp.teamId=data[i].teamId;
            //   temp.description=data[i].description||'暂无';
            //   tempData.push(temp);
            // }
            if (that.pageSize > that.total) {
              that.tableData = tempData;
            }
            else {
              that.tableData = tempData.splice(that.pageSize * (that.currentPage - 1), that.pageSize);
            }
          }
          else {
            that.fail('获取数据失败！');
            that.tableData = [];
            that.loading = false;
            that.total = 0;
          }
        }).catch(() => {
          that.fail('获取数据失败！');
          that.tableData = [];
          that.loading = false;
          that.total = 0;
        })
      }

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
  },
  created() {
    this.getDirection();/*获取方向*/
    this.getData();
  },
  watch: {
    extend() {
      this.getData();
    }
  }
}
</script>
<style scoped>
.page {
  float: right;
  margin-top: 20px;
  margin-right: 50px;
}
</style>
