<template>
<div>
    <div class='detail'>
      <i class="el-icon-back return"  @click="goBack" title="返回上一页">返回</i>
      <!--<el-button type="success" @click="save" class="save">保存</el-button>-->
      <div class="title">团队基本信息</div>
        <div class="center">
          <span>团队名：</span>
          <span>{{copyInfo[0].teamName}}</span>
          <span class="iconfont edit" @click="editTeam()">&#xe650;</span>
        </div>
        <div class="center">
          <span>团队简介：</span>
          <span>{{copyInfo[0].description}}</span>
        </div>
      <div class="center">
        <span>团队方向：</span>
        <span>{{teamDirection[copyInfo[0].direction]}}</span>
      </div>
      <div>
        <span class="center">团队成员信息：
          <i class="el-icon-caret-top up_down" v-if="up_down_show.member" @click="up('member')"></i>
        <i class="el-icon-caret-bottom up_down" v-if="!up_down_show.member" @click="down('member')"></i>
        </span>

        <div  class="member_info">
          <div class="menDetail"  ref="member_info">
            <div class="add">
              <span class="iconfont " title="新增成员" @click="add">&#xe61a;</span>
            </div>
            <div class="info">
              <span class="iconfont captainEdit" @click="editMember(-1)">&#xe650;</span>
              <div>队长：
                <span>{{copyInfo[0].captainInformation[0].name}}</span>
              </div>
              <div>方向: <span>{{copyInfo[0].captainInformation[0].direction}}</span> </div>
              <div>专业：  <span>{{copyInfo[0].captainInformation[0].major}}</span></div>
              <div>学号： <span>{{copyInfo[0].captainInformation[0].studentId}}</span> </div>
              <div>学院：  <span>{{copyInfo[0].captainInformation[0].department}}</span></div>
              <div>电话： <span>{{copyInfo[0].captainInformation[0].telNumber}}</span></div>
              <div>性别：  <span>{{copyInfo[0].captainInformation[0].sex}}</span></div>

              <div>简介： <textarea class="content shortinfor"
                                 v-model="copyInfo[0].captainInformation[0].description">
                        </textarea></div>
            </div>
            <div class="info" v-for="(data,key) in copyInfo[0].memberInformation" :key="key">
              <div>队员：
                <span>{{data.name}}</span>
                <span class="el-icon-close delete" @click="deleteMember(key)"> </span>
                <span class="iconfont edit" @click="editMember(key)">&#xe650;</span>
              </div>
              <div>方向: <span>{{data.direction}}</span> </div>
              <div>专业：  <span>{{data.major}}</span></div>
              <div>学号： <span>{{data.studentId}}</span> </div>
              <div>学院：  <span>{{data.department}}</span></div>
              <div>电话： <span>{{data.telNumber}}</span></div>
              <div>性别：  <span>{{data.sex}}</span></div>
              <div><span class="short">简介：</span><textarea class="content shortinfor"
                                                           :title="data.description"
                                                           v-model="data.description">{{data.description}}</textarea> </div>
            </div>
            <div style="clear:both"></div>
          </div>
        </div>
      </div>
<!--      <div>-->
<!--        <div  class="member_info">-->
<!--          <div class="menDetail"  ref="products_info">-->
<!--            <div style="clear:both"></div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->

      <div class="center">
        <span>团队分数：</span>
        <span>{{this.copyInfo[0].teamScore|formData}}</span>
      </div>
      <div class="center">
        <span>创建时间：</span>
        <span>{{this.copyInfo[0].createTime|formData}}</span>
      </div>
      <div class="center">
        <span>队员数量：</span>
        <span>{{this.copyInfo[0].number|formData}}</span>
      </div>
</div>
  <addPeople @hidden="hidden"
             v-if="show_if"
             key="add"
             :teamId="teamId"
             :studentId="studentId"
             @success="addSuccess"
             @fail="fail('操作失败')"
  ></addPeople>
  <editMember  @hidden="hidden"
               key="edit"
             v-if="edit_show"
             :teamId="teamId"
             :studentId="studentId"
             :editInformation="editInformation"
             @success="addSuccess"
             @fail="fail('操作失败')"
  ></editMember >
  <editTeam @hidden="hidden"
               key="team"
               v-if="edit_team_show"
               :teamId="teamId"
               :editInformation="detail_info"
               @success="addSuccess"
               :teamDirection="teamDirection"
               @fail="fail('操作失败')"
  ></editTeam>

</div>
</template>
<script>
  import addPeople from '@/views/teamManage/components/addPeople.vue'
  import editMember from '@/views/teamManage/components/editMember.vue'
  import editTeam from '@/views/teamManage/components/editTeam.vue'
  import { getTeam } from "@/api/team";
  import { deleteTeamMate } from "@/api/team";
  import { getAllTeamDirection } from "@/api/team";
  import { getAllUserDirection } from "@/api/team";
  export default {
    components:{
      addPeople,
      editMember,
      editTeam
    },
    props: ['detail_info', 'copyInfo'],
    data() {
      return {
        up_down_show: {member:false, products:false,},
        show_if:false,  /*新增成员组件显示与否*/
        edit_show:false,//编辑成员信息
        edit_team_show:false,//编辑团队资料
        studentId:[],  /*记录所有学生学号，验证数据防止重复添加人员*/
        teamDirection:[], //团队方向
        userDirection:[],  //用户方向
        editInformation:{},
      }
    },
    filters: {
      formData(value) {
        return value === '' ? '~' : value;
      }
    },
    methods: {
      editTeam(){
        this.editInformation['teamName']=this.detail_info[0].teamName;
        this.editInformation['direction']=this.detail_info[0].direction;
        this.editInformation['description']=this.detail_info[0].description;
        this.edit_team_show=true;
      },
      addSuccess(msg){
        this.success(msg);
        this.$emit('refresh'); /*添加成员成功后更新数据*/
      },
      goBack() {  /*返回上一级*/
        this.$emit('goBack')
      },
      hidden(){ /*新增成员,编辑陈成员组件显示与否*/
        this.show_if=false;
        this.edit_show=false;
        this.edit_team_show=false;
      },
      add(){   /*新增成员组件显示与否*/
        this.show_if=true;
      },
      editMember(index){
        console.log(this.detail_info)
        this.edit_show=true;
        if(index===-1){
          this.editInformation=this.detail_info[0].captainInformation[0];
        }
        else{
          this.editInformation=this.detail_info[0].memberInformation[index];
        }

      },
      deleteMember(index){   /*删除成员*/
        let that=this;
        this.$confirm('是否确定删除该成员, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          deleteTeamMate(this.userId[index],this.teamId).then(function (res) {
            if(res.status===0&&res.msg==='成功'){
              that.success('操作成功!');
              that.$emit('refresh'); /*删除成功后更新数据*/
            }
            else{
              console.log(res)
              that.fail('发生错误,删除失败！');
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      success(msg) {  /*成功操作提示*/
        this.$message({
          message: msg,
          type: 'success'
        });
      },
      fail(msg) {  /*失败操作提示*/
        this.$message.error(msg);
      },
      down(type) {
        if(type==='member'){
          this.$set(this.up_down_show,'member',true) ;
          this.$refs.member_info.style.display = 'block';
          // this.$refs.member_info.style.height = 'auto';
        }
        else{
          this.$set(this.up_down_show,'products',true) ;
          this.$refs.products_info.style.display = 'block';
        }

      },
      up(type) {
        if(type==='member'){
          this.$set(this.up_down_show,'member',false) ;
          this.$refs.member_info.style.display = 'none';
          // this.$refs.member_info.style.height = 0;
        }
        else{
          this.$set(this.up_down_show,'products',false) ;
          this.$refs.products_info.style.display = 'none';
        }
      },
      getDirection(){
        getAllTeamDirection().then((res)=>{ //获取团队方向
          if(res.status===0){
            let data=res.data;
            console.log(data)
            for(let i=0;i<data.length;i++){
              let temp={};
              temp.text= temp.value=data[i].directionName;
              this.teamDirection.push(data[i].directionName); /*产生团队方向对象*/
            }
          }
          else{
            this.fail('糟糕,获取个人方向列表失败！')
          }
        });
        getAllUserDirection().then((res)=>{ //获取用户个人方向
          if(res.status===0){
            let data=res.data;
            console.log(data);
            for(let i=0;i<data.length;i++){
              let temp={};
              temp.text= temp.value=data[i].directionName;
              this.userDirection.push(data[i].directionName); /*产生团队方向对象*/
            }
          }
          else{
            this.fail('糟糕,获取团队方向列表失败！')
          }
        });
      },
      refresh(){
        this.$emit('refresh');
      },
      getStudentId(){  /*获取所有人员学号，用于添加成员时验证数据防止重复添加*/
        let captainId=this.detail_info[0].captainInformation[0].studentId;
        this.studentId.push(captainId);
        let member=this.detail_info[0].memberInformation;
        for(let i=0;i<member.length;i++){
          let tempId=member[i].studentId;
          this.studentId.push(tempId);
        }
      }
    },
    computed:{
      teamId(){ /*收集团队id*/
        return this.detail_info[0].teamId;
      },
      userId(){   /*收集用户id*/
        let idList=this.detail_info[0].memberInformation;
        let id=[];
        for(let i=0;i<idList.length;i++){
          let temp=idList[i].userId;
          id.push(temp);
        }
        return id;
  }
    },
  watch:{
      detail_info(){  /*监听团队详细信息，更新时更新学号列表*/
        this.getStudentId();
      }
    },
    mounted(){ /*监听团队详细信息，更新时更新学号列表*/
      this.getStudentId();
    }
  }
</script>
<style scoped>
 .info div{
   font-weight: bold;
 }
.strong {
  font-weight: bold;
}
.up_down{
  transition: all 0.5s;
  font-size: 28px;
  cursor: pointer;
  color:#666;
  user-select: none;
}
.edit,.captainEdit{
  margin-left: 40px;
  margin-right: 10px;
  font-size: 20px;
  cursor: pointer;
}
.captainEdit{
  position: absolute;
  right:10px;
  margin-right: 10px;
  top: 10px;
}
.return {
  margin-left: 30px;
  font-size: 20px;
  cursor: pointer;
  color:white;
  margin-top: 15px;
  border: 1px solid #eee;
  background-color: rgba(1,1,1,0.3);
  padding: 5px;
  border-radius: 5px;
}
/*.center {*/
  /*position: relative;*/
  /*left: 50%;*/
/*}*/
 .add {
  text-align: center;
}
.add span {
  font-size: 35px;
  color:green;
  cursor: pointer;
  user-select: none;
}

 .detail{
   background-color : white;
   padding-bottom: 20px;
 }
 .detail span {
   font-weight: bold;
 }
 .detail div {
   margin: 10px 0;
   padding-left: 20px;
 }
 .title {
   text-align: left;;
   line-height: 30px;
   background-color: #eee;
   border: 1px solid #ccc;
   font-weight: bold;
   margin: 0;
 }
 .member {
   width: 80px;
 }
 .delete {
   float: right;
   color:red;
   font-size: 25px;
   cursor: pointer;
 }
 .detail .member_info {
   margin-right: 20px;
   padding-left: 0;
 }
 .menDetail{
   /*overflow: hidden;*/
   /*transition: all 0.5s;*/
   display: none;
   min-height:10px;
   padding-top: 10px;
   background-color: #bbb;
 }
 .content {
   padding-left: 10px;
   white-space: nowrap;
   text-overflow: ellipsis;
   max-width: 400px;
   overflow: hidden;
 }
 .detail .info {
   position: relative;
   margin: 20px 20px;
   padding-right: 10px;
   float: left;
   max-width: 300px;
   box-shadow: 7px 5px 2px ;
   background-color: white;
 }
 .shortinfor {
   display: inline-block;
   max-width: 200px;
   height: 15px;
   vertical-align: middle;
   border: none;
 }
  .save {
    margin-left: 20px;
  }
</style>
