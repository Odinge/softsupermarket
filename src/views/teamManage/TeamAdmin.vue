<template>
  <div class='team-manage'>
    <el-tabs v-model="activeName" @tab-click="paneClick">
      <el-tab-pane label="全部团队" name='allTeam'></el-tab-pane>
      <el-tab-pane label="新建团队申请" name='newTeam'></el-tab-pane>
      <el-tab-pane label="团队修改申请" name='modifyApplication'></el-tab-pane>
      <el-tab-pane label="黑名单" name='blackList'></el-tab-pane>
    </el-tabs>
    <div class="newMsg msg" v-show="createMsg">{{createMsg}}</div>
    <div class="modifyMsg msg" v-show="modifyMsg">{{modifyMsg}}</div>
    <div class="blackListMsg msg" v-show="blackListMsg">{{blackListMsg}}</div>

    <div class="excelTemplate">
      <el-dropdown>
        <span class="el-dropdown-link">
          导入模板<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <a href="http://www.ghjhhyuyuy.xin:8080/v1/nonpub/examine/getTeamExcelModel">
            <el-dropdown-item command="all">全部团队</el-dropdown-item>
          </a>
          <a href="http://www.ghjhhyuyuy.xin:8080/v1/nonpub/examine/getBlackTeamExcelModel">
            <el-dropdown-item command="black">黑名单</el-dropdown-item>
          </a>
        </el-dropdown-menu>
      </el-dropdown>
      <i class="el-icon-tickets"></i>
    </div>

    <div class="in">
      <el-dropdown @command="handleImportTeam">
        <span class="el-dropdown-link">
          导入团队<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="all">导入团队</el-dropdown-item>
          <el-dropdown-item command="black">导入黑名单</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <i class="el-icon-upload2"></i>
    </div>
    <input type="file" ref="file" class="file" @change="checkFile($event)">
    <a href="http://www.ghjhhyuyuy.xin:8080/v1/nonpub/examine/getAllTeamsToExcel">
      <div class="out">
        <el-dropdown>
          <span class="el-dropdown-link">
            导出团队<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <a href="http://www.ghjhhyuyuy.xin:8080/v1/nonpub/examine/getAllTeamsToExcel">
              <el-dropdown-item command="all">导出全部团队</el-dropdown-item>
            </a>
            <a href="http://www.ghjhhyuyuy.xin:8080/v1/nonpub/supervise/exportBlackListByExcel">
              <el-dropdown-item command="black">导出黑名单</el-dropdown-item>
            </a>
          </el-dropdown-menu>
        </el-dropdown>
        <i class="el-icon-download"></i>
      </div>
    </a>
    <component :is="component" :extend="extend" @msgNumber="handleMsgNumber()" @updateMsgNumber="getMsgNumber"></component>
  </div>
</template>
<script>
import blackList from '@/views/teamManage/components/blackList.vue'
import allTeam from '@/views/teamManage/components/allTeam.vue'
import modifyApplication from '@/views/teamManage/components/modifyApplication.vue'
import { getTeam } from "@/api/team";
import { getModifyAppliction, importTeam, getNewApplication, getBlackTeamList } from "@/api/team";
import { importBlack } from "../../api/team";


export default {
  components: { allTeam, modifyApplication, blackList, importBlack },
  data() {
    return {
      activeName: 'allTeam',
      component: 'allTeam',
      extend: false, /*是否显示allTeam中删除和同意按钮*/
      createMsg: '',
      modifyMsg: '',
      blackListMsg: '',
      uploadType: '',
    }
  },
  methods: {
    downloadModel() {

    },
    paneClick(tab) {   /*点击改变组件名字，从而切换视图*/
      if (tab.name === 'allTeam') {
        this.component = 'allTeam';
        this.extend = false;
      }
      else if (tab.name === 'newTeam') {
        this.component = 'allTeam';
        this.extend = true;
      }
      else {
        this.component = tab.name;
      }
      // location.hash = tab.name;
    },
    handleImportTeam(type) {
      this.uploadType = type;
      this.$refs.file.click();
    },
    checkFile(e) {
      let event = e || window.event;
      let file = event.target.files[0];
      let fileName = file.name;
      let suffix = fileName.substring(fileName.lastIndexOf('.'), fileName.length);//文件后缀名
      if (!/xlsx?/gm.test(suffix)) {
        this.$message.error('文件类型错误，请上传EXCEL文件！');     //弹出类型错误显示框
        this.$refs.file.value = '';                   //文件类型错误，清空上传文件内容
        return false
      }
      else {
        let formData = new FormData();
        formData.append('file', file);
        // importBlack(formData).then(res=>{
        //   console.log(res)
        // })
        (async () => {
          let result = '';
          if (this.uploadType === 'black') {
            result = await importBlack(formData).catch((err) => {
              this.$message.error('糟糕，导入团队失败！');
              console.log(err)
            });
          }
          else {
            result = await importTeam(formData).catch((err) => {
              this.$message.error('糟糕，导入团队失败！');
              console.log(err)
            });
          }
          if (result.status === 0) {
            this.$message.success('导入团队成功！');
          } else {
            console.log(result)
            this.$message.error(result.msg);
          }
        })();

      }
    },
    handleMsgNumber(type, number) { /*处理子组件传过来的消息数量*/
      // console.log(number,type);
    },
    getMsgNumber() {
      let that = this;/*查询获取所有新建团队信息数量*/
      getNewApplication().then((res) => {
        if (res.status === 0) {
          that.createMsg = res.data.length;
        }
        else {
          that.createMsg = ''
        }
      });
      /*查询获取所有修改团队信息数量*/
      getModifyAppliction().then((res) => {
        if (res.status === 0) {
          that.modifyMsg = res.data.modificationTeam.length;
        }
        else {
          that.modifyMsg = '';
        }
      });
      // getBlackTeamList().then(res => { //获取黑名单列表
      //   if (res.status === 0) {
      //     this.blackListMsg = res.data.blackTeamList.length;

      //   }
      //   else {
      //     this.blackListMsg = '';
      //   }
      // });
    },
  },

  // computed:{
  //   view(){
  //     return this.$route.params.viewName;
  //   }
  // },
  created() {
    // if(this.view){  /*记录用户上一页所在位置*/
    //   this.component=this.view;
    // }else{
    //   this.component='allTeam';
    // }
    // this.component=location.hash.slice(1);
    // console.log(location.hash.slice(1))
    // this.activeName=location.hash.slice(1);
    // console.log(location.hash.slice(1));
    this.getMsgNumber();
  }
}
</script>
<style scoped>
.team-manage {
  background-color: #eee;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}
.file {
  visibility: hidden;
  position: absolute;
}
.out,
.in,
.excelTemplate {
  position: absolute;
  right: 120px;
  top: 25px;
  line-height: 20px;
  cursor: pointer;
  font-size: 20px;
}
.in {
  right: 300px;
}
.excelTemplate {
  right: 500px;
}
.msg {
  position: absolute;
  height: 15px;
  line-height: 15px;
  min-width: 23px;
  text-align: center;
  padding: 0 3px;
  font-size: 12px;
  border-radius: 40%;
  z-index: 5000;
  color: white;
  background-color: #f56c6c;
}
.newMsg {
  top: 20px;
  left: 200px;
}
.modifyMsg {
  top: 20px;
  left: 300px;
}
.blackListMsg {
  top: 20px;
  left: 400px;
}
</style>
